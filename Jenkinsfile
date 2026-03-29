pipeline {
    agent {
        docker {
            image 'docker:27.3'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kmarov17/Numeric-library-DIT.git'
            }
        }
        stage('Build Application') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$PWD/frontend:/app" \
                      -w /app \
                      node:18-alpine \
                      sh -lc "npm ci && npm run build"

                    docker run --rm \
                      -v "$PWD/backend:/app" \
                      -w /app \
                      python:3.12-alpine \
                      sh -lc "python -m compileall ."
                '''
            }
        }
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
