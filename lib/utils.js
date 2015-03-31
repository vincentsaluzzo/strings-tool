var stringsLib = require("i18n-strings-files");
var xlsxReader = require('xlsx-rows');
var he = require('he');
var xlsxWriterLib = require('node-simple-xlsx');
var xml2js = require('xml2js');
var fs = require('fs');

function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
        replace(/\u0008/g, '\\b').
        replace(/\t/g, '\\t').
        replace(/\n/g, '\\n').
        replace(/\f/g, '\\f').
        replace(/\r/g, '\\r').
        replace(/'/g, '\\\'').
        replace(/"/g, '\\"');
}


var Utils = {}

Utils.xlsxToObject = function(inputFile) {

    var strings = {};

    var rows = xlsxReader(inputFile);

    var headers = rows[0];

    for (var i = 1 ; i < rows.length; i++) {
      var row = rows[i];
      var key = row[0];
      var perLang = {}
      for (var y = 1; y < row.length; y++) {
        var lang = headers[y];
        perLang[lang] = row[y] || "";
      }

      strings[key] = perLang;
    }

    return strings;
}

Utils.writeObjectToXLSX = function(inputObject, outputPath) {
  var array = new Array();
  for (key in inputObject) {
    var row = {"key" : key};

    for (countryCode in inputObject[key]) {
      row[countryCode] = inputObject[key][countryCode];
    }
    array.push(row);
  }

  xlsxWriterLib.write(outputPath, array, function (err) {
  })
}

Utils.splitFilesMap = function(filesMap) {
  var map = {};

  for (var i = 0; i < filesMap.length; i++) {
    var outputFile = filesMap[i];

    var split = outputFile.split(':');
    map[split[0]] = split[1];
  }
  return map;
}


Utils.createAndroidXMLFromStrings = function(countryCode, strings) {
  var stringFile = new Array("<?xml version=\"1.0\" encoding=\"utf-8\"?>", "<resources>");


  for (key in strings) {
    var langStr = strings[key];
    var value = langStr[countryCode]

    if (value !== undefined) {
      if ((value.indexOf('<') != -1 || value.indexOf('>') != -1)) {
        stringFile.push("\t<string name=\"" + key + "\"><![CDATA[" + value + "]]></string>")

      } else {
        stringFile.push("\t<string name=\"" + key + "\">" + addslashes(value) + "</string>")
      }


      stringFile[key] = value;
    }
  }

  stringFile.push("</resources>");

  return stringFile.join('\n');
};


Utils.createAppleStringsFromStrings = function(countryCode, strings) {
  var stringFile = {};

  for (key in strings) {
    var langStr = strings[key];
    var value = langStr[countryCode]
    if (value !== undefined) {
      stringFile[key] = value;
    }
  }

  return stringsLib.compile(stringFile);
};

Utils.createStringsFromAndroidXMLFiles = function(inputFiles) {
  var inputFilesCountryMap = Utils.splitFilesMap(inputFiles);
  var strings = {};

  for (country in inputFilesCountryMap) {
    var inputFile = inputFilesCountryMap[country];

    var stringData = fs.readFileSync(inputFile, 'UTF-8');

    var parsingFinished = false

    xml2js.parseString(stringData, function(err, data ) {

      var stringsData = data.resources.string
      for (var stringIndex = 0; stringIndex < stringsData.length; stringIndex++) {
        var children = stringsData[stringIndex];

        var key = children["$"].name;
        var value = (children["_"] || "");
        value = value.replace(/\\/g, '');


        var finalValues = {}
        if (strings[key] !== undefined) {
          finalValues = strings[key];
        }

        finalValues[country] = value;
        strings[key] = finalValues

      }
      parsingFinished = true;
    });
    while(parsingFinished == false);
  }

  return strings;
}

Utils.createStringsFromAppleStringsFiles = function(inputFiles) {

  var inputFilesCountryMap = Utils.splitFilesMap(inputFiles);
  var strings = {};

  for (country in inputFilesCountryMap) {
    var inputFile = inputFilesCountryMap[country];

    var data = stringsLib.readFileSync(inputFile, 'UTF-8');

    for (key in data) {
      var value = data[key];

      var finalValues = {}
      if (strings[key] !== undefined) {
        finalValues = strings[key];
      }

      finalValues[country] = value;
      strings[key] = finalValues
    }

  }
  return strings;
}

module.exports = Utils;
