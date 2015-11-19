// timers
Meteor.methods({
  createTimer: function(timer) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-timers')) {
      throw new Meteor.Error('no permission');
    }
    var date = new Date();
    timer.user_id = userID;
    timer.active = true;
    timer.created = date;
    timer.modified = date;
    return Timers.insert(timer);
  },
  editTimer: function(id, timer) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-timers')) {
      throw new Meteor.Error('no permission');
    }
    var date = new Date();
    timer.modified = date;
    return Timers.update(id, {$set: timer});
  },
  deleteTimer: function(id) {
    var userID = Meteor.userId();
    // role check
    if (!GroupRoles.userHasRole(userID, 'manage-timers')) {
      throw new Meteor.Error('no permission');
    }
    return Timers.remove(id);
  }
});
