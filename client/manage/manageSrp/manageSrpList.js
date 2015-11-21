Template.manageSrpList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('users');
  });
});

Template.manageSrpList.helpers({
  srpPending: function() {
    return Srp.find({status: 'pending'}, {sort: {created: 1}}).fetch();
  },
  srpDone: function() {
    var userID = Meteor.userId();
    return Srp.find({status: {$ne: 'pending'}}, {sort: {created: 1}}).fetch();
  }
});

Template.manageSrpList.events({
  'click .srp-approve': function (event, template) {
    var srpID = this._id;
    Meteor.call('approveSrp', srpID, function(error, result){
    });
  },
  'click .srp-deny': function (event, template) {
    var srpID = this._id;
    Meteor.call('denySrp', srpID, function(error, result){
    });
  }
});
