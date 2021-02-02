// Various global functions used throughout the page
var APIKey = '400264-project1-2ZU40HSL';
var unencodedBandName = '';
var playlistName = '';
var songArr = [];
var songIndex = 0;
var savedPlaylist =[];
var songToPlay = '';
var trackCounter = 0; 

//*****************************************************************************
// Helper functions for various tasks for the api calls
function encodeBandName(band){
	return band.replace(/ /g,"+");
};

function parseBandNames(response){
	var bandArr = [];
	bandArr.push(unencodedBandName);
	response.Similar.Results.forEach(band => {
		bandArr.push(band.Name);
	}); 
	return bandArr;
};

function generateRandomNumber(response){
	return Math.floor(Math.random() * response.data.length);
};

//*****************************************************************************

//*****************************************************************************
// Thee API call functions 
function generateSimilarBandList(bandName){
	var queryURL = `https://tastedive.com/api/similar?q=${bandName}&k=${APIKey}`
	$.ajax({
		url: queryURL, 
		type: "GET",
		dataType: 'jsonp',
		success: function(response){
			var bandNameArr = parseBandNames(response);
			console.log(bandNameArr);
			getArtistTrackList(bandNameArr);
		}
	}); 
};

function getArtistTrackList(bandNameArr){
	bandNameArr.forEach(bandname =>{
		var queryURL = `https://api.deezer.com/search?q=${bandname}&output=jsonp`; 
		$.ajax({
			url: queryURL,
			type: "GET", 
			dataType: 'jsonp', 
			success: function(response){
				console.log(response)
				var albumNumber = generateRandomNumber(response)
				var artistObj = {
					artistId: response.data[albumNumber].artist.id,
					albumId: response.data[albumNumber].album.id, 
					name: response.data[albumNumber].artist.name, 
					albumPicture: response.data[albumNumber].album.cover_small,
					tracklist: response.data[albumNumber].album.tracklist, 
					albumName: response.data[albumNumber].album.title

				}
				getTrack(artistObj);
			},
		});
	});
};

function getTrack(artistObj){
	var queryURL = `${artistObj.tracklist}&output=jsonp`;
	$.ajax({
		url: queryURL, 
		type: "GET",
		dataType: 'jsonp', 
		success: function(response){
			var trackNum = generateRandomNumber(response);
			artistObj.track = response.data[trackNum].title;
			artistObj.preview = response.data[trackNum].preview; 

			addToMixTape(artistObj, false);
		}
	});
};
//**************************************************************************
// These functions deal with dynamic content on the page
function addToMixTape(artistObj, dontAppend){
	if(trackCounter < 10){
		var container = $("#mixTapeList"); 

		var row = $("<div>").attr({"class": "row"});
		var imgCol = $("<div>").attr({"class": "one column"});
		var trackTitle = $("<div>").attr({"class": "three columns"});
		var artistName = $("<div>").attr({"class": "three columns"});
		var albumName = $("<div>").attr({"class": "three columns"});
		var albumImg = $("<img>").attr({"src":artistObj.albumPicture, "id": "albumImg"});
		//var albumImg = $("<img>").attr({"src":artistObj.albumPicture});
		var albumArtist = $("<p>").html(artistObj.name);
		var albumSong = $("<p>").html(artistObj.track);
		var albumName = $("<p>").html(artistObj.albumName);

		imgCol.append(albumImg); 
		trackTitle.append(albumSong);
		artistName.append(albumArtist);

		row.append(imgCol, trackTitle, artistName, albumName);
		container.append(row);
		trackCounter++;

		if(dontAppend === true){
			return;
		}else{
			addTosavedPlaylist(artistObj);
		}
	}else{
		return;
	}	
};

function addTosavedPlaylist(artistObj){
	if (localStorage.getItem(`${playlistName}`) === null){
		savedPlaylist.push(artistObj);
		localStorage.setItem(playlistName, JSON.stringify(savedPlaylist));
	}
	else{
		savedPlaylist = JSON.parse(localStorage.getItem(playlistName))
		savedPlaylist.push(artistObj);
		localStorage.setItem(playlistName, JSON.stringify(savedPlaylist));
    }

}
function getSavedPlaylist(playlistName){
    savedPlaylist = JSON.parse(localStorage.getItem(playlistName));
    savedPlaylist.forEach(artist => {
    addToMixTape(artist, true);
    })
}
function displaySavedPlaylists() {
    var prevContainer = $('#prevContainer');
    var previousPlaylists = $('<input>').attr({'type':'button', 'value':playlistName, 'class': 'previousList'});
    prevContainer.prepend(previousPlaylists); 

}
//*****************************************************************************

//*****************************************************************************
// Functions for the audio player
function getCurrentSong(){
	songArr = JSON.parse(localStorage.getItem(playlistName)); 
	currentSong = songArr[songIndex]; 
	console.log(currentSong);

	return currentSong;
}

function playSong(){
	var currentSong = $("#song");
	var albumImage = $("#albumimage");

	songToPlay = getCurrentSong();

	currentSong.attr({"src":songToPlay.preview});
	albumImage.attr({"src":songToPlay.albumPicture});
	albumImage.removeAttr("hidden");

	$("#currentsong").text(songToPlay.track);
	$("#currentartist").text(songToPlay.name); 
	$("#currentalbum").text(songToPlay.albumName);

	currentSong[0].play();		
}

function stopSong(){
	var currentSong = $("#song");
	currentSong[0].pause();
}

function nextSong(){
	if(songIndex === songArr.length-1){
		songIndex = 0;
	}else{
		songIndex++; 
	}
	playSong(); 
}

function prevSong(){
	if(songIndex === 0){
		songIndex = songArr.length-1;
	}else{
		songIndex--; 
	} 
	playSong();
}
//******************************************************************************

//******************************************************************************
// Function to reset global variabled used throughout the page
function clearGlobals(){
	$("#mixTapeList").empty();
    songArr = [];
    savedPlaylist = [];
    songIndex = 0;
    trackCounter = 0;
}
//******************************************************************************

//******************************************************************************
// Functions for button click events to search the page and change saved playlists 
function searchForArtist(){
	event.preventDefault();
	clearGlobals();
	// stopSong();

	unencodedBandName = $("#searchParameter").val();
	playlistName = $("#userMixTapeName").val(); 
	var bandName = encodeBandName(unencodedBandName);

    generateSimilarBandList(bandName);
    displaySavedPlaylists();

    $("#searchParameter").val("");
    $("#userMixTapeName").val("");
}

function nextSongAfterEnd(){
	if(songIndex < songArr.length){
		setTimeout(function(){
			songIndex++;
			playSong();
		},1000);	
	}else{
		songIndex = 0;
		playSong();
	}	
};

function switchPlaylist(){
	playlistName = $(this).val();
  
    clearGlobals();
    // stopSong();
    getSavedPlaylist(playlistName);
};
//**************************************************************************

//**************************************************************************
// Button click events 
$("#searchBtn").on("click", searchForArtist)
$("#prev").on("click", prevSong);
$("#play").on("click", playSong);
$("#stop").on("click", stopSong);
$("#next").on("click", nextSong);
$("#song").on("ended", nextSongAfterEnd)
$(document).on("click", ".previousList", switchPlaylist)
//***************************************************************************