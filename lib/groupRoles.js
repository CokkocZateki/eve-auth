/**
 * Group Roles
 *
 */

// mixin for _.inArray(string, array)
 _.mixin({
 	// - Checks if a string is in an Array
 	// Source: https://gist.github.com/tracend/570113fcb329aaf69bf0
 	inArray: function(value, array){
 		// if not an array just output false
 		return ( array instanceof Array ) ? (array.indexOf(value) > -1) : false;
 	}
 });

if (Meteor.isClient) {
  /**
   * Group Roles Helpers
   */
   Template.registerHelper('hasRole', function(roles) {
     var user = Meteor.user();
     if (!user) {
       return false;
     }
     return GroupRoles.userHasRole(user._id, roles);
   });
}

GroupRoles = {
  // add role(s) to group
  addRoleToGroup: function(groupID, roles) {
    var roleArray = roles.split(',');
    var group = GroupRoles.getGroup(groupID);
    Groups.update(group._id, {
      $push: {roles: {$each: roleArray}}
    });
    /*_.each(roleArray, function(role) {
      Groups.update(group._id, {
        $push: {roles: role}
      });
    });*/
  },
  // remove role(s) from group
  removeRoleFromGroup: function(groupID, roles) {
    var roleArray = roles.split(',');
    var group = GroupRoles.getGroup(groupID);
    _.each(roleArray, function(role) {
      Groups.update(group._id, {
        $pull: {roles: role}
      });
    });
  },
  // set role(s) for group
  setGroupRole: function(groupID, roles) {
    var roleArray = roles.split(',');
    var group = GroupRoles.getGroup(groupID);
    //clear group roles
    Groups.update(group._id, {
      $set: {roles: []}
    });
    _.each(roleArray, function(role) {
      Groups.update(group._id, {
        $push: {roles: role}
      });
    });
  },
  // check if group has role(s)
  groupHasRole: function(groupID, roles) {
    var roleArray = roles.split(',');
    var group = GroupRoles.getGroup(groupID);
    var check = false;
    var total = roleArray.length;
    var counter = 0;

    // check if group has super-admin
    if (_.inArray('super-admin', group.roles)) {
      return true;
    }
    // check if group has admin
    if (_.inArray('admin', group.roles)) {
      // check if not looking for super-admin
      if (!(_.inArray('super-admin', roleArray))) {
        return true;
      }
    }

    // find through roles
    _.find(roleArray, function(role) {
      // check if role is in group roles
      if (_.inArray(role, group.roles)) {
        counter++;
      }
      if (total === counter) {
        check = true;
      }
      // check is true, break out of find
      if (check) {
        return true;
      }
    });
    // if all roles provided matched roles in group return true
    return check;
  },
  // check if user is in group with role(s)
  userHasRole: function(userID, roles) {
    var user = GroupRoles.getUser(userID);
    var check = false;
    _.find(user.groups, function(groupID) {
      if (GroupRoles.groupHasRole(groupID, roles)) {
        check = true;
        return check;
      }
    });
    // config root-admins check
    if (!check) {
      _.each(Meteor.settings.public.admins, function(eveID) {
        console.log(user.services.eve.character.id);
        console.log(eveID);
        if (user.services.eve.character.id == eveID) {
          check = true;
        }
      });
    }
   return check;
  },
  /* helper functions */
  getGroup: function(groupID) {
    var group = Groups.findOne(groupID);
    if (!group) {
      throw new Meteor.Error('not valid group id');
    }
    return group;
  },
  getUser: function(userID) {
    var user = Meteor.users.findOne(userID);
    if (!user) {
      throw new Meteor.Error('not valid user id');
    }
    return user;
  }
};
