provider "aws" {
  region = "eu-west-2"
}

resource "aws_security_group" "finance_sg" {
  name        = "finance-sg"
  description = "Allow SSH and app traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }  

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "default" {
  vpc_id = data.aws_vpc.default.id
}

resource "aws_instance" "finance_tracker" {
  ami           = "ami-091f18e98bc129c4e"
  instance_type = "t2.micro"
  key_name      = "mytest_keypair"  
  subnet_id     = data.aws_subnet.default.id
  vpc_security_group_ids = [aws_security_group.finance_sg.id]

  tags = {
    Name = "FinanceTracker"
  }
}

