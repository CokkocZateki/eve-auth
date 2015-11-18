Template.dashboard.onCreated( function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('groups');
  });
});

Template.dashboard.helpers({
  group: function () {
    return Groups.findOne(String(this));
  }
});
