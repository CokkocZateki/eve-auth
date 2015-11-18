Template.manageServiceList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('services');
  });
});

Template.manageServiceList.helpers({
  services: function() {
    return Services.find();
  }
});
