# KissAnimeRipper
A chrome extension to automate obtaining video file download links from kissanime-rapidvideo

## How does this work?
It automates the process of going to kissanime, opening every single episode, and clicking on the download button to download the episodes one-by-one.
Instead, you can just let the extension do it for you.

## Isn't this bad because web scraping?
* Not really, you still visit the pages so its not scraping, the website still gets their deserved ad revenue because of the visits.
* Its basically your browser visiting the pages instead of you.

## Installation

This project is a chrome extension so it should work on Linux, Windows, and OSX all the same.

1. Clone this repo using one of the methods below

	1. **(RECOMMENDED)** Use this link to download the zip file, and unzip it.
  **[CLICK HERE TO DOWNLOAD](https://github.com/ShrinathN/KissAnimeRipper/archive/master.zip)**

	2. Second way to do this, use the below command if you're familiar with the use of a terminal, and have git installed, this is the command.

```
git clone http://github.com/ShrinathN/KissAnimeRipper
```

2. Open Chrome and browse to your extensions page. Just copy paste this (**chrome://extensions/**) in the URL bar if you don't know how to do that.

3. On the right upper corner there should be a switch saying _**"Developer mode"**_, turn that switch on.

4. Three new buttons should pop up in the left upper corner, the leftmost should say _**"Load unpacked"**_, click on it.

5. A folder selection prompt should open, browse to and select the folder which was created when you extracted the zip file.

That's it, the extension should be installed now.

## Usage :

Make sure you're **not** using any ad blockers or JavaScript blockers, or this extension might not work. If you are, please disable them when you're using this plugin.

1. Browse to the main page of an anime on kissanime.ru. The main page is where all the episodes of an anime are listed. The URL should be something like http://kissanime.ru/Anime/ANIMENAME

![Extension Image](https://raw.githubusercontent.com/ShrinathN/KissAnimeRipper/master/img/image_plugin.png)

2. Click on the extension, a simple popup with two buttons and a few options should open. Select your desired quality, and press the start button.

3. Your browser should begin visiting different pages now, do not be alarmed, this is normal. Sit back for a minute or two, do not browse any other page or click on any links or buttons or change the tab.

![Results Page](https://raw.githubusercontent.com/ShrinathN/KissAnimeRipper/master/img/image_results_page.png)

4. You will be presented with the above page.
	* Clicking on **ALL** will display all the links.
	* The __time__ field is the time difference between two consequent downloads. Set this according to your download speed. Try not to strain their servers by consequent downloads.
	* **Starting** and **ending** episode fields are self explanatory.
	* **Start** and **Stop** buttons start and stop the downloading process respectively.