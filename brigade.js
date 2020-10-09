const { events, Job } = require("brigadier");

events.on("push", (e, project) => {
  console.log("received push for commit " + e.commit)

  var testJob = new Job("test-runner")

  testJob.image = "maven:3.6.3-openjdk-8"

  testJob.tasks = [
    "cd /src",
    "mvn test"
  ]

  testJob.run().then( () => {
    events.emit("test-done", e, project)
  })
})

events.on("test-done", (e, project) => {
  console.log("Building docker image")

  var dockerBuild = new Job("docker-build")

  dockerBuild.image = "docker:dind"
  dockerBuild.privileged = true;
  
  
  dockerBuild.env = {
    DOCKER_DRIVER: "overlay"
  }
  
  //dockerBuild.env.DOCKER_USER = project.secrets.dockerLogin
  //dockerBuild.env.DOCKER_PASS = project.secrets.dockerPass
  
  dockerBuild.env.ACR = project.secrets.acr
  dockerBuild.env.ACR_USER = project.secrets.acrLogin
  dockerBuild.env.ACR_PASS = project.secrets.acrPass
  dockerBuild.env.BUILD_ID = e.buildID
  
  dockerBuild.tasks = [
    "dockerd-entrypoint.sh &",
    "sleep 50",
	"cd /src",
    //"docker build -t abinashkd/brigade-java-test:latest .",
	
	"docker login $ACR -u $ACR_USER -p $ACR_PASS",
	"docker build -t $ACR/brigade-java-test:$BUILD_ID .",
	//"docker tag brigade-java-test $ACR/brigade-java-test:latest",
	"docker push $ACR/brigade-java-test:$BUILD_ID"
	
	
    //"docker login aklearn.azurecr.io -u $DOCKER_USER -p $DOCKER_PASS",
    //"docker push abinashkd/brigade-java-test:latest"
  ]

  dockerBuild.run().then( () => {
    events.emit("build-done", e, project)
  })
})

events.on("build-done", (e, project) => {
  console.log("Deploying to cluster")

  //var deploy = new Job("deploy-runner")
  var deploy = new Job("deploy-runner", "bitnami/kubectl:latest")
  deploy.env.BUILD_ID = e.buildID 
 
  deploy.tasks = [
	"cd /src",
	"kubectl get pods",
	"kubectl get deployments",
	"export tag=$BUILD_ID",
	`cat <<EOF >./kustomization.yaml
     resources:
      - deploy.yaml
     images:
      - name: brigade-java-test
        newTag: $BUILD_ID
     EOF`
    //"envsubst < deploy.yaml | kubectl apply -f -"
    //"kubectl apply -f deploy.yaml"
	kubectl apply -k .
  ]
  
  deploy.run().then( () => {
    events.emit("success", e, project)
  })
})

events.on("error", (e, project) => {
  console.log("Notifying Slack of failure")
  var slack = new Job("slack-notify", "technosophos/slack-notify:latest", ["/slack-notify"])

  // This doesn't need access to storage, so skip mounting to speed things up.
  slack.storage.enabled = false
  slack.env = {
    // It's best to store the slack webhook URL in a project's secrets.
    SLACK_WEBHOOK: project.secrets.SLACK_WEBHOOK,
    SLACK_USERNAME: "MyBot",
    SLACK_TITLE: "CI/CD Deployment failure",
    SLACK_MESSAGE: "The CI/CD Deployment is failure",
    SLACK_COLOR: "#0000ff"
  }
  slack.run()
})

events.on("success", (e, project) => {
  console.log("Notifying Slack of success")
  var slack = new Job("slack-notify", "technosophos/slack-notify:latest", ["/slack-notify"])

  // This doesn't need access to storage, so skip mounting to speed things up.
  slack.storage.enabled = false
  slack.env = {
    // It's best to store the slack webhook URL in a project's secrets.
    SLACK_WEBHOOK: project.secrets.SLACK_WEBHOOK,
    SLACK_USERNAME: "MyBot",
    SLACK_TITLE: "CI/CD Deployment Success",
    SLACK_MESSAGE: "The CI/CD Deployment is Success",
    SLACK_COLOR: "#0000ff"
  }
  slack.run()
})