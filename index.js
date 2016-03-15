var botkit = require('botkit');
var EventEmitter = require('events').EventEmitter;
var TESTER_NAME = 'robbie';

module.exports = function (opts) {
  var that = new EventEmitter();
  var controller = botkit.slackbot();
  var currentChannel;
  var channels = {};
  var isRTMOpen = false;
  var rtmOpenCbs = [];
  var replyCbs = [];
  var mentionCbs = [];
  var matchCbs = [];
  var bot;

  var tester = controller.spawn({
    token: opts.token,
  }).startRTM();

  tester.api.users.list({}, function (err, users) {
    if (err) return that.emit('error', err);
    bot = users.members.filter(function (user) {
      return user.name === opts.name;
    })[0];
    if (!bot) that.emit('error', new Error('Couldn\'t find the bot'));
  })

  controller.hears('', ['message', 'direct_message', 'mention', 'direct_mention'], function(tester, message) {
    if (replyCbs.length) replyCbs.shift()(null, message);
    if (mentionCbs.length && message.event === 'direct_mention') mentionCbs.shift()(null, message);
    if (!matchCbs.length) return;
    var idx = matchCbs.reduce(function (idx, matchCb, i) {
      return idx === -1 && message.text.match(matchCb.regex) ? i : idx;
    }, -1);
    if (idx === -1) return;
    matchCbs[idx].cb(message);
    matchCbs = matchCbs.slice(0, idx).concat(matchCbs.slice(idx + 1)); // Remove the matching cb
  });

  controller.on('rtm_open', function () {
    isRTMOpen = true;

    rtmOpenCbs.forEach(function (fn) {
      fn();
    });
  });

  that.join = function (channel, cb) {
    cb = cb || function () {};
    tester.api.channels.list({}, onlist);

    function onlist (err, chs) {
      if (err) return cb(err);
      var ch = chs.channels.filter(function (info) {
        return info.name === channel;
      })[0];

      channels[channel] = ch.id;
      currentChannel = ch.id;

      cb();
    }
  };

  that.say = function (message, opts) {
    if (!isRTMOpen) return rtmOpenCbs.push(that.say.bind(null, message, opts));

    opts = opts || {};
    var ch = currentChannel;
    if (opts.channel) ch = channels[opts.channel];

    tester.say({text: message, channel: ch});
  };

  that.mention = function (message, opts) {
    that.say('@'+bot.name+': ' + message, opts);
  };

  that.dm = function (message, opts) {
    if (!isRTMOpen) return rtmOpenCbs.push(that.dm.bind(null, message, opts));

    tester.startPrivateConversation({user: bot.id}, function (response, convo){
      convo.say(message);
    });
  }

  that.nextReply = function (cb) {
    replyCbs.push(cb);
  };

  that.nextMention = function (cb) {
    mentionCbs.push(cb);
  };

  that.nextMatch = function (regex, cb) {
    matchCbs.push({regex: regex, cb: cb});
  };

  return that;
};
