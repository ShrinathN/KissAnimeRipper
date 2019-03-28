



function ripLink() {
  var listing = document.getElementsByClassName("listing")[0].childNodes[1]; //this is the table with the link to episode pages
  if (listing == undefined) { //probably means page hasn't finished loading
    window.setTimeout(ripLink, 1000); //execute itself again 1 second later
    return; //exit
  }
  var downloadLink = []; //setting download link as empty array
  var counter; //this will keep act as a counter for all the green download buttons
  for(counter = 4; counter < listing.length; counter += 2)
  {
    downloadLink.push(listing.childNodes[4].childNodes[1].childNodes[1].href);
  }
  alert(downloadLink);
}
