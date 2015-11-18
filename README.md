EVE-Auth
============

[![Join the chat at https://gitter.im/kallama/eve-auth](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/kallama/eve-auth?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Auth system for an EVE Online Alliance or single Corporation using Meteor.js. EVE-Auth is meant for users already in the Alliance/Corporation, not for HR or people looking to join your group.
### Features
* User authentication via EVE's Single Sign-On (SSO)
* No EVE API keys required
* Groups with roles based permissions
* Add or remove a service using Meteor's package management system
### Service List
https://atmospherejs.com/kalam/eve-auth-openfire
### Install
##### Development
Windows or Linux
Install Meteor.js https://www.meteor.com/install   
```
$ git clone https://github.com/kallama/eve-auth.git
$ cd eve-auth
$ cp settings.json.example to settings.json
```
Fill in settings.json  
"id:" should be your alliance or corporations ID according to EVE Online  
"admins" should be an array of character ID's according to EVE Online, only needed for initial setup for admin rights
```
$ meteor --settings settings.json
```  
navigate to http://localhost:3000
###### Install Services
```
$ meteor install kalam:eve-auth-openfire
```
##### Production
Ubuntu Server 14.04 LTS
Install Meteor.js
Install MongoDB
```
$ git clone https://github.com/kallama/eve-auth.git
```

### Todo
* Timers
* SRP
* Admin page
* Rest with https://atmospherejs.com/nimble/restivus
