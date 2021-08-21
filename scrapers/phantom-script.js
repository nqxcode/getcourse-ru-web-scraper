// scrapers/phantom-script.js

const cheerio = require("cheerio");
var system = require("system");
var env = system.env;
var page = require("webpage").create();

phantom.addCookie({
  'name'     : 'PHPSESSID5',   /* required property */
  'value'    : '8b17d40cc345bfcacd16382b1e4d1886',  /* required property */
  'domain'   : '.anatomystudy.ru',
  'path'     : '/',                /* required property */
  'httponly' : true,
  'secure'   : false,
  'expires'  : (new Date()).getTime() + (100000 * 60 * 60)   /* <-- expires in 100 hour */
});

page.settings.userAgent =
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.94 Safari/537.36";

// default viewport size is small, change it to 1366x768
page.viewportSize = {
  width: 1920,
  height: 1080
};

// open page
page.open(env.URL, function(status) {
  if (status == "success") {
    // wait until all the assets are loaded
    function checkReadyState() {
      var readyState = page.evaluate(function() {
        return document.readyState;
      });

      if (readyState == "complete") {
        var result = page.evaluate(function() {
          return document.documentElement.outerHTML;
        });

        var frameCount = page.framesCount;
        for (var i = 0; i < frameCount; ++i) {
          page.switchToFrame(i)
          result += page.frameContent
          page.switchToMainFrame()
        }

        // exit and return HTML
        system.stdout.write(result);
        phantom.exit(0);
      } else {
        setTimeout(checkReadyState, 50);
      }
    }

    checkReadyState();
  } else {
    // if status is not 'success' exit with an error
    system.stderr.write(error);
    phantom.exit(1);
  }
});

