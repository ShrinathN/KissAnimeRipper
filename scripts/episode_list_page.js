var episodes_page_link_list = []; //setting download link as empty array
var temp_anime_name = "";

function ripLink() {
  var listing = document.getElementsByClassName("listing")[0].childNodes[1]; //this is the table with the link to episode pages
  if (listing == undefined) { //probably means page hasn't finished loading
    window.setTimeout(ripLink, 1000); //execute itself again 1 second later
    return; //exit
  }
  var counter; //this will keep act as a counter for all the episode page links
  for(counter = 4; counter < listing.childElementCount*2; counter += 2)
  {
    episodes_page_link_list.push(listing.childNodes[counter].childNodes[1].childNodes[1].href + "&s=rapidvideo");
  }

  //storing the anime name for playlist and direct txt file download
  temp_anime_name = document.getElementsByClassName("bigChar")[0].innerText;
}

ripLink();

chrome.runtime.sendMessage({
  todo: "storeEpisodeList",
  data: episodes_page_link_list
});

chrome.runtime.sendMessage({
  todo: "storeAnimeName",
  data: temp_anime_name
});

chrome.runtime.sendMessage({
  todo: "whatIsNextPage"
});

window.location.href = episodes_page_link_list.pop();
