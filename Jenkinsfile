pipeline {
    agent any
    
    tools {
        nodejs '21.1.0'
    }
    stages {
        stage('Prepare') {
            steps {
                echo "Preparing..."
                echo env
            }
        }
        stage('Checkout') {
            steps {
                echo "Cloning repo..."
                checkout scm
            }
        }
        
        stage('Build project') {
            steps {
                echo "Building..."

                if (env.CHANGE_ID) {
                    echo "This build is associated with a pull request #${env.CHANGE_ID}"
                    // Add your PR-specific logic here
                } else {
                    echo "This build is associated with a branch ${env.BRANCH_NAME}"
                }
                
                sh """
                    git status
                    git branch -r
                    ls

                    npm install
                    npm audit fix
                    npm run build

                    docker build -t dyrtransportes-react:latest .
                    """

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
