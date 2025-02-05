- name: Setup Finance Tracker
  hosts: finance_tracker
  become: yes
  tasks:
    - name: Update packages
      apt:
        update_cache: yes

    - name: Install Node.js, npm, and Git
      apt:
        name:
          - nodejs
          - npm
          - git
        state: present

    - name: Install PM2 globally
      command: npm install -g pm2

    - name: Clone the finance tracker app
      git:
        repo: https://github.com/Ngozi-N/ExpFinanceTracker.git
        dest: /home/ubuntu/ExpFinanceTracker
        force: yes

    - name: Install dependencies
      command: npm install
      args:
        chdir: /home/ubuntu/ExpFinanceTracker

    - name: Start the app using PM2
      command: pm2 start server.js --no-daemon
      args:
        chdir: /home/ubuntu/ExpFinanceTracker
