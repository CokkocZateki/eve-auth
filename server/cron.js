var checkCorporations = function() {
  HTTP.get('https://public-crest.eveonline.com/alliances/' + Meteor.settings.eve.id + '/',  function(err, res) {
    if (err) {
      console.log(err);
    }
    else if (res.statusCode === 200) {
      var resJson = JSON.parse(res.content);
      var corps = Corporations.find().fetch();
      // match corps in alliance with corp records
      _.each(resJson.corporations, function(corpInAlliance) {
        var match = false;
        _.each(corps, function(corp) {
          if (corp.corp_id === corpInAlliance.id) {
            match = true;
          }
        });
        // new alliance corp
        if (!match) {
          var corp = Async.runSync(function(done) {
            Eveonlinejs.fetch('corp:CorporationSheet', {corporationID: corpInAlliance.id}, function (err, res) {
              if (err) {
                console.log(err);
              }
              done(null, res);
            });
          });
          if (corp.result) {
            var date = new Date();
            Corporations.upsert(
              { name: corp.result.corporationName },
              {
                $setOnInsert: {
                  name: corp.result.corporationName,
                  ticker: corp.result.ticker,
                  corp_id: corp.result.corporationID,
                  created: date,
                  modified: date
                }
                //$set: {}
              }
            );
            // add new group for corp
            Groups.upsert(
              {name: corp.result.corporationName},
              {
                $setOnInsert: {
                  name: corp.result.corporationName,
                  service_name: corp.result.ticker,
                  description: corp.result.corporationName,
                  requirement: 'Member of ' + corp.result.corporationName,
                  public: false,
                  joinable: false,
                  users: [],
                  users_pending: [],
                  roles: [],
                  created: date,
                  modified: date
                }
                //$set: {}
              }
            );
          }
        }
      });

      // match corps in record with alliance corps
      _.each(corps, function(corp) {
        var match = false;
        _.each(resJson.corporations, function(corpInAlliance) {
          if (corp.corp_id === corpInAlliance.id) {
            match = true;
          }
        });
        // corp record no longer in alliance
        if (!match) {
          var services = Services.find({enabled: true}).fetch();
          var group = Groups.findOne({name: corp.name});
          // loop through all users in group
          _.each(group.users, function(userID) {
            var user = Meteor.users.findOne(userID);
            // remove user from each service
            _.each(services, function(service) {
              if (Meteor.services.hasOwnProperty(service.service)) {
                var obj = Meteor.services[service.service];
                obj.removeUser(user._id);
              }
            });
            // remove user from groups
            Groups.update({users: user._id}, {$pull: {users: user._id}});
            // remove user from auth
            Meteor.users.remove(user._id);
          });
          // remove group from services
          _.each(services, function(service) {
            if (Meteor.services.hasOwnProperty(service.service)) {
              var obj = Meteor.services[service.service];
              obj.removeGroup(group.service_name);
            }
          });
          // remove group from auth
          Groups.remove(group._id);
          // remove corp from auth
          Corporations.remove(corp._id);
        }
      });

      return true;
    }
  });
};

var checkUsers = function() {
  var id = Meteor.settings.eve.id;
  var services = Services.find({enabled: true}).fetch();
  var users = Meteor.users.find().fetch();
  // check each user, make sure still in alliance/corp
  _.each(users, function(user) {
    var charID = user.services.eve.character.id;
    var char = Async.runSync(function(done) {
      Eveonlinejs.fetch('eve:CharacterAffiliation', {ids: charID}, function (err, res) {
        if (err) {
          throw new Meteor.Error(err);
        }
        else { done(err, res); }
      });
    });
    var resID = 0;
    // check if char is in alliance or corp
    if (Meteor.settings.eve.alliance) {
      resID = parseInt(char.result.characters[charID].allianceID);
    }
    else {
      resID = parseInt(char.result.characters[charID].corporationID);
    }
    if (resID !== id) {
      // user no longer in alliance/corp
      // remove user from each service
      _.each(services, function(service) {
        if (Meteor.services.hasOwnProperty(service.service)) {
          var obj = Meteor.services[service.service];
          obj.removeUser(user._id);
        }
      });
      // remove user from groups
      Groups.update({users: user._id}, {$pull: {users: user._id}});
      // remove user from auth
      Meteor.users.remove(user._id);
    }
  });
  return true;
};

// set old timers to inactive
var checkTimers = function() {
  var date = new Date();
  // let timers be visible for up to 5 minutes after their time
  var minutes = 5;
  date.setMinutes(date.getMinutes() + minutes);
  var timers = Timers.find({active: true}).fetch();
  _.each(timers, function(timer) {
    if (date >= timer.time) {
      Timers.update(timer._id, {$set: {active: false}});
    }
  });
  return true;
};

/**
 * SyncCron
 */
 SyncedCron.config({
   log: true,
   collectionName: 'cronHistory',
   utc: true,
   collectionTTL: 172800
 });
/**
 * get alliance corps
 * https://public-crest.eveonline.com/alliances/:allianceID/
 * add/remove corps
 * corp joins, what happens
 * corp leaves, what happens
 *
 */
if (Meteor.settings.eve.alliance) {
   SyncedCron.add({
     name: 'Check Corporations',
     schedule: function(parser) {
       return parser.text('every 1 mins');
     },
     job: function() {
       return checkCorporations();
     }
   });
}
/**
 * check that users are in correct alliance/corp
 * user leaves alliance or corp, what happens
 */
 SyncedCron.add({
   name: 'Check User',
   schedule: function(parser) {
     return parser.text('every 1 mins');
   },
   job: function() {
     return checkUsers();
   }
 });

/**
 * check timers, set old ones to inactive
 */
 SyncedCron.add({
   name: 'Check Timer',
   schedule: function(parser) {
     return parser.text('every 1 mins');
   },
   job: function() {
     return checkTimers();
   }
 });

 SyncedCron.start();
