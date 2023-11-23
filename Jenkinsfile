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

                    sh """
                        git status
                        git branch -r
                        ls
                        """
 
                    sh """
                        npm install
                        npm audit fix
                        npm run build
                        """
                    
                    sh """
                        docker build -t dyrtransportes-react:latest .
                        """
                    // docker run -p 5050:80 -d dyrtransportes-react
                }
            }
        }
    }
    
    post {
        always {
            influxDbPublisher(selectedTarget: 'InfluxDB')
        }
    }
}
