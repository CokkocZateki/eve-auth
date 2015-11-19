Template.manageTimerList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timers');
  });
});
Template.manageTimerList.onRendered(function() {
  var currentDate = new Date();
  $('.datetimepicker').datetimepicker({
    format: 'ddd MMM D YYYY HH:mm:ss zZZ',
    minDate: currentDate,
    sideBySide: true,
    useUtc: true
  });
  function updTime() {
    document.getElementById('eve-time').innerHTML = moment().utc().format('YYYY-MM-DD HH:mm:ss [UTC]');
  }
  function startClock() {
    setInterval(function () { updTime(); }, 1000);
  }
  startClock();
});
Template.manageTimerList.helpers({
  dateTime: function() {
    return new Date();
  },
  timers: function() {
    var timers = Timers.find({active: true}, {sort: {time: 1}}).fetch();
    for (var i = 0; i < timers.length; i++) {
      // local time
      var localTime = new Date().getTimezoneOffset();
      if (localTime > 0) {
        timers[i].local_time = timers[i].time - (localTime * 60 * 1000);
      }
      else {
        timers[i].local_time = timers[i].time + (localTime * 60 * 1000);
      }
    }
    return timers;
  }
});

Template.manageTimerList.events({
  'submit #timer-create': function (event, template) {
    event.preventDefault();

    var name = event.target.name.value;
    var type = event.target.type.value;
    var fc = event.target.fc.value;
    var time = event.target.time.value;
    var text = event.target.text.value;

    timer = {
      name: name,
      type: type,
      fc: fc,
      time: time,
      text: text,
    };

    Meteor.call('createTimer', timer, function(error, result){
      if (!result) {
        return false;
      }
      event.target.name.value = '';
      event.target.type.value = '';
      event.target.fc.value = '';
      event.target.time.value = '';
      event.target.text.value = '';
    });
    return false;
  },
  'click .timer-edit': function (event, template) {
    $('#editTimer').modal('show');
  },
  'click .timer-delete': function (event, template) {
    Meteor.call('deleteTimer', this._id);
  }
});

Template.editTimer.events({
  'submit #timer-edit': function (event, template) {
    event.preventDefault();

    var id = this._id;
    var name = event.target.name.value;
    var type = event.target.type.value;
    var fc = event.target.fc.value;
    var time = event.target.time.value;
    var text = event.target.text.value;

    timer = {
      name: name,
      type: type,
      fc: fc,
      time: time,
      text: text,
    };

    Meteor.call('editTimer', id, timer, function(error, result){
      if (!result) {
        return false;
      }
      event.target.name.value = '';
      event.target.type.value = '';
      event.target.fc.value = '';
      event.target.time.value = '';
      event.target.text.value = '';
      $('#editTimer').modal('hide');
    });
    return false;
  }
});
