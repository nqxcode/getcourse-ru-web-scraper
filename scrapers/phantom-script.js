// scrapers/phantom-script.js

const cheerio = require("cheerio");
var system = require("system");
var env = system.env;
var page = require("webpage").create();
var config = require("../config/config.json")

phantom.addCookie({
  'name'     : config.scrapper.phantomjs.auth.cookie.name,   /* required property */
  'value'    : config.scrapper.phantomjs.auth.cookie.value,  /* required property */
  'domain'   : config.scrapper.phantomjs.auth.cookie.domain,
  'path'     : '/',                /* required property */
  'httponly' : true,
  'secure'   : false,
  'expires'  : (new Date()).getTime() + (100000 * 60 * 60)   /* <-- expires in 100 hour */
});

page.settings.userAgent = config.scrapper.phantomjs.webpage.settings.userAgent;

// default viewport size is small, change it to 1366x768
page.viewportSize = config.scrapper.phantomjs.webpage.viewportSize;

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

