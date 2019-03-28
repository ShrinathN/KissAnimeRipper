chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.todo == "yesCanRun") {
    obtainLinkToRapidVideoFile();
  }
});

function obtainLinkToRapidVideoFile() {
  if (document.getElementById("divDownload") != null) {
    var rapidVideoFileLink = document.getElementById("divDownload").childNodes[2];
    window.location.href = rapidVideoFileLink.href;
  } else {
    window.setTimeout(obtainLinkToRapidVideoFile, 500);
  }
}

chrome.runtime.sendMessage({
  todo: "canIRun"
});



//document.getElementById("divDownload").childNodes[2].href
