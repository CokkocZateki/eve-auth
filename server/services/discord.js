/**
 * Discord service
 *
 */
/*
if (Meteor.settings.services.discord.enabled) {

  var Discordbot = Meteor.npmRequire('discord.io');
  var bot = new Discordbot({
   email: Meteor.settings.services.discord.email,
   password: Meteor.settings.services.discord.password,
   autorun: true // Start and login automatically
  });

  bot.on('err', function(error) {
    console.log(error);
  });

  bot.on('ready', function(rawEvent) {
    console.log('Discord Bot Connected');
    console.log('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
    bot.setPresence({
      // optional, indicates you are playing a game
      // can also be null to remove game
      game_id: Meteor.settings.services.discord.game_id
    });
  });

  bot.on('disconnected', function() {
    console.log('Discord Bot Disconnected');
    bot.connect(); //Auto reconnect
  });

  var isDirectMessage = function(channelID) {
    if (bot.servers[bot.serverFromChannel(channelID)] === undefined) {
      return true;
    } else {
      return false;
    }
  };

  bot.on('message', function(user, userID, channelID, message, rawEvent) {
    if (message === 'ping') {
  		bot.sendMessage({
        to: channelID,
        message: 'pong'
      });
      console.log(Meteor.services.discord.isDirectMessage(channelID));
    }
  });

  Meteor.services.discord = {

    // seriveName MUST match its name under services in settings.json
    name: function() {
     return 'discord';
    },
    sendMsg: function(channelID) {
      bot.sendMessage({
        to: channelID,
        message: 'pong'
      });
    },
    isDirectMessage: function(channelID) {
      if (bot.servers[bot.serverFromChannel(channelID)] === undefined) {
        return true;
      } else {
        return false;
      }
    }


  };

}
*/
