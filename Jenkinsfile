pipeline {
    agent any

    environment {
        AWS_REGION = "eu-west-2"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/Ngozi-N/ExpFinanceTracker.git'
            }
        }

        stage('Terraform Init & Apply') {
            steps {
                script {
                    dir('terraform') {
                        sh 'terraform init'
                        sh 'terraform apply -auto-approve'
                    }
                }
            }
        }

        stage('Extract EC2 Public IP & Update Inventory') {
            steps {
                script {
                    // Get the EC2 public IP from Terraform output
                    EC2_IP = sh(script: "cd terraform && terraform output -raw instance_public_ip", returnStdout: true).trim()
                    echo "EC2 Public IP: ${EC2_IP}"

                    // Dynamically update the Ansible inventory file
                    writeFile file: 'ansible/inventory.ini', text: "[finance_tracker]\n${EC2_IP} ansible_ssh_user=ubuntu ansible_ssh_private_key_file=~/.ssh/mytest_keypair.pem"
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
