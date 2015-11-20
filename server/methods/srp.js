// timers
Meteor.methods({
  createSrp: function(srp) {
    var userID = Meteor.userId();
    if (!userID) {
      throw new Meteor.Error('no permission');
    }
    // check if link has already been submitted
    var kill_id = parseInt(srp.link.match(/\d+/));
    var srpCheck = Srp.findOne({kill_id: kill_id});
    if (srpCheck) {
      throw new Meteor.Error('SRP already requested for this loss');
    }

    var status = 'pending';
    var managerID = 0;
    var date = new Date();
    srp.user_id = userID;
    srp.kill_id = kill_id;
    srp.status = status;
    srp.manager_id = managerID;
    srp.created = date;
    srp.modified = date;
    return Srp.insert(srp);
  }
});

Meteor.methods({
  approveSrp: function(srpID) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-srp')) {
      throw new Meteor.Error('no permission');
    }
    var srp = Srp.findOne(srpID);
    if (!srp) {
      throw new Meteor.Error('wrong SRP ID');
    }
    var date = new Date();
    return Srp.update(srp._id, {$set: {status: 'approved', manager_id: userID, modified: date}});
  },
  denySrp: function(srpID) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-srp')) {
      throw new Meteor.Error('no permission');
    }
    var srp = Srp.findOne(srpID);
    if (!srp) {
      throw new Meteor.Error('wrong SRP ID');
    }
    var date = new Date();
    return Srp.update(srp._id, {$set: {status: 'denied', manager_id: userID, modified: date}});
  }
});
