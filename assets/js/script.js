var APIKey = '400264-project1-2ZU40HSL'

function encodeBandName(band){
	return band.replace(/ /g,"+");
};

function parseBandNames(response){
	var bandArr = [];
	response.Similar.Results.forEach(band => {
		bandArr.push(band.Name);
	}); 

	return bandArr;
}

function generateRandomNumber(response){
	return Math.floor(Math.random() * response.data.length);

}
var bandName = encodeBandName("Iron Maiden")


// var queryURL = 'https://api.deezer.com/track/119606&output=jsonp'
// var queryURL = 'https://api.deezer.com/album/119606/tracks&output=jsonp'

function generateSimilarBandList(){
	var queryURL = `https://tastedive.com/api/similar?q=${bandName}&k=${APIKey}`

	$.ajax({
		url: queryURL, 
		type: "GET",
		dataType: 'jsonp',
		success: function(response){
			var bandNameArr = parseBandNames(response);
			getArtistTrackList(bandNameArr);
		}
	}); 
}

function getArtistTrackList(bandNameArr){
	artistObjArr = []; 
	bandNameArr.forEach(bandname => {
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
				artistObjArr.push(artistObj);
				getTrack(artistObjArr);
			}
		})
	})
}

function getTrack(artistObjArr){
	artistObjArr.forEach(artist => {
		console.log(artist)
		var queryURL = artist.tracklist;
		console.log(queryURL);
		$.ajax({
			url: queryURL, 
			type: "GET",
			dataType: 'jsonp', 
			success: function(response){
				console.log(response);
			}
		})
	})

}

generateSimilarBandList();
