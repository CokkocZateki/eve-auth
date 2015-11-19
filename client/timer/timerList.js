Template.timerList.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('timers');
  });
});
Template.timerList.onRendered(function() {
function updTime() {
  document.getElementById('eve-time').innerHTML = moment().utc().format('YYYY-MM-DD HH:mm:ss [UTC]');
}
function startClock() {
  setInterval(function () { updTime(); }, 1000);
}
startClock();
});

Template.timerList.helpers({
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
