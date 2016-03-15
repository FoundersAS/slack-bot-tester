var test = require('tape');
var mokbot = require('./');

var romeo = mokbot({token: process.env.ROMEO_TOKEN, name: 'juliet'});
var juliet = mokbot({token: process.env.JULIET_TOKEN, name: 'romeo'});

test('script', function (t) {
  t.plan(4);
  juliet.join('general');
  romeo.join('general');

  romeo.script([
    {bot: 'Romeo!'},
    {tester: 'My dear?'},
    {bot: 'At what o\'clock to-morrow. Shall I send to thee?'},
    {tester: 'At the hour of nine.'},
    {bot: 'I will not fail: \'tis twenty years till then. I have forgot why I did call thee back.'},
    {tester: 'Let me stand here till thou remember it.'},
    {bot: 'I shall forget, to have thee still stand there, Remembering how I love thy company.'},
    {tester: 'And I\'ll still stay, to have thee still forget, Forgetting any other home but this.'}
  ], function (err, result) {
    t.notOk(err);
    t.ok(result.ok);
  });

  juliet.script([
    {tester: 'Romeo!'},
    {bot: 'My dear?'},
    {tester: 'At what o\'clock to-morrow. Shall I send to thee?'},
    {bot: 'At the hour of nine.'},
    {tester: 'I will not fail: \'tis twenty years till then. I have forgot why I did call thee back.'},
    {bot: 'Let me stand here till thou remember it.'},
    {tester: 'I shall forget, to have thee still stand there, Remembering how I love thy company.'},
    {bot: 'And I\'ll still stay, to have thee still forget, Forgetting any other home but this.'}
  ], function (err, result) {
    t.notOk(err);
    t.ok(result.ok);
  });
});

test('end', function (t) {
  t.end();
  process.exit();
});

