pipeline {
    agent any

    environment {
        AWS_REGION = "eu-west-2"
        SSH_KEY = "/var/lib/jenkins/.ssh/mytest_keypair.pem"  // Path to SSH key on Jenkins server
        SSH_USER = "ubuntu"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Ngozi-N/ExpFinanceTracker.git'
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                withCredentials([aws(credentialsId: 'YOUR_CREDENTIALS_ID', region: 'eu-west-2')]) {
                    script {
                        dir('terraform') {
                            sh 'terraform init'
                            sh 'terraform apply -auto-approve'
                        }
                    }
                }
            }
        }

        stage('Extract EC2 Public IP') {
            steps {
                script {
                    EC2_IP = sh(script: "cd terraform && terraform output -raw instance_public_ip", returnStdout: true).trim()
                    echo "EC2 Public IP: ${EC2_IP}"
                }
            }
        }

        stage('Copy Ansible Playbook to EC2') {
            steps {
                script {
                    echo "Copying Ansible playbook to EC2..."
                    sh """
                    scp -o StrictHostKeyChecking=no -i ${SSH_KEY} ansible/setup.yml ${SSH_USER}@${EC2_IP}:/home/ubuntu/
                    """
                }
            }
        }

        stage('Run Ansible Locally on EC2') {
            steps {
                script {
                    echo "Executing Ansible on EC2..."
                    sh """
                    ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${SSH_USER}@${EC2_IP} 'sudo apt update && sudo apt install -y ansible && ansible-playbook -i "localhost," -c local /home/ubuntu/setup.yml'
                    """
                }
            }
        }

        stage('Show Access URL') {
            steps {
                script {
                    echo "✅ Access the Finance Tracker App at: http://${EC2_IP}:3000"
                }
            }
        }
    }
}
