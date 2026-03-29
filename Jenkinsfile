pipeline {
    agent any

    stages {

        stage('Checkout') {
            agent {
                docker {
                    image 'docker:24.0.5-cli'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }

            steps {
                git branch: 'main', url: 'https://github.com/kmarov17/Numeric-library-DIT.git'
            }
        }

        stage('Build Docker Images') {
            agent {
                docker {
                    image 'docker:24.0.5-cli'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            
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