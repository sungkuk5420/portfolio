var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  $.get('/language.xls', function(data) {
    console.log(data);
  });
});

router.get('/colorfulTees', function(req, res, next) {
  res.render('colorfulTees', { title: 'Express' });
});

router.get('/xlsxText', function(req, res, next) {
  res.render('xlsxText', { title: 'Express' });
});

router.post('/language',function(req, res, next) {
  console.log(res);
  $.get('/language.xls', function(data) {
    console.log(data);
  });
});
router.post('/mailSend',function(req, res, next) {
  var name = req.query.name;
  var data = {
    name: name,
    email : req.query.email,
    title: req.query.title,
    message: req.query.message
  };

  var bodyKeys = Object.keys(req.body);
  for (var i = 0; i < bodyKeys.length; i++) {
    var key = bodyKeys[i];
    data[key] = req.body[key];
  }

  var smtpTransport = nodemailer.createTransport("SMTP", {
    service: 'Gmail',
    auth: {
      user: 'sungkukEmailClient@gmail.com',
      pass: 'as123555'
    }
  });
  //var mailOptions = {
  //  from: '송성광 <saltfactory@gmail.com>',
  //  to: 'sungkuk5420@gmail.com',
  //  text: '테스트 메일',
  //  subject: '임마!!',
  //};
  var email = data.email;
  var mailOptions = {
    from: data.name+'　 <saltfactory@gmail.com>',
    to: 'sungkuk5420@gmail.com',
    text: data.message,
    subject: data.name+ '(' + email + ')님이 보내신 메일',
  };
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent : " + response.message);
    }
    smtpTransport.close();
    res.end();
  });

  console.log(data);
  console.log(data.email);
});
module.exports = router;

router.get('/luxuryWatch', function(req, res, next) {
  res.render('luxuryWatch', { title: 'Express' });

});


// 네이버 Papago NMT API 예제
var client_id = 'vu8G4adE4oGZQHOrDH3C';
var client_secret = '4_gCSpwtbz';
// var query = "とりあえず終わる見込みがあり作業工数が発生しているものはStage設定済み（見積もり対象月の設定）。下記レポートはStageなし（見積もり予定がまだ立っていないもの）の一覧ですので共有させていただきます。";
router.get('/translate', function (req, res) {
  console.log(req.query.text);
  var api_url = 'https://openapi.naver.com/v1/language/translate';
  var request = require('request');
  var options = {
    url: api_url,
    form: {'source':'ko', 'target':'ja', 'text':req.query.text},
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      // console.log(JSON.stringify(body));
      //   res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(JSON.stringify(body));
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

module.exports = router;
