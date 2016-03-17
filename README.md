```
   _____ _            _      _           _     _            _            
  / ____| |          | |    | |         | |   | |          | |           
 | (___ | | __ _  ___| | __ | |__   ___ | |_  | |_ ___  ___| |_ ___ _ __ 
  \___ \| |/ _` |/ __| |/ / | '_ \ / _ \| __| | __/ _ \/ __| __/ _ \ '__|
  ____) | | (_| | (__|   <  | |_) | (_) | |_  | ||  __/\__ \ ||  __/ |   
 |_____/|_|\__,_|\___|_|\_\ |_.__/ \___/ \__|  \__\___||___/\__\___|_|   
```

## install (todo)

```sh
npm install slack-bot-tester
```

## example test using tape

Let's say you have a bot that says 'hello' when you say hi to it,
and it reacts with a :heart: when you tell it 'you rock'. Here is
how you test it.

```js
var test = require('tape');
var botTester = require('slack-bot-tester');

test('simple test', function (t) {
  tester = botTester({
    token: '<your slack topen here>',
    name: <name of bot you want to test>
  });

  tester.nextReply(onreply);
  tester.nextReaction(onreaction);

  tester.say('hi');

  function onreply (err, msg) {
    t.notOk(err);
    t.equal(msg.text, 'hello');
  }

  function onreaction (err, reaction) {
    t.notOk(err);
    t.equal(reaction.reaction, 'heart');
  }
});
```

## api

### Setup

```sh
var mokbot = require('slack-bot-tester');

var tester = mokbot({
  token: '<your slack topen here>',
  name: '<name of bot you want to test>'
});
```

### .join(channel)

Join a channel

```js
tester.join('general');
```

### .say(message)

Say something in the channel

```js
tester.say('Hello everyone!');
```

### .mention(message)

Mention the bot by name directly in a message

```js
tester.mention('Can I have some beer?');
```

### .dm(message)

**Notice:** Not working yet.

Directly message your bot

```js
tester.dm('I like private chats more.');
```

### .nextReply(callback)

Calls the callback the next time your bot says something, either in the channel, or as a direct message.

```js
tester.nextReply(function (message) {
  console.log('My bot said', message, 'in the channel or as a direct message');
});
```

### .nextMention(callback)

Calls the callback the next time the tester bot is mentioned.

```js
tester.nextMention(function (message) {
  console.log('I got a mention with this message:', message);
});
```

### .nextMatch(regex, callback)

Calls the callback the next time a message matches your regex.

```js
tester.nextMention(/hello/, function (message) {
  console.log('This message contains the word "hello":', message);
});
```

### .nextReaction(callback)

Call a callback when the bot reacts to a message in the current channel.

```js
tester.nextReaction(function (reaction) {
  console.log('The bot reacted to a message in the channel.');
});
```

### .script(erray, callback)

You can do entire scripts with this convenience method.

```js
tester.script([
  {tester: 'Romeo!'},
  {bot: 'My dear?'},
  {tester: 'At what o\'clock to-morrow. Shall I send to thee?'},
  {bot: 'At the hour of nine.'},
  {tester: 'I will not fail: \'tis twenty years till then. I have forgot why I did call thee back.'},
  {bot: 'Let me stand here till thou remember it.'},
  {tester: 'I shall forget, to have thee still stand there, Remembering how I love thy company.'},
  {bot: 'And I\'ll still stay, to have thee still forget, Forgetting any other home but this.'}
], function (err, result) {
  // ...
});
```
