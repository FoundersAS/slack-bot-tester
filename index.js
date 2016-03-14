var botkit = require('botkit');

module.exports = function (opts) {
  var that = {};
  var controller = botkit.slackbot();
  var currentChannel;
  var channels = {};
  var isRTMOpen = false;
  var rtmOpenCbs = [];
  var replyCbs = [];

  var bot = controller.spawn({
    token: opts.token,
  }).startRTM();

  controller.hears('', ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
    if (!replyCbs.length) return;
    replyCbs.shift()(null, message);
  });

  controller.on('rtm_open', function () {
    isRTMOpen = true;

    rtmOpenCbs.forEach(function (fn) {
      fn();
    });
  });

  that.join = function (channel, cb) {
    cb = cb || function () {};
    bot.api.channels.list({}, onlist);

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

    bot.say({text: message, channel: ch});
  };

  that.nextReply = function (cb) {
    replyCbs.push(cb);
  };

  return that;
};
