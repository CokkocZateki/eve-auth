// set session variable in method callback
Meteor.call('servicesActive', function(error, result){
  Session.set('servicesActive', result);
});
Meteor.call('timersActive', function(error, result){
  Session.set('timersActive', result);
});
Meteor.call('srpActive', function(error, result){
  Session.set('srpActive', result);
});

Template.leftSidebar.helpers({
  servicesActive: function() {
    return Session.get('servicesActive');
  },
  timersActive: function() {
    return Session.get('timersActive');
  },
  srpActive: function() {
    return Session.get('srpActive');
  },
  timers: function() {
    return Timers.find({active: true}).fetch();
  },
  srpPending: function() {
    var userID = Meteor.userId();
    return Srp.find({user_id: userID, status: 'pending'}).fetch();
  },
  manageSrpPending: function() {
    var userID = Meteor.userId();
    return Srp.find({status: 'pending'}).fetch();
  }
});
