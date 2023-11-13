pipeline {
    agent any
    
    tools {
        nodejs '21.1.0'
    }
    stages {
        stage('Checkout') {
            steps {
                echo "Cloning repo..."
                checkout scm
            }
        }
        
        stage('Build project') {
            steps {
                echo "Building..."
                
                sh """
                    git status
                    ls
                    git rev-parse --abbrev-ref HEAD
                    npm install
                    npm audit fix
                    npm run build
                    
                    docker build -t dyrtransportes-react:latest .
                    docker run -p 5050:80 -d dyrtransportes-react
                    """
            }
        }
    }
    
    post {
        success {
            echo "Success!"
        }
        failure {
            echo "Failure!"
        }
    }
}
