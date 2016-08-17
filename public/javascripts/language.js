$.lang = [];
var nowLanguage = 'ko';

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
      //if(nowLanguage == 'ja'){
      // $this.addClass('japanText')
      //}
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

var X = XLS;
var userabsValue=false;
var useworkerValue=false;
var xferableValue=false;
var XW = {
  /* worker message */
  msg: 'xls',
  /* worker scripts */
  rABS: '/javascripts/xlsx/xlsworker2.js',
  norABS: '/javascripts/xlsx/xlsworker1.js',
  noxfer: '/javascripts/xlsx/xlsworker.js'
};

var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
if(!rABS) {
  userabsValue = false;
}

var use_worker = typeof Worker !== 'undefined';
if(!use_worker) {
  useworkerValue = false;
}

var transferable = use_worker;
if(!transferable) {
  xferableValue = false;
}

var wtf_mode = false;

function fixdata(data) {
  var o = "", l = 0, w = 10240;
  for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
  o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
  return o;
}

function ab2str(data) {
  var o = "", l = 0, w = 10240;
  for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
  o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
  return o;
}

function s2ab(s) {
  var b = new ArrayBuffer(s.length*2), v = new Uint16Array(b);
  for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i);
  return [v, b];
}

function xw_noxfer(data, cb) {
  var worker = new Worker(XW.noxfer);
  worker.onmessage = function(e) {
    switch(e.data.t) {
      case 'ready': break;
      case 'e': console.error(e.data.d); break;
      case XW.msg: cb(JSON.parse(e.data.d)); break;
    }
  };
  var arr = rABS ? data : btoa(fixdata(data));
  worker.postMessage({d:arr,b:rABS});
}

function xw_xfer(data, cb) {
  var worker = new Worker(rABS ? XW.rABS : XW.norABS);
  worker.onmessage = function(e) {
    switch(e.data.t) {
      case 'ready': break;
      case 'e': console.error(e.data.d); break;
      default: xx=ab2str(e.data).replace(/\n/g,"\\n").replace(/\r/g,"\\r"); console.log("done"); cb(JSON.parse(xx)); break;
    }
  };
  if(rABS) {
    var val = s2ab(data);
    worker.postMessage(val[1], [val[1]]);
  } else {
    worker.postMessage(data, [data]);
  }
}

function xw(data, cb) {
  transferable = xferableValue;
  if(transferable) xw_xfer(data, cb);
  else xw_noxfer(data, cb);
}

function get_radio_value( radioName ) {
  var radios = document.getElementsByName( radioName );
  for( var i = 0; i < radios.length; i++ ) {
    if( radios[i].checked || radios.length === 1 ) {
      return radios[i].value;
    }
  }
}

function to_json(workbook) {
  console.log(workbook);
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    console.log(roa);
    for(var i = 0, len = roa.length ; i < len ; i++){
      $.lang.push({
        ko : roa[i].ko,
        en : roa[i].en,
        ja : roa[i].ja
      });
    }
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  return result;
}

function to_csv(workbook) {
  var result = [];
  workbook.SheetNames.forEach(function(sheetName) {
    var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    if(csv.length > 0){
      result.push("SHEET: " + sheetName);
      result.push("");
      result.push(csv);
    }
  });
  return result.join("\n");
}

function to_formulae(workbook) {
  var result = [];
  workbook.SheetNames.forEach(function(sheetName) {
    var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
    if(formulae.length > 0){
      result.push("SHEET: " + sheetName);
      result.push("");
      result.push(formulae.join("\n"));
    }
  });
  return result.join("\n");
}

function process_wb(wb) {
  if(use_worker) XLS.SSF.load_table(wb.SSF);
  var output = "";
  //switch(get_radio_value("format")) {
  switch('json') {
    case "json":
      output = JSON.stringify(to_json(wb), 2, 2);
      break;
    case "form":
      output = to_formulae(wb);
      break;
    default:
      output = to_csv(wb);
  }
  if(out.innerText === undefined) out.textContent = output;
  else out.innerText = output;
  if(typeof console !== 'undefined') console.log("output", new Date());
}

var xlf = document.getElementById('xlf');
function handleFile(e) {
  rABS = userabsValue;
  use_worker = useworkerValue;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://ec2-52-34-253-229.us-west-2.compute.amazonaws.com:3000/language.xls', true);
  //xhr.open('GET', 'http://localhost:3000/language.xls', true);
  xhr.responseType = 'blob';

  xhr.onload = function(e) {
    if (this.status == 200) {
      // get binary data as a response
      var blob = this.response;
      var files = e.target.files;
      var f = blob;

      {
        var reader = new FileReader();;
        var name = f.name;

        reader.onload = function(e) {
          if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
          var data = e.target.result
          if(use_worker) {
            xw(data, process_wb);
          } else {
            var wb;
            if(rABS) {
              wb = X.read(data, {type: 'binary'});
            } else {
              var arr = fixdata(data);
              wb = X.read(btoa(arr), {type: 'base64'});
            }
            process_wb(wb);
          }
        };

        if(rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
      }
    }
  };

  xhr.send();


}

if(xlf.addEventListener) xlf.addEventListener('change', handleFile, false);
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36810333-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
