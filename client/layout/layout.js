Template.layout.onCreated( function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('user');
    self.subscribe('groups');
  });
});

Template.layout.events({
  /*'click #logout': function (event, template) {
    Meteor.logout();
  }*/
});
