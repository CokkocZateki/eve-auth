Meteor.methods({
  banUser: function(userID) {
    thisUserID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(thisUserID, 'manage-users')) {
      throw new Meteor.Error('no permission');
    }
    // check if another group has service_name
    var user = Meteor.users.findOne(userID);
    if (!user) {
      throw new Meteor.Error('no user found');
    }
    // set banned to true and logout user
    Meteor.users.update(user._id, {$set: {
    'groups': [],
    'profile.banned': true,
    'services.resume.loginTokens' : []
    }});
    // remove user from groups
    Groups.update({users: user._id}, {$pull: {users: user._id}});
    // remove user from each service
    var services = Services.find({enabled: true}).fetch();
    _.each(services, function(service) {
      if (Meteor.services.hasOwnProperty(service.service)) {
        // make sure user has service enabled
        if (typeof user.services[service.service] !== 'undefined') {
          if (user.services[service.service].enabled) {
            var obj = Meteor.services[service.service];
            obj.removeUser(user._id);
          }
        }
      }
    });
    return true;
  },
  unbanUser: function(userID) {
    thisUserID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(thisUserID, 'manage-users')) {
      throw new Meteor.Error('no permission');
    }
    // check if another group has service_name
    var user = Meteor.users.findOne(userID);
    if (!user) {
      throw new Meteor.Error('no user found');
    }
    return Meteor.users.update(user._id, {$set: {'profile.banned': false}});
  }
});
