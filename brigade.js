const { events, Job } = require("brigadier");

//events.on("build-done", (e, project) => {
events.on("push", (e, project) => {
  console.log("Deploying to cluster")

  //var deploy = new Job("deploy-runner")
  var deploy = new Job("deploy-runner", "bitnami/kubectl:latest")
  
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