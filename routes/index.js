var express = require('express');
var router = express.Router();
var mailUtil = require('../public/javascripts/nodeMailer');
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
