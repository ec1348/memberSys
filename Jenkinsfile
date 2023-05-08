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
        withCredentials([usernamePassword(credentialsId: 'docker_hub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]){
          sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
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