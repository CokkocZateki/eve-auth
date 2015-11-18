Template.login.onRendered(function () {
  document.body.className='hold-transition login-page';
});

Template.login.onDestroyed(function () {
  document.body.className='hold-transition skin-blue sidebar-mini';
});

Template.login.events({
  'click #login': function (event, template) {
    Meteor.loginWithEve();
  },
  'click .back-btn': function (event, template) {
    history.back();
  }
});
