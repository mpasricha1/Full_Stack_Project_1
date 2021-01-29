var APIKey = '400264-project1-2ZU40HSL'
var unencodedBandName = ''

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
}

function generateRandomNumber(response){
	return Math.floor(Math.random() * response.data.length);

}

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
}

function getArtistTrackList(bandNameArr){
	bandNameArr.forEach(bandname =>{
		var queryURL = `https://api.deezer.com/search?q=${bandname}&output=jsonp`; 
		$.ajax({
			url: queryURL,
			type: "GET", 
			dataType: 'jsonp', 
			success: function(response){
				var albumNumber = generateRandomNumber(response)
				var artistObj = {
					artistId: response.data[albumNumber].artist.id,
					albumId: response.data[albumNumber].album.id, 
					name: response.data[albumNumber].artist.name, 
					albumPicture: response.data[albumNumber].album.cover_small,
					tracklist: response.data[albumNumber].album.tracklist, 

				}
				getTrack(artistObj);
			},
		})
	})
}

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

			console.log(artistObj);

			addToMixTape(artistObj);
			
		}
	})
}

function addToMixTape(artistObj){
	var container = $("#mixTapeList"); 
	var songCount = 1;

	var row = $("<div>").attr({"class": "row"})
	var imgCol = $("<div>").attr({"class": "four"})
	var textCol = $("<div>").attr({"class": "eight"})

	var albumImg = $("<img>").attr({"src":artistObj.albumPicture})
	var albumArtist = $("<p>").html(`Artist: ${artistObj.name}`)
	var albumSong = $("<p>").html(`Album: ${artistObj.track}`)
	var songLink = $("<audio>").attr({"src": artistObj.preview, "id": `song${songCount}`})
	var songButton = $("<button>").attr({"class":"playsong", "id":songCount})

	imgCol.append(albumImg); 
	textCol.append(albumArtist,albumSong, songLink, songButton);


	row.append(imgCol, textCol)
	container.append(row)
	songCount++;

}

$("#searchBtn").on("click", function(event){
	unencodedBandName = $("#searchParameter").val();
	var bandName = encodeBandName(unencodedBandName);
	generateSimilarBandList(bandName);
})

$(document).on("click", ".playsong", function(){
	var songId = $(this)[0].id
	console.log(songId)
	var song = $(`#song${songId}`)
	console.log(song)
	song[0].play();
	
});