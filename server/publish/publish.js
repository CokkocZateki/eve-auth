Meteor.publish('user', function () {
  var user = Meteor.users.findOne(this.userId);
  if (user) {
    return Meteor.users.find(this.userId);
  }
});
Meteor.publish('users', function () {
  var user = Meteor.users.findOne(this.userId);
  if (user) {
    if (GroupRoles.userHasRole(this.userId, 'manage-users') || GroupRoles.userHasRole(this.userId, 'manage-groups')) {
      return Meteor.users.find();
    }
  }
});

// groups
Meteor.publish('groups', function(){
  var user = Meteor.users.findOne(this.userId);
  if (user) {
    return Groups.find();
  }
});

// services
Meteor.publish('services', function () {
  var user = Meteor.users.findOne(this.userId);
  if (user) {
    if (GroupRoles.userHasRole(this.userId, 'manage-service')) {
      return Services.find();
    }
    return Services.find({}, {fields: {'service': 1, 'enabled': 1}});
  }
});

// timers
Meteor.publish('timers', function(){
  var user = Meteor.users.findOne(this.userId);
  if (user) {
    return Timers.find();
  }
});

//srp
Meteor.publish('srp', function(){
  var user = Meteor.users.findOne(this.userId);
  if (user) {
    var userID = this.userId;
    if (GroupRoles.userHasRole(this.userId, 'manage-srp')) {
      return Srp.find();
    }
    return Srp.find({user_id: userID}).fetch();
  }
});

// alerts
Meteor.publish('alerts', function(){
  var user = Meteor.users.findOne(this.userId);
  if (user) {
    return Alerts.find();
  }
});
