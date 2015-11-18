Template.groupList.onCreated( function() {
  /*var self = this;
  self.autorun(function() {
    self.subscribe('groups');
  });*/
});

Template.groupList.helpers({
  groups: function () {
    //Meteor.subscribe('myGroups');
    var id = Meteor.userId();
    return Groups.find({joinable: true, users: {$not: id}, users_pending: {$not: id}}).fetch();
  },
  pendingGroups: function () {
    //Meteor.subscribe('myGroups');
    var id = Meteor.userId();
    return Groups.find({users_pending: id}).fetch();
  },
  myGroups: function () {
    //Meteor.subscribe('myGroups');
    var id = Meteor.userId();
    return Groups.find({users: id}).fetch();
  }
});

Template.groupList.events({
  'click .join-group': function (event, template) {
    Meteor.call("joinGroup", this._id);
  },
  'click .leave-group': function (event, template) {
    Meteor.call("leaveGroup", this._id);
  }
});
