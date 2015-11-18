Meteor.methods({
  servicesActive: function() {
    return Meteor.settings.services.enabled;
  },
  timersActive: function() {
    return Meteor.settings.timers.enabled;
  },
  srpActive: function() {
    return Meteor.settings.srp.enabled;
  }
});

// groups
Meteor.methods({
  joinGroup: function(id) {
    var userID = Meteor.userId();
    var group = Groups.findOne(id);
    if (!group) {
      throw new Meteor.Error('No Group');
    }
    if (!group.joinable) {
      throw new Meteor.Error('Group not joinable');
    }
    // private group
    if (!group.public) {
      Groups.update(group._id, {$push: {users_pending: userID}});
    }
    // public group
    else {
      // add user to group
      Groups.update(group._id, {$push: {users: userID}});
      // add group to user
      Meteor.users.update(userID, {$push: {groups: group._id}});
      /**
       * Todo
       * update services
       */
      // add user to service groups
      var services = Services.find({enabled: true}).fetch();
      _.each(services, function(service) {
        if (Meteor.services.hasOwnProperty(service.service)) {
          var obj = Meteor.services[service.service];
          obj.addUserToGroup(userID, group.service_name);
        }
      });
    }
  },
  leaveGroup: function(id) {
    var userID = Meteor.userId();
    var group = Groups.findOne(id);
    if (!group) {
      throw new Meteor.Error('No Group');
    }
    if (!group.joinable) {
      throw new Meteor.Error('Group not leavable');
    }
    // remove user from group
    Groups.update(group._id, {$pull: {users: userID}});
    // remove group from user
    Meteor.users.update(userID, {$pull: {groups: group._id}});
    // remove user from service groups
    var services = Services.find({enabled: true}).fetch();
    _.each(services, function(service) {
      if (Meteor.services.hasOwnProperty(service.service)) {
        var obj = Meteor.services[service.service];
        obj.removeUserFromGroup(userID, group.service_name);
      }
    });
  }

});
