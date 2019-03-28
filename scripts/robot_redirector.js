chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.todo == "yesCanRun") {
    if(document.getElementsByClassName("specialButton")[0] != null) {
      var specialButton = document.getElementsByClassName("specialButton")[0];
      window.location.href = specialButton.href;
    }
  }
});

chrome.runtime.sendMessage({
  todo : "canIRun"
});
