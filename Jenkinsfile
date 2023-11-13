pipeline {
    agent any
    
    tools {
        nodejs '21.1.0'
    }
    stages {
        stage('Checkout') {
            steps {
                echo "Cloning repo..."
                
                checkout  changelog: true, poll: true, scm: [
                    $class: 'GitSCM',
                    branches: [[name: "origin/new-features" ]],
                    extensions: [
                        [
                            $class: 'PreBuildMerge',
                            options: [
                            fastForwardMode: 'FF',
                            mergeRemote: 'origin',
                            mergeStrategy: 'default',
                            mergeTarget: 'main']
                        ],
                        [
                            $class: 'UserIdentity',
                            email: 'rolmedro@gmail.com',
                            name: 'rad710'
                        ]],
                    userRemoteConfigs: [[
                    // credentialsId: 'githubCredentials',
                    name: 'origin',
                    url: "https://github.com/Rad710/dyrtransportes_react.git"
                    ]]
                ]
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
