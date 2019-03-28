/**
* @file popup.js
* @brief This file deals with all the methods and operations which are related to popup.html, aka the UI part of the extension
* @author Shrinath Nimare
* @date Thu Mar 28 10:12:17 IST 2019
*/

var status_label = document.getElementById("status_label");
var button_start = document.getElementById("button_start");
var button_stop = document.getElementById("button_stop");

status_label.innerHTML = "Not Running";

var isRunning;

/**
* This function will check every second if the boolean isRunning variable is still true, if not, it will run the stopping function
* @author Shrinath Nimare
* @param nil
* @date Thu Mar 28 10:12:17 IST 2019
*/
function checkIfStillRunning()
{
  chrome.storage.local.get("isRunning", function(result){
    if(result.isRunning == false) {
      button_stop.onclick();
    }
    else {
      window.setTimeout(checkIfStillRunning, 1000);
    }
  });
}

/**
* This function will start the ripping process
* @author Shrinath Nimare
* @param nil
* @date Thu Mar 28 10:12:17 IST 2019
*/
button_start.onclick = function() {
  status_label.innerHTML = "Running...";
  button_start.disabled = true;
  button_stop.disabled = false;

  chrome.storage.local.set({
    isRunning : true
  });

  var downloadLinkList = [];
  chrome.storage.local.set({
    downloadLinkList: downloadLinkList
  }); //setting empty array as dowloadLinkList
  chrome.tabs.query({ //to run the script
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id, {
        file: "scripts/episode_list_page.js"
      });
  });
  window.setTimeout(checkIfStillRunning, 1000);
}

/**
* This function will stop the ripping process
* @author Shrinath Nimare
* @param nil
* @date Thu Mar 28 10:12:17 IST 2019
*/
button_stop.onclick = function() {
  status_label.innerHTML = "Not Running";
  button_start.disabled = false;
  button_stop.disabled = true;
}


/*
,

"background": {
  "scripts": ["scripts/background_agent.js"],
  "persistent": false
},

"content_scripts": [{
    "matches": [""],
    "run_at": "document_idle",
    "js": ["scripts/"]
  },
  {
    "matches": [""],
    "run_at": "document_end",
    "js": ["scripts/"]
  }
]
*/
