var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var dotenv = require("dotenv");
dotenv.config();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "KIM SUNGKUK" });
});

router.get("/colorfulTees", function(req, res, next) {
  res.render("colorfulTees", { title: "colorfulTees" });
});

router.post("/language", function(req, res, next) {
  console.log(res);
  $.get("/language.xls", function(data) {
    console.log(data);
  });
});
router.post("/mailSend", async function(req, res, next) {
  const {
    body: { email, name, content }
  } = req;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    }
  });
  console.log("mailSend start");
  try {
    let sendData = await transporter.sendMail({
      from: email, // sender address
      to: "sungkuk5420@gmail.com", // list of receivers
      subject: "<" + name + ">님이 포트폴리오에서 보낸 이메일 (" + email + ")", // Subject line
      text: content,
      html: content
    });
    res.json({
      message: "Mail Send Success"
    });
    res.end();
  } catch (error) {
    next("Mail Send Fail Error Message is : " + error);
  }
});

router.get("/luxuryWatch", function(req, res, next) {
  res.render("luxuryWatch", { title: "luxuryWatch" });
});

// 네이버 Papago NMT API 예제
var client_id = "vu8G4adE4oGZQHOrDH3C";
var client_secret = "4_gCSpwtbz";
// var query = "とりあえず終わる見込みがあり作業工数が発生しているものはStage設定済み（見積もり対象月の設定）。下記レポートはStageなし（見積もり予定がまだ立っていないもの）の一覧ですので共有させていただきます。";
router.get("/translate", function(req, res) {
  console.log(req.query.text);
  var api_url = "https://openapi.naver.com/v1/language/translate";
  var request = require("request");
  var options = {
    url: api_url,
    form: { source: "ko", target: "ja", text: req.query.text },
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret
    }
  };
  request.post(options, function(error, response, body) {
    if (response != undefined) {
      if (!error && response.statusCode == 200) {
        // console.log(JSON.stringify(body));
        //   res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        res.end(JSON.stringify(body));
      } else {
        res.status(response.statusCode).end();
        console.log("error = " + response.statusCode);
      }
    } else {
      console.log("responseresponseresponse" + error, response);
    }
  });
});

module.exports = router;
