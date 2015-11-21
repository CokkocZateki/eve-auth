Meteor.autosubscribe(function() {
  Alerts.find().observe({
    added: function(item){

    }
  });
});

Template.layout.onCreated( function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('user');
    self.subscribe('groups');
    self.subscribe('timers');
    self.subscribe('srp');

    self.subscribe('alerts');
    Alerts.find().observe({
      added: function(item){
        if (notify.permissionLevel() === notify.PERMISSION_GRANTED) {
          var options = {
            body: item.message,
            icon: './img/alert.png'
          };
          notify.createNotification(item.title, options);
        }
      }
    });

  });
});

Template.layout.onRendered( function() {
  notify.config({pageVisibility: true, autoClose: 8000});
  if (notify.permissionLevel() === notify.PERMISSION_DEFAULT) {
    notify.requestPermission();
  }
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
