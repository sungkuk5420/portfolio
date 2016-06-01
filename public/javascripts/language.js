$.lang = [];
var nowLanguage = 'ko';
$.lang.push({
  ko : "반갑습니다.",
  en : "Hi,I'm",
  ja : '初めまして'
});
$.lang.push({
  ko : '김성국입니다.',
  en : 'KIM SUNGKUK',
  ja : 'キムソングクです'
});
$.lang.push({
  ko : '웹 개발자',
  en : 'WEB DEVELOPER',
  ja : 'ウェブプログラマです'
});
$.lang.push({
  ko : '이력서 다운로드',
  en : 'DOWNLOAD RESUME',
  ja : '履歴書ダウンロード'
});
$.lang.push({
  ko : '이력서',
  en : 'RESUME',
  ja : '履歴書'
});
$.lang.push({
  ko : '포트폴리오',
  en : 'PROFILE',
  ja : 'ポートフォリオ'
});
$.lang.push({
  ko : '블로그',
  en : 'BLOG',
  ja : 'ブログ'
});
$.lang.push({
  ko : '연락처',
  en : 'CALL ME',
  ja : '連絡'
});
$.lang.push({
  ko : '이름 :',
  en : 'Name :',
  ja : '名前 :'
});

$.lang.push({
  ko : '생년 월일 :',
  en : 'Date of birth :',
  ja : '誕生日 :'
});
$.lang.push({
  ko : '주소 :',
  en : 'Address :',
  ja : '住所 :'
});

$.lang.push({
  ko : '이메일 :',
  en : 'Email :',
  ja : 'メール :'
});

$.lang.push({
  ko : '전화 번호 :',
  en : 'Phone :',
  ja : '電話番号 :'
});

$.lang.push({
  ko : '김 성 국',
  en : 'KIM SUNGKUK　',
  ja : '金 成 局'
});

$.lang.push({
  ko : '1993년 06월 09일',
  en : 'June 6, 1993',
  ja : '1993年06月09日'
});

$.lang.push({
  ko : '538-0051 오사카 쓰루미구 ６-１５−３３ 샤토 레이크 루이즈 803호',
  en : '538-0051 Osaka-shi, Tsurumi-ku, Moroguchi, 6-15-33 Shato-reiku-ruizu Room 803 ',
  ja : '〒538-0051 大阪府大阪市鶴見区諸口６丁目１５−３３ シャトー・レイク・ルイーズ 803号室'
});

$.lang.push({
  ko : '저의 주 분야는 web FrontEnd입니다 <br> 대학에서 기본적인 c, c++, java, mysql, linux등을 배우고 독학으로 php, javascript, jquery, html, css등을 배웠습니다',
  en : 'My state in charge is web frontend. <br> at the University of basic c, java, c++, my sql, linux and other, learn and a self-taught php java script, html, jquery, css, and the like.',
  ja : '私の特技はweb FrontEndです <br>大学で基本的なc、c++、java、mysql、linuxなどを学んで独学でphp、javascript、jquery、html、cssなどを学びました'
});

$.lang.push({
  ko : 'Angularjs나 react나 backbone이나 사용해본적 없지만 프레임워크를 사용하지않고 원 페이지로 웹 서비스를 만들어본 경험이 있어 실력을 입증할 수 있습니다. <br>  만약 귀사가 사용하는 프레임워크가 있다면 배우겠습니다.',
  en : 'Angularjs and react backbone, or framework but have never used not seen Web service experience in running around and look. So Confident of skill. <br> if your company have a framework used by actor.',
  ja : 'Angularjsやreactやbackboneや使ったことがありますがフレームワークを使用せず、ワンページでウェブサービスを作ってみた経験があり、実力を立証することができます。 <br>もし貴社が使用するフレームワークがあるなら、学びます。'
});

$.lang.push({
  ko : '2016년 05월부터 워킹홀리데이로 일본 오사카에서 거주 중입니다.',
  en : 'From May 2016,Have been living in Osaka, Japan in walking holiday.',
  ja : '2016年05月からワーキングホリデイで日本大阪で住んでいます。'
});

/**
 * setLanguage
 * use $.lang[currentLanguage][languageNumber]
 */
function setLanguage(currentLanguage) {
  $('[data-langtext]').each(function() {
    var $this = $(this);
    console.log($this.data('langtext'));
    var searchIndex = arrayObjectIndexOf($.lang,$this.text().replace(/ /gi,''),nowLanguage);
    if(searchIndex != -1){
      $this.html($.lang[searchIndex][currentLanguage]);
    }else{
      console.log($this.text());
    }
  }).each(function() {
    nowLanguage = currentLanguage;
  });
}

// 언어 변경
$('button').click(function() {
  var lang = $(this).data('lang');
  setLanguage(lang);
});

function arrayObjectIndexOf(myArray, searchText, property) {
  for(var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property].replace(/ /gi,'').replace(/<br>/gi,'') === searchText ) return i;
  }
  return -1;
}