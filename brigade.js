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
  
  dockerBuild.env.DOCKER_USER = project.secrets.dockerLogin
  dockerBuild.env.DOCKER_PASS = project.secrets.dockerPass

  dockerBuild.tasks = [
    "dockerd-entrypoint.sh &",
    "sleep 20",
	"cd /src",
    "docker build -t abinashkd/brigade-java-test:latest .",
    "docker login -u $DOCKER_USER -p $DOCKER_PASS",
    "docker push abinashkd/brigade-java-test:latest"
  ]

  dockerBuild.run().then( () => {
    events.emit("build-done", e, project)
  })
})

events.on("build-done", (e, project) => {
  console.log("Deploying to cluster")

  var deploy = new Job("deploy-runner", "bitnami/kubectl:latest")

  deploy.tasks = [
    "kubectl apply -f deploy.yml"
  ]

  deploy.run().then( () => {
    events.emit("success", e, project)
  })
})

events.on("error", (e, project) => {
  console.log("Notifying Slack of failure")
})

events.on("success", (e, project) => {
  console.log("Notifying Slack of success")
})