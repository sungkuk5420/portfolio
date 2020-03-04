var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var dotenv = require("dotenv");
// var translate = require("translate-google");

dotenv.config();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "KIM SUNGKUK" });
});

router.get("/colorfulTees", function(req, res, next) {
  res.render("colorfulTees", { title: "colorfulTees" });
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

// router.get("/googleTranslate", function(req, res) {
//   const { text, sendLang, resultLang } = req.query;

//   translate(text, { from: sendLang, to: resultLang })
//     .then(translatedText => {
//       let ja = resultLang == "ja" ? translatedText : "";
//       let ko = resultLang == "ko" ? translatedText : "";
//       res.json(JSON.stringify({ sendText: text, ja, ko }));
//     })
//     .catch(err => {
//       console.error(err);
//     });
// });
// 네이버 Papago NMT API 예제
var client_id = "SaELp5LuZ87OYdG8LHVt";
var client_secret = "KOq42k_ftL";
// var query = "とりあえず終わる見込みがあり作業工数が発生しているものはStage設定済み（見積もり対象月の設定）。下記レポートはStageなし（見積もり予定がまだ立っていないもの）の一覧ですので共有させていただきます。";
router.get("/translate", function(req, res) {
  const { text, sendLang, resultLang } = req.query;
  console.log(text);
  var api_url = "https://openapi.naver.com/v1/papago/n2mt";
  var request = require("request");
  var options = {
    url: api_url,
    form: { source: sendLang, target: resultLang, text },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret
    }
  };
  request.post(options, function(error, response, body) {
    if (response != undefined) {
      if (!error && response.statusCode == 200) {
        let translatedText = JSON.parse(body).message.result.translatedText;
        let ja = resultLang == "ja" ? translatedText : "";
        let ko = resultLang == "ko" ? translatedText : "";
        res.json(JSON.stringify({ sendText: text, ja, ko }));
        res.end();
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
