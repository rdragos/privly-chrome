/**
 * @fileOverview This file opens a tab with the first run html doc under
 * appropriate conditions when the extension is loaded on browser launch or
 * on extension install.
 *
 * Appropriate conditions fall under two circumstances:
 * 1. LocalStorage does not have a stored value for the version of privly
 *    installed. (Privly was just installed or localStorage was cleared)
 * 2. The version stored in the manifest differs from the version stored in
 *    localStorage. (Privly was updated)
 *
 **/

/**
 * @namespace for the firstRun functionality.
 */
var firstRun = {
  /**
   * Get version stored in the manifest
   */
  getPrivlyVersion: function() {
    var details = chrome.app.getDetails();
    return details.version;
  },

  /**
   * Get version stored in localStorage
   */
  getStoredVersion: function() {
    var stored_version = localStorage["version"];
    return stored_version;
  },

  /**
   * Update localStorage version
   */
  updateVersion: function(version) {
    localStorage["version"] = version;
  },

  /**
   * Open a window with the local first_run.html and ensures the localStorage
   * variables are assigned.
   */
  firstRun: function() {

    var postingDomain = localStorage["posting_content_server_url"];
    if (postingDomain === undefined || postingDomain === null) {
      localStorage["posting_content_server_url"] = "https://privlyalpha.org";
    }

    var page = chrome.extension.getURL("privly-applications/Pages/ChromeFirstRun.html");
    chrome.windows.create({url: page, focused: true,
                           width: 1100,
                           top: 0, left: 0, type: "popup"},
                           function(newWindow){});
    return "Done";
  },

  /**
   * Check whether the first run html page should be opened.
   */
  runFirstRun: function() {

    // Initialize the spoofing glyph
    // The generated string is not cryptographically secure and should not be used
    // for anything other than the glyph.
    if (localStorage["glyph_cells"] === undefined) {
      localStorage["glyph_color"] = Math.floor(Math.random()*16777215).toString(16);

      var glyph_cells = ((Math.random() < 0.5) ? "false" : "true");
      for(i = 0; i < 14; i++) {
        glyph_cells += "," + ((Math.random() < 0.5) ? "false" : "true");
      }
      localStorage["glyph_cells"] = glyph_cells;
    }

    var runningVersion = firstRun.getPrivlyVersion();
    var lastRunVersion = firstRun.getStoredVersion();

    if (lastRunVersion === null || runningVersion !== lastRunVersion ) {
      firstRun.firstRun();
      firstRun.updateVersion(runningVersion);
    }
  }
}

// Run this script
firstRun.runFirstRun();
