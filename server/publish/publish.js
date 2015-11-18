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
