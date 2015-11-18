Template.manageUserList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('users');
  });
});
Template.manageUserList.helpers({
  total: function() {
    return Meteor.users.find().count();
  },
  users: function() {
    return Meteor.users.find().fetch();
  },
  group: function () {
    return Groups.findOne(String(this));
  },
  service: function () {
    return Services.findOne(this.service_id);
  }
});
