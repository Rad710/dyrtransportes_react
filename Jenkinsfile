pipeline {
    agent any
    
    tools {
        nodejs '21.1.0'
    }
    stages {
        stage('Prepare') {
            steps {
                echo "Preparing..."
                echo "Environment variables: ${env}"
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
                script {
                    echo "Building..."
                    if (env.CHANGE_ID) {
                        echo "This build is associated with a pull request ${env.BRANCH_NAME}: #${env.CHANGE_ID}"
                    } else {
                        echo "This build is associated with a branch: ${env.BRANCH_NAME}"
                    }

                    publishChecks status: 'IN_PROGRESS',
                        name: 'Preview Build', 
                        title: 'Pipeline Check', 
                        summary: 'Cloning repo...'
                    sh """
                        git status
                        git branch -r
                        ls
                        """
    
                    publishChecks status: 'IN_PROGRESS',
                        name: 'Preview Build', 
                        title: 'Pipeline Check', 
                        summary: 'Build step...'
                    sh """
                        npm install
                        npm audit fix
                        npm run build
                        """
    
                    publishChecks status: 'IN_PROGRESS',
                        name: 'Preview Build', 
                        title: 'Pipeline Check', 
                        summary: 'Docker build...'
                    
                    sh """
                        docker build -t dyrtransportes-react:latest .
                        """
                    // docker run -p 5050:80 -d dyrtransportes-react
                }
            }
            post {
                success {
                    //Send build result to Github
                    publishChecks name: 'Preview Build', 
                        title: 'Pipeline Check', 
                        summary: 'Checking merge',
                        text: 'The Jenkins Pipeline...',
                        detailsURL: 'url.url',
                        conclusion: 'SUCCESS'
                }
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
