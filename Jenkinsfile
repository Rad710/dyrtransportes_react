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
                    git branch -r 
                    git checkout origin/main
                    git pull origin main
                    git merge feature

                    git rev-parse --abbrev-ref HEAD
                    ls
                    """
                    //npm install
                    // npm audit fix
                    // npm run build
                    
                    // docker build -t dyrtransportes-react:latest .
                    // docker run -p 5050:80 -d dyrtransportes-react
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
