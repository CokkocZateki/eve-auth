if (Meteor.isClient) {
  Accounts.onLogin(function() {
    var path = FlowRouter.current().path;
    if (path === '/login') {
      FlowRouter.go('/');
    }
  });

  Tracker.autorun(function () {
    if (!Meteor.userId()) {
      FlowRouter.go('login');
    }
  });
}

FlowRouter.route('/login', {
  name: 'login',
  action: function() {
    BlazeLayout.render('noLayout', {content: 'login'});
  }
});
FlowRouter.route('/logout', {
  name: 'logout',
  action: function() {
    Meteor.logout();
    FlowRouter.go('login');
  }
});
FlowRouter.route('/', {
  name: 'dashboard',
  action: function() {
    BlazeLayout.render('layout', {content: 'dashboard'});
  }
});
FlowRouter.route('/group', {
  name: 'groupList',
  action: function() {
    BlazeLayout.render('layout', {content: 'groupList'});
  }
});
FlowRouter.route('/help', {
  name: 'help',
  action: function() {
    BlazeLayout.render('layout', {content: 'help'});
  }
});
FlowRouter.route('/service', {
  name: 'serviceList',
  action: function() {
    BlazeLayout.render('layout', {content: 'serviceList'});
  }
});
FlowRouter.route('/timer', {
  name: 'timerList',
  action: function() {
    BlazeLayout.render('layout', {content: 'timerList'});
  }
});
FlowRouter.route('/srp', {
  name: 'srpList',
  action: function() {
    BlazeLayout.render('layout', {content: 'srpList'});
  }
});


var manage = FlowRouter.group({
    prefix: '/manage'
});
manage.route('/user', {
    name: 'manageUserList',
    action: function() {
      BlazeLayout.render('layout', {content: 'manageUserList'});
    }
});
manage.route('/group', {
    name: 'manageGroupList',
    action: function() {
      BlazeLayout.render('layout', {content: 'manageGroupList'});
    }
});
manage.route('/group/create', {
    name: 'manageGroupCreate',
    action: function() {
      BlazeLayout.render('layout', {content: 'manageGroupCreate'});
    }
});
manage.route('/group/:id', {
    name: 'manageGroupView',
    action: function() {
      BlazeLayout.render('layout', {content: 'manageGroupView'});
    }
});
manage.route('/group/:id/edit', {
    name: 'manageGroupEdit',
    action: function() {
      BlazeLayout.render('layout', {content: 'manageGroupEdit'});
    }
});
manage.route('/service', {
    name: 'manageServiceList',
    action: function() {
      BlazeLayout.render('layout', {content: 'manageServiceList'});
    }
});
manage.route('/timer', {
    name: 'manageTimerList',
    action: function() {
      BlazeLayout.render('layout', {content: 'manageTimerList'});
    }
});
manage.route('/srp', {
    name: 'manageSrpList',
    action: function() {
      BlazeLayout.render('layout', {content: 'manageSrpList'});
    }
});


var admin = FlowRouter.group({
    prefix: '/admin'
});
admin.route('/dashboard', {
    name: 'adminDashboard',
    action: function() {
      BlazeLayout.render('layout', {content: 'adminDashboard'});
    }
});

// we only need to keep history for two paths at once
// first path is what we need to check always
/*var previousPaths = [null, null];

function saveScrollPosition(context) {
  var pathInfo = {
    path: context.path,
    scrollPosition: $('body').scrollTop()
  };

  // add a new path and remove the first path
  // using as a queue
  this._previousPaths.push(pathInfo);
  this._previousPaths.shift();
}

function jumpToPrevScrollPosition(context) {
  var path = context.path;
  var scrollPosition = 0;
  var prevPathInfo = previousPaths[0];
  if(prevPathInfo && prevPathInfo.path === context.path) {
    scrollPosition = prevPathInfo.scrollPosition;
  }

  if(scrollPosition === 0) {
    // we can scroll right away since we don't need to wait for rendering
    $('body').animate({scrollTop: scrollPosition}, 0);
  } else {
    // Now we need to wait a bit for blaze/react does rendering.
    // We assume, there's subs-manager and we've previous page's data.
    // Here 10 millis deley is a arbitary value with some testing.
    setTimeout(function () {
      $('body').animate({scrollTop: scrollPosition}, 0);
    }, 10);
  }
}

FlowRouter.triggers.exit([saveScrollPosition]);
FlowRouter.triggers.enter([jumpToPrevScrollPosition]);*/
