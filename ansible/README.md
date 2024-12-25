## Installation using Ansible

### Add api keys
- frontend/.env
- backend/config.js

### Flash raspbian on sd card
Tested with raspbian with Debian 10 (2021-05-07-raspios-buster-arm64-lite)

### Install your ssh key
```
ssh-copy-id pi@<ip-of-pi>
```
### Run ansible
```
ansible-playbook playbooks/mainPlaybook.yml -i inventories/testPi3b+.yml 
```