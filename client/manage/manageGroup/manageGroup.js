Template.manageGroupHeader.helpers({
  total: function() {
    return Groups.find().count();
  }
});

Template.manageGroupNav.onCreated( function() {
  /*var self = this;
  self.autorun(function() {
    self.subscribe('groups');
  });*/
});
Template.manageGroupNav.helpers({
  groups: function() {
    return Groups.find().fetch();
  }
});

Template.manageGroupView.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('users');
  });
});
Template.manageGroupView.helpers({
  group: function() {
    var id = FlowRouter.getParam('id');
    return Groups.findOne({_id: id});
  },
  usersList: function() {
    return Meteor.users.find().fetch().map(function(it){return it.profile.name;});
  }
});
Template.manageGroupView.events({
  'click #group-delete': function (event, template) {
    Meteor.call('deleteGroup', this._id);
  },
  'submit #user-add': function (event, template) {
    event.preventDefault();
    var userName = event.target.userName.value;
    Meteor.call('addUser', this._id, userName);
    return false;
  },
  'click .user-remove': function (event, template) {
    Meteor.call('removeUser', event.target.value, this._id);
  },
  'click .user-approve': function (event, template) {
    Meteor.call('approveUser', event.target.value, this._id);
  },
  'click .user-deny': function (event, template) {
    Meteor.call('denyUser', event.target.value, this._id);
  },
  'submit #role-add': function (event, template) {
    event.preventDefault();
    var role = event.target.addRoleToGroup.value;
    Meteor.call('addRole', this._id, role);
    return false;
  },
  'click .role-remove': function (event, template) {
    Meteor.call('removeRole', event.target.value, String(this));
  }
});

Template.manageGroupCreate.events({
  'submit #group-add': function (event, template) {
    event.preventDefault();

    var name = event.target.name.value;
    var serviceName = event.target.serviceName.value;
    var description = event.target.description.value;
    var requirement = event.target.requirement.value;
    var publicGroup = event.target.public.checked;
    var date = new Date();

    groupArray = {
      name: name,
      service_name: serviceName,
      description: description,
      requirement: requirement,
      public: publicGroup,
      created: date,
      modified: date
    };

    Meteor.call('addGroup', groupArray, function(error, result){
      if (!result) {
        return false;
      }
      FlowRouter.go('/manage/group/' + result);
    });
    return false;
  }
});

Template.manageGroupEdit.onCreated(function() {
  /*var self = this;
  self.autorun(function() {
    self.subscribe('groups');
  });*/
});
Template.manageGroupEdit.helpers({
  group: function() {
    var id = FlowRouter.getParam('id');
    return Groups.findOne({_id: id});
  }
});
Template.manageGroupEdit.events({
  'submit #group-edit': function (event, template) {
    event.preventDefault();

    var groupID = this._id;
    console.log(groupID);
    var name = event.target.name.value;
    var serviceName = event.target.serviceName.value;
    var description = event.target.description.value;
    var requirement = event.target.requirement.value;
    var publicGroup = event.target.public.checked;
    var date = new Date();

    groupArray = {
      name: name,
      service_name: serviceName,
      description: description,
      requirement: requirement,
      public: publicGroup,
      modified: date
    };

    Meteor.call('editGroup', groupID, groupArray, function(error, result){
      if (!result) {
        return false;
      }
      FlowRouter.go('/manage/group/' + result);
    });
    return false;
  }
});
