pipeline {
  agent any
  stages {
    stage("Build") {
      steps{
        sh './devops/build/1.dockerBuildEc2.sh'
      }
    }

    stage("Push") {
      steps{
        withCredentials([usernamePassword(credentialsId: 'docker_hub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]){
          sh './devops/build/2.dockerPushEc2.sh'
          echo 'Push the application to docker hub'
        }
      }
    }

    stage("deploy") {

      steps{
        echo 'deploying the application'
      }
    }
  }
}