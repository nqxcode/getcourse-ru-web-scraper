const path = require("path");
const childProcess = require("child_process");

// path to PhantomJS bin
const phantomJsPath = process.env.SCRAPPER_PHANTOMJS_BIN || '/usr/local/bin/phantomjs'

exports.fetch = function(url) {
  console.log(`Fetch ${url}`)
  // execute phantom-script.js file via PhantomJS
  const childArgs = [path.join(__dirname, "phantom-script.js")];
  let maxBuffer = process.env.SCRAPPER_PHANTOMJS_MAX_BUFFER || 1664
  const phantom = childProcess.execFile(phantomJsPath, childArgs, {
    env: {
      URL: url,
      SCRAPPER_AUTH_COOKIE_NAME: process.env.SCRAPPER_AUTH_COOKIE_NAME,
      SCRAPPER_AUTH_COOKIE_VALUE: process.env.SCRAPPER_AUTH_COOKIE_VALUE,
      SCRAPPER_AUTH_COOKIE_DOMAIN: process.env.SCRAPPER_AUTH_COOKIE_DOMAIN
    },
    maxBuffer: (maxBuffer ? maxBuffer : 1024) * 1024 * 1024 // in megabytes
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

  return new Promise((resolve, reject) => {
        phantom.on("exit", (exitCode) => {
          if (exitCode !== 0) {
            return reject(stderr);
          }

          resolve(stdout);
        });
      }
  )
};

