Template.layout.onCreated( function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('user');
    self.subscribe('groups');
    self.subscribe('timers');
    self.subscribe('srp');
  });
});
Template.layout.helpers({
  timers: function() {
    return Timers.find({active: true}, {sort: {created: 1}}).fetch();
  },
  srpPending: function() {
    var userID = Meteor.userId();
    return Srp.find({user_id: userID, status: 'pending'}, {sort: {created: 1}}).fetch();
  }
});
Template.layout.events({
  /*'click #logout': function (event, template) {
    Meteor.logout();
  }*/
});
