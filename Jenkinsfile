pipeline {
    agent any

    environment {
        AWS_REGION = "eu-west-2"
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

        stage('Extract EC2 Public IP & Update Inventory') {
            steps {
                script {
                    EC2_IP = sh(script: "cd terraform && terraform output -raw instance_public_ip", returnStdout: true).trim()
                    echo "EC2 Public IP: ${EC2_IP}"

                    // ✅ Fix: Add StrictHostKeyChecking=no to avoid SSH manual confirmation
                    writeFile file: 'ansible/inventory.ini', text: """
                    [finance_tracker]
                    ${EC2_IP} ansible_ssh_user=ubuntu ansible_ssh_private_key_file=/var/lib/jenkins/.ssh/mytest_keypair.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'
                    """
                }
            }
        }

        stage('Wait for EC2 SSH to Become Available') {
            steps {
                script {
                    echo "Waiting for SSH to be available on ${EC2_IP}..."
                    sh """
                    for i in {1..20}; do  # Increased retries from 10 to 20
                        nc -z -v ${EC2_IP} 22 && echo 'SSH is up!' && exit 0
                        echo 'Waiting for SSH...'
                        sleep 15  # Increased wait time from 10 to 15 seconds
                    done
                    echo 'SSH did not start in time' && exit 1
                    """
                }
            }
        }

        stage('Run Ansible Playbook') {
            steps {
                sh 'ansible-playbook -i ansible/inventory.ini ansible/setup.yml'
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
