Meteor.publish('user', function () {
  return Meteor.users.find(this.userId);
});
Meteor.publish('users', function () {
  if (GroupRoles.userHasRole(this.userId, 'manage-users') || GroupRoles.userHasRole(this.userId, 'manage-groups')) {
    return Meteor.users.find();
  }
});

// groups
Meteor.publish('groups', function(){
  return Groups.find();
});

// services
Meteor.publish('services', function () {
  if (GroupRoles.userHasRole(this.userId, 'manage-service')) {
    return Services.find();
  }
  return Services.find({}, {fields: {'service': 1, 'enabled': 1}});
});

// timers
Meteor.publish('timers', function(){
  return Timers.find();
});

//srp
Meteor.publish('srp', function(){
  var userID = this.userId;
  if (GroupRoles.userHasRole(this.userId, 'manage-srp')) {
    return Srp.find();
  }
  return Srp.find({user_id: userID}).fetch();
});
