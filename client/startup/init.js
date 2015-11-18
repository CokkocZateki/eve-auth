Tracker.autorun(function() {
  var route;
  if (!Meteor.userId()) {
    if (Session.get('loggedIn')) {
      route = FlowRouter.current();
      Session.set('redirectAfterLogin', route.path);
      return FlowRouter.go(FlowRouter.path('login'));
    }
  }
});
