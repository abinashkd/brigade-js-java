const { events, Job } = require("brigadier");

//events.on("push", (e, project) => {
//  console.log("received push for commit " + e.commit)
//
//  var testJob = new Job("test-runner")
//
//  testJob.image = "maven:3.6.3-openjdk-8"
//
//  testJob.tasks = [
//    "cd /src",
//    "mvn test"
//  ]
//
//  testJob.run().then( () => {
//    events.emit("test-done", e, project)
//  })
//})
//
//events.on("test-done", (e, project) => {
//  console.log("Building docker image")
//
//  var dockerBuild = new Job("docker-build")
//
//  dockerBuild.image = "docker:dind"
//  dockerBuild.privileged = true;
//  
//  
//  dockerBuild.env = {
//    DOCKER_DRIVER: "overlay"
//  }
//  
//  //dockerBuild.env.DOCKER_USER = project.secrets.dockerLogin
//  //dockerBuild.env.DOCKER_PASS = project.secrets.dockerPass
//  
//  dockerBuild.env.ACR = project.secrets.acr
//  dockerBuild.env.ACR_USER = project.secrets.acrLogin
//  dockerBuild.env.ACR_PASS = project.secrets.acrPass
//  
//  dockerBuild.tasks = [
//    "dockerd-entrypoint.sh &",
//    "sleep 50",
//	"cd /src",
//    //"docker build -t abinashkd/brigade-java-test:latest .",
//	
//	"docker login $ACR -u $ACR_USER -p $ACR_PASS",
//	"docker build -t $ACR/brigade-java-test:latest .",
//	//"docker tag brigade-java-test $ACR/brigade-java-test:latest",
//	"docker push $ACR/brigade-java-test:latest"
//	
//	
//    //"docker login aklearn.azurecr.io -u $DOCKER_USER -p $DOCKER_PASS",
//    //"docker push abinashkd/brigade-java-test:latest"
//  ]
//
//  dockerBuild.run().then( () => {
//    events.emit("build-done", e, project)
//  })
//})

//events.on("build-done", (e, project) => {
events.on("push", (e, project) => {
  console.log("Deploying to cluster")

  var deploy = new Job("deploy-runner")
  //var deploy = new Job("deploy-runner", "bitnami/kubectl:latest")

  deploy.tasks = [
	"cd /src",
    "kubectl apply -f deploy.yaml"
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