var Utils = require('./utils');
var fs = require('fs');
var Command = {};




Command.import = function(platform, inputFile, outputFilesMapping, callback) {

  var stringObjectWrapping = Utils.xlsxToObject(inputFile);
  var countryOutputPathMap = Utils.splitFilesMap(outputFilesMapping);

  for (country in countryOutputPathMap) {
    var outputPath = countryOutputPathMap[country];

    if (platform == "android") {

      fs.writeFileSync(outputPath, Utils.createAndroidXMLFromStrings(country, stringObjectWrapping));

    } else {

      fs.writeFileSync(outputPath, Utils.createAppleStringsFromStrings(country, stringObjectWrapping));

    }
  }

}

Command.export = function(platform, inputFilesMapping, outputFile, callback) {

  var strings = {};

  if (platform == "android") {

    strings = Utils.createStringsFromAndroidXMLFiles(inputFilesMapping);

  } else {

    strings = Utils.createStringsFromAppleStringsFiles(inputFilesMapping);

  }

  Utils.writeObjectToXLSX(strings, outputFile);
}


module.exports = Command;
