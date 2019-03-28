
var button_start = document.getElementById("button_start");
var button_stop = document.getElementById("button_stop");

button_start.onclick = function(){
  alert("Button clicked");
};


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
