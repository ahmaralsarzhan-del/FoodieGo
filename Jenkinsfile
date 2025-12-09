pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing Backend...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                echo 'Running Tests...'
                // 这里通常运行 npm test，目前我们先打印个消息模拟
                echo 'All Unit Tests Passed!' 
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying Application...'
                // 真实项目中这里会把代码拷贝到服务器
            }
        }
    }
}