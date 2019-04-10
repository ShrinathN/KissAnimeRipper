//this script keeps running in the background of every page
//it responds to messages from other content scripts for pages

var episodeList; //stores the episodeList from storage
var quality; //stores the selected quality by the user
//this function takes in two arguments and send them as a message
function sendMessageToTab(todo, data) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      todo: todo,
      data: data
    });
  });
}

chrome.storage.local.get("quality", function(result) {
  quality = result.quality;
  console.log("QUALITY->" + quality);
});

function endGame() {
  chrome.storage.local.get("downloadLinkList", function(result) {
    var downloadLinkList = result.downloadLinkList;
    var finalStr =
      `
    <!DOCTYPE HTML>
    <html>
    <head>
    <title>Kissanime ripper</title>
    <style>body{background-image:linear-gradient(lightblue,white);}
    button{background-color:#c9f2fc;height:30px;width: 150px;}
    button:hover{background-color:#7ae0f9}
    button:disabled:hover{background-color: #969494}
    tr:hover{background-color:#7ae0f9}
</style>
    </head>
    <body>
    <table border="1">
    <tr><th><h1>Status</h1></th><th><h1 id="download_status_label"></h1></th></tr>
    <tr><td>Display</td><td><button id="button_all">ALL</button></td></tr>
    <tr><td>Time (in sec)</td><td><input type="number" id="downloadTimeDelay"></td></tr>
    <tr><td>Download Options</td>
    <td>
      Starting Episode<input type="number" id="starting_episode_input"><br>
      Ending Episode<input type="number" id="ending_episode_input"><br>
      <button id="button_start_download">Start Download</button><br>
      <button id="button_stop">Stop Download</button>
    </td></tr></table>
    <div id="div_area"></div>
    </body>
    <script>
    `;

    finalStr = finalStr.concat("var listOfLinks = [];");
    for (var i = 0; i < downloadLinkList.length; i++) {
      finalStr = finalStr.concat("listOfLinks[" + i + "] = \"" + downloadLinkList[i] + "\";\n");
    }

    //list of sorting functions
    finalStr = finalStr.concat(`
      var download_status_label = document.getElementById("download_status_label");
      var button_all = document.getElementById("button_all");
      var downloadTimeDelay = document.getElementById("downloadTimeDelay");
      var starting_episode_input = document.getElementById("starting_episode_input");
      var ending_episode_input = document.getElementById("ending_episode_input");

      var button_start_download = document.getElementById("button_start_download");
      var button_stop = document.getElementById("button_stop");

      button_all.onclick = function() {
        var div_area = document.getElementById("div_area");
        div_area.innerHTML = "";
        for(var i = 0; i < listOfLinks.length; i++) {
          div_area.innerHTML += "<a href=\\"" + listOfLinks[i] + "\\">" + listOfLinks[i] + "</a><br>";
        }
      };

      var temp_download_a = document.createElement("a");
      var globalCounter = 0;
      var downloadEnabled = false;
      var startingEpisode;
      var endingEpisode;

      function getStartingEndingEpisode() {
        startingEpisode = (starting_episode_input.value != undefined)?((Number(starting_episode_input.value))-1):0;
        endingEpisode = (ending_episode_input.value != undefined)?(Number(ending_episode_input.value)):listOfLinks.length;
      }

      function iterateAndDownload() {
        if((listOfLinks[globalCounter] != undefined) && (downloadEnabled) && (globalCounter < endingEpisode)){
          var delay = Number(downloadTimeDelay.value);
          temp_download_a.href = listOfLinks[globalCounter];
          temp_download_a.click();
          globalCounter++;
          download_status_label.innerHTML = "Downloading " +  globalCounter + " of " + listOfLinks.length;
          window.setTimeout(iterateAndDownload, (1000*delay));
        } else {
          download_status_label.innerHTML = "Done";
        }
      }

      button_start_download.onclick = function() {
        getStartingEndingEpisode();
        globalCounter = startingEpisode;
        downloadEnabled = true;
        button_stop.disabled = false;
        button_start_download.disabled = true;
        iterateAndDownload();
      }

      button_stop.onclick = function() {
        download_status_label.innerHTML = "Stopped";
        downloadEnabled = false;
        button_start_download.disabled = false;
      }

      button_stop.disabled = true;
      download_status_label.innerHTML = "Not Downloading";
      </script>
      </html>
      `);
    sendMessageToTab("writeData", finalStr); //sending page data to script
    sendMessageToTab("globalStopMessage", null); //stop message
  });
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.todo == "storeEpisodeList") { //the main episode list is being received as data. Sent by episode_list.js
    episodeList = request.data;
    // episodeList.pop(); //first one has already been visited, dropping
    chrome.storage.local.set({
      episodeList: episodeList
    }); //storing data
  } else if (request.todo == "whatIsNextPage") { //if a script is requesting the next page to go to
    chrome.storage.local.get("episodeList", function(data) { //this is to get the epsiode list from the storage
      episodeList = data.episodeList;
      var nextPage = episodeList.pop(); //setting the variable nextPage as the topmost element in the episodeList stack
      if (nextPage == undefined) { //meaning all have been gone over, process ends here, we can display all the links
        chrome.storage.local.set({
          isRunning: false
        }); //setting isRunning as false
        endGame();
      } else { //meaning this was not the last element in the list, we must continue
        chrome.storage.local.set({
          episodeList: episodeList
        }); //saving the new episodeList with the topmost element removed
        sendMessageToTab("goToPage", nextPage); //sending message to script to goto the nextPage
      }
    });
  } else if (request.todo == "canIRun") { //if a script is asking "canIRun" ?
    chrome.storage.local.get("isRunning", function(result) { //gets isRunning status
      if (result.isRunning) { //sends yesCanRun message if true
        sendMessageToTab("yesCanRun", quality);
        console.log("Run request -> granted");
      } else { //sends noCannotRun message if false
        sendMessageToTab("noCannotRun", null);
        console.log("Run request -> denied");
      }
    });
  } else if (request.todo == "addDownloadLink") { //appends download link from the download_page
    var linkToAdd = request.data; //this is the download link(s)
    chrome.storage.local.get("downloadLinkList", function(result) { //gets currently stored list
      var downloadLinkList = result.downloadLinkList;
      chrome.storage.local.set({
        downloadLinkList: downloadLinkList.concat(linkToAdd)
      }); //saves link(s) data
    });
  }
});



/*
===LIST OF REQUESTS===

storeEpisodeList
whatIsNextPage -=-=-=-=- goToPage
canIRun -=-=-= yesCanRun
            -= noCannotRun
addDownloadLink
writeData
globalStopMessage

===LIST OF REQUESTS===
*/
