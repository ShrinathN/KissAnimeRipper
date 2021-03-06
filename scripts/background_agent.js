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

function endGame() {
  chrome.storage.local.get(["downloadLinkList", "anime_name"],
  d = function(result) {
    var anime_name = result.anime_name;
    //replacing all the unwanted character names in the file name
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
    <tr><td>Display</td>
    <td>
    <button id="button_all">Show all</button>
    <button id="button_download_txt">Download as .txt</button>
    <button id="button_download_m3u">Download as .m3u</button>
    </td></tr>
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
    //adding all the download links
    finalStr = finalStr.concat("var listOfLinks = [];\n");
    for (var i = 0; i < downloadLinkList.length; i++) {
      finalStr = finalStr.concat("listOfLinks[" + i + "] = \"" + downloadLinkList[i] + "\";\n");
    }
    //adding the anime name
    finalStr = finalStr.concat('var anime_name = "' + anime_name + '";\n');

    //list of sorting functions
    finalStr = finalStr.concat(`
      //defining all the UI elements
      var download_status_label = document.getElementById("download_status_label");
      var button_all = document.getElementById("button_all");
      var button_download_txt = document.getElementById("button_download_txt");
      var button_download_m3u = document.getElementById("button_download_m3u");
      var downloadTimeDelay = document.getElementById("downloadTimeDelay");
      var starting_episode_input = document.getElementById("starting_episode_input");
      var ending_episode_input = document.getElementById("ending_episode_input");

      //start and stop buttons for downloads
      var button_start_download = document.getElementById("button_start_download");
      var button_stop = document.getElementById("button_stop");

      //initializing the div area with all the download links
      var div_area = document.getElementById("div_area");
      div_area.innerHTML = "";
      for(var i = 0; i < listOfLinks.length; i++) {
      	div_area.innerHTML += "<a href=\\"" + listOfLinks[i] + "\\">" + listOfLinks[i] + "</a><br>";
      }
      div_area.hidden = true;

      //this is the button that say Show all or Hide all, basically is used to toggle the list of links
      button_all.onclick = function() {
      	if(div_area.hidden == true) {
      		button_all.innerHTML = "Hide all";
      		div_area.hidden = false;
      	} else {
      		button_all.innerHTML = "Show all";
      		div_area.hidden = true;
      	}
      };

      //this is the button that will let you download the list as a single .txt file with a link in every line
      //separated by CR LF so that windows users are not alienated :D
      button_download_txt.onclick = function() {
        var file_data = "";
        for(var i = 0; i < listOfLinks.length; i++) {
          file_data += listOfLinks[i] + "\\r\\n";
        }
        var file = new Blob([file_data], {type: "text/plain"});
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = anime_name;
        a.click();
      };

      button_download_m3u.onclick = function() {
        var file_data = "#EXTM3U\\r\\n";
        for(var i = 0; i < listOfLinks.length; i++) {
          file_data += "#EXTINF:0," + anime_name + " - " + String(i) + "\\r\\n";
          file_data += listOfLinks[i] + "\\r\\n";
        }
        var file = new Blob([file_data], {type: "audio/x-mpequrl"});
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = anime_name + ".m3u";
        a.click();
      };

      var temp_download_a = document.createElement("a");
      var globalCounter = 0;
      var downloadEnabled = false;
      var startingEpisode;
      var endingEpisode;

      function getStartingEndingEpisode() {
        startingEpisode = (starting_episode_input.value == "")?0:((Number(starting_episode_input.value))-1);
        endingEpisode = (ending_episode_input.value == "")?listOfLinks.length:(Number(ending_episode_input.value));
      }

      function iterateAndDownload() {
        if((listOfLinks[globalCounter] != undefined) && (downloadEnabled) && (globalCounter < endingEpisode)){
          var delay = Number(downloadTimeDelay.value);
          temp_download_a.href = listOfLinks[globalCounter];
          temp_download_a.click();
          globalCounter++;
          download_status_label.innerHTML = "Downloading " +  globalCounter + " of " + listOfLinks.length;
          window.setTimeout(iterateAndDownload, (1000 * delay));
        } else {
          download_status_label.innerHTML = "Done";
          button_start_download.disabled = false;
          button_stop.disabled = true;
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
        button_stop.disabled = true;
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
        chrome.storage.local.get("quality", function(result) {
          quality = result.quality;
          // console.log("QUALITY->" + quality);
        });
        sendMessageToTab("yesCanRun", quality);
        console.log("Run request -> granted");
      } else { //sends noCannotRun message if false
        sendMessageToTab("noCannotRun", null);
        // console.log("Run request -> denied");
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
  } else if (request.todo == "storeAnimeName") {
    var anime_name = request.data;
    chrome.storage.local.set({
      anime_name : anime_name
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
