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


/**
 * setLanguage
 * use $.lang[currentLanguage][languageNumber]
 */
function setLanguage(currentLanguage) {
  $('[data-langtext]').each(function() {
    var $this = $(this);
    console.log($this.data('langtext'));
    var searchIndex = arrayObjectIndexOf($.lang,$this.text(),nowLanguage);
    $this.html($.lang[searchIndex][currentLanguage]);
  }).each(function() {
    nowLanguage = currentLanguage;
  });
}

// 언어 변경
$('button').click(function() {
  var lang = $(this).data('lang');
  setLanguage(lang);
});

function arrayObjectIndexOf(myArray, searchTerm, property) {
  for(var i = 0, len = myArray.length; i < len; i++) {
    if (myArray[i][property] === searchTerm) return i;
  }
  return -1;
}