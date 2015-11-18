/**
 * Manage Group Methods
 * addGroup
 * editGroup
 * deleteGroup
 * addUser
 * removeUser
 * approveUser
 * denyUser
 * addRole
 * removeRole
 */

Meteor.methods({
  addGroup: function(groupArray) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    // check if another group has service_name
    var group = Groups.findOne({service_name: groupArray.service_name});
    if (group) {
      throw new Meteor.Error('group with service name ' + groupArray.service_name + ' already exists');
    }
    groupArray.joinable = true;
    groupArray.users = [];
    groupArray.users_pending = [];
    groupArray.roles = [];
    Groups.insert(groupArray);
    // add group to services
    var services = Services.find({enabled: true}).fetch();
    _.each(services, function(service) {
      if (Meteor.services.hasOwnProperty(service.service)) {
        var obj = Meteor.services[service.service];
        obj.addGroup(groupArray.service_name);
      }
    });
    return true;
  },
  editGroup: function(groupID, groupArray) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    // check if another group has service_name
    var group = Groups.findOne(groupID);
    if (!group) {
      throw new Meteor.Error('no group found to edit');
    }
    var tempArray = {
      name: groupArray.name,
      service_name: groupArray.service_name,
      description: groupArray.description,
      public: groupArray.public
    };
    // if service name changed, change group name in services
    if (tempArray.service_name !== group.service_name) {
      // update group services name
      var services = Services.find({enabled: true}).fetch();
      _.each(services, function(service) {
        if (Meteor.services.hasOwnProperty(service.service)) {
          var obj = Meteor.services[service.service];
          obj.updateGroupName(group.service_name, tempArray.service_name);
        }
      });
    }
    Groups.update(group._id, {$set: tempArray});
    return group._id;
  },
  deleteGroup: function(groupID) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    // check if group exists
    var group = Groups.findOne({_id: groupID});
    if (!group) {
      throw new Meteor.Error('group doesn\'t exist');
    }
    // remove all users from group
    _.each(group.users, function(user) {
     Meteor.users.update(user, {$pull: {groups: group._id}});
    });
    // remove group services
    var services = Services.find({enabled: true}).fetch();
    _.each(services, function(service) {
      if (Meteor.services.hasOwnProperty(service.service)) {
        var obj = Meteor.services[service.service];
        obj.removeGroup(group.service_name);
      }
    });
    // remove group
    Groups.remove(group._id);
    return true;
  },
  addUser: function(groupID, userName) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    // check if group exists
    var group = Groups.findOne({_id: groupID});
    if (!group) {
      throw new Meteor.Error('group doesn\'t exist');
    }
    // check if user exists
    var user = Meteor.users.findOne({'profile.name': userName});
    if (!user) {
      throw new Meteor.Error('user doesn\'t exist');
    }
    // check if user is already in group
    var check = false;
    check = _.find(group.users, function(thisUser) {
     if (thisUser === user._id) {
       return true;
     }
    });
    if (check) {
      throw new Meteor.Error('user already in group');
    }
    Groups.update(group._id, {$push: {users: user._id}});
    Meteor.users.update(user._id, {$push: {groups: group._id}});
    // add user to service groups
    var services = Services.find({enabled: true}).fetch();
    _.each(services, function(service) {
      if (Meteor.services.hasOwnProperty(service.service)) {
        var obj = Meteor.services[service.service];
        obj.addUserToGroup(user._id, group.service_name);
      }
    });
    return true;
  },
  removeUser: function(groupID, thisUserID) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    // check if group exists
    var group = Groups.findOne({_id: groupID});
    if (!group) {
      throw new Meteor.Error('group doesn\'t exist');
    }
    // check if user exists
    var user = Meteor.users.findOne(thisUserID);
    if (!user) {
      throw new Meteor.Error('user doesn\'t exist');
    }
    Groups.update(group._id, {$pull: {users: user._id}});
    Meteor.users.update(user._id, {$pull: {groups: group._id}});
    // remove user from service groups
    var services = Services.find({enabled: true}).fetch();
    _.each(services, function(service) {
      if (Meteor.services.hasOwnProperty(service.service)) {
        var obj = Meteor.services[service.service];
        obj.removeUserFromGroup(user._id, group.service_name);
      }
    });
    return true;
  },
  approveUser: function(groupID, thisUserID) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    // check if group exists
    var group = Groups.findOne({_id: groupID});
    if (!group) {
      throw new Meteor.Error('group doesn\'t exist');
    }
    // check if user exists
    var user = Meteor.users.findOne(thisUserID);
    if (!user) {
      throw new Meteor.Error('user doesn\'t exist');
    }
    // check if user is already in group
    var check = false;
    check = _.find(group.users, function(thisUser) {
     if (thisUser === user._id) {
       return true;
     }
    });
    if (check) {
      throw new Meteor.Error('user already in group');
    }
    Groups.update(group._id, {$push: {users: user._id}});
    Groups.update(group._id, {$pull: {users_pending: user._id}});
    Meteor.users.update(user._id, {$push: {groups: group._id}});
    // add user to service groups
    var services = Services.find({enabled: true}).fetch();
    _.each(services, function(service) {
      if (Meteor.services.hasOwnProperty(service.service)) {
        var obj = Meteor.services[service.service];
        obj.addUserToGroup(user._id, group.service_name);
      }
    });
    return true;
  },
  denyUser: function(groupID, thisUserID) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    // check if group exists
    var group = Groups.findOne({_id: groupID});
    if (!group) {
      throw new Meteor.Error('group doesn\'t exist');
    }
    // check if user exists
    var user = Meteor.users.findOne(thisUserID);
    if (!user) {
      throw new Meteor.Error('user doesn\'t exist');
    }
    Groups.update(group._id, {$pull: {users_pending: user._id}});
  },
  addRole: function(groupID, role) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    var group = Groups.findOne(groupID);
    if (!group) {
      throw new Meteor.Error('no group');
    }
    // user needs admin to assign admin
    if (role === 'admin') {
      if (!GroupRoles.userHasRole(userID, 'admin')) {
        throw new Meteor.Error('no permission to add role ' + role);
      }
    }
    // user needs super-admin to assign super-admin
    if (role === 'super-admin') {
      if (!GroupRoles.userHasRole(userID, 'super-admin')) {
        throw new Meteor.Error('no permission to add role ' + role);
      }
    }
    // check if group already has role
    var check = false;
    check = _.find(group.roles, function(thisRole) {
     if (thisRole === role) {
       return true;
     }
    });
    if (check) {
      throw new Meteor.Error('group already has role');
    }
    Groups.update(group._id, {$push: {roles: role}});
  },
  removeRole: function(groupID, role) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-groups')) {
      throw new Meteor.Error('no permission');
    }
    var group = Groups.findOne(groupID);
    if (!group) {
      throw new Meteor.Error('no group');
    }
    Groups.update(group._id, {$pull: {roles: role}});
  }
});
