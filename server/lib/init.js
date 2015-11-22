// init dependencies
Eveonlinejs = Meteor.npmRequire('eveonlinejs');
Eveonlinejs.setCache(new Eveonlinejs.cache.FileCache({path: './cache'}));

// startup services
Meteor.startup(function () {
  ServiceConfiguration.configurations.upsert(
    { service: 'eve' },
    {
      $setOnInsert: {
        clientId: Meteor.settings.eve.sso.client_id,
        secret: Meteor.settings.eve.sso.secret_key,
        loginStyle: 'popup'
      }
      //$set: {}
    }
  );
});

// check if alliance or corp set in settings
if (!Meteor.settings.eve.id) {
  throw new Meteor.Error('Alliance or Corp ID not set');
}

initializeGroupsAndCorps();

function initializeGroupsAndCorps() {

  // set default group
  var date = Date();
  var defaultGroup = 'member';
  Groups.upsert(
    {name: defaultGroup},
    {
      $setOnInsert: {
        name: defaultGroup,
        service_name: defaultGroup,
        description: 'Default Group',
        requirement: '',
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


  // if set for alliance, get corps and save
  if (Meteor.settings.eve.alliance && Meteor.settings.eve.id) {
    HTTP.get('https://public-crest.eveonline.com/alliances/' + Meteor.settings.eve.id + '/',  function(err, res) {
      if (err) {
        console.log(err);
      }
      else if (res.statusCode === 200) {
        var resJson = JSON.parse(res.content);
        for (i = 0; i < resJson.corporations.length; i++) {
          var corp = Async.runSync(function(done) {
            Eveonlinejs.fetch('corp:CorporationSheet', {corporationID: resJson.corporations[i].id}, function (err, res) {
              if (err) {
                console.log(err);
              }
              done(null, res);
            });
          });
          if (corp.result) {
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
      }
    });
  }
  // else set to only corp, get single corp
  else if (!Meteor.settings.eve.alliance && Meteor.settings.eve.id){
    var corp = Async.runSync(function(done) {
      Eveonlinejs.fetch('corp:CorporationSheet', {corporationID: Meteor.settings.eve.id}, function (err, res) {
        if (err) {
          console.log(err);
        }
        done(null, res);
      });
    });
    if (corp.result) {
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

}



/*
 Validate new user
 If they are not in corp or alliance deny them
 */
Accounts.validateNewUser(function (user) {
  var id =  Meteor.settings.eve.id;
  var charID = user.services.eve.character.id;

  // check if new user is in alliance or corp
  var char = Async.runSync(function(done) {
    Eveonlinejs.fetch('eve:CharacterAffiliation', {ids: charID}, function (err, res) {
      if (err) {
        throw new Meteor.Error(err);
      }
      else { done(err, res); }
    });
  });

  var resID = 0;
  if (Meteor.settings.eve.alliance) {
    resID = parseInt(char.result.characters[charID].allianceID);
    user.profile.alliance_id = parseInt(char.result.characters[charID].allianceID);
    user.profile.alliance_name = char.result.characters[charID].allianceName;
  }
  else {
    resID = parseInt(char.result.characters[charID].corporationID);
  }
  if (resID !== id) {
    throw new Meteor.Error(403, 'Not in Alliance or Corp');
  }
  user.profile.corporation_id = parseInt(char.result.characters[charID].corporationID);
  user.profile.corporation_name = char.result.characters[charID].corporationName;

  // set banned to false
  user.profile.banned = false;

  // add user to default groups
  var defaultGroup = Groups.findOne({name: 'member'});
  Groups.update(defaultGroup._id, {$push: {users: user._id}});
  var group = Groups.findOne({name: char.result.characters[charID].corporationName});
  Groups.update(group._id, {$push: {users: user._id}});

  // add default groups and role to new user
  user.groups = [defaultGroup._id, group._id];

  // user passed checks
  return true;
});

/*
 Validate login attempt
 */
Accounts.validateLoginAttempt(function (info) {
  var user = info.user;
  // user hasn't been created yet so return true to skip check
  if (typeof user === 'undefined') {
    return true;
  }
  // check if banned
  if (user.profile.banned) {
    info.allowed = false;
    return false;
  }
  // check if a user has no groups
  if (user.groups.length === 0) {
    // add to default group and corp group
    var defaultGroup = Groups.findOne({name: 'member'});
    Groups.update(defaultGroup._id, {$push: {users: user._id}});
    // add user to corp group
    var charID = user.services.eve.character.id;
    var char = Async.runSync(function(done) {
      Eveonlinejs.fetch('eve:CharacterAffiliation', {ids: charID}, function (err, res) {
        if (err) {
          throw new Meteor.Error(err);
        }
        else { done(err, res); }
      });
    });
    var group = Groups.findOne({name: char.result.characters[charID].corporationName});
    Groups.update(group._id, {$push: {users: user._id}});

    // add default groups and role to new user
    Meteor.users.update(user._id, {$set: {groups: [defaultGroup._id, group._id]}});
  }
  return true;
});
