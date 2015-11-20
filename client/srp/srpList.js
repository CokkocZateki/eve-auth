Template.srpList.helpers({
  srpPending: function() {
    var userID = Meteor.userId();
    return Srp.find({user_id: userID, status: 'pending'}, {sort: {created: 1}}).fetch();
  },
  srpDone: function() {
    var userID = Meteor.userId();
    return Srp.find({user_id: userID, status: {$ne: 'pending'}}, {sort: {created: 1}}).fetch();
  }
});

Template.srpList.events({
  'submit #srp-create': function (event, template) {
    event.preventDefault();

    var link = event.target.link.value;
    var notes = event.target.notes.value;

    srp = {
      link: link,
      notes: notes
    };

    Meteor.call('createSrp', srp, function(error, result){
      if (!result) {
        return false;
      }
      event.target.link.value = '';
      event.target.notes.value = '';
    });
    return false;
  }
});
