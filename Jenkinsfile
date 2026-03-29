pipeline {
    agent {
        docker {
            image 'docker:27.3'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    stages {
        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker compose down || true'
                sh 'docker compose up -d'
            }
        }
    }
}