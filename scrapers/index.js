// scrapers/index.js

const path = require("path");
const childProcess = require("child_process");

// path to PhantomJS bin
const phantomJsPath = __dirname + '/../bin/phantomjs';

exports.fetch = function(url, reject, resolve) {
  console.log('Process for ' + url)
  // execute phantom-script.js file via PhantomJS
  const childArgs = [path.join(__dirname, "phantom-script.js")];
  const phantom = childProcess.execFile(phantomJsPath, childArgs, {
    env: {
      URL: url
    },
    maxBuffer: 2048 * 1024 * 1024 * 1024
  });

  let stdout = "";
  let stderr = "";

  // data comes gradually, bit by bit
  phantom.stdout.on("data", function(chunk) {
    stdout += chunk;
  });

  phantom.stderr.on("data", function(chunk) {
    stderr += chunk;
  });

  phantom.on("uncaughtException", function(err) {
    console.log("uncaught exception: " + err);
  });

  phantom.on("exit", function(exitCode) {
    if (exitCode !== 0) {
      return reject(stderr, url);
    }

    resolve(stdout, url);
  });
};

