Template.serviceList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('services');
  });
});

Template.serviceList.helpers({
  services: function() {
    return Services.find();
  }
});
