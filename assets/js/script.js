var APIKey = '400264-project1-2ZU40HSL'
var unencodedBandName = "Chuck Ragan"
var bandName = encodeBandName(unencodedBandName)

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

function generateSimilarBandList(){
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
	var container = $(".container") 

	var row = ($("<div>")).attr({"class": "row"})
	row.append($("<h1>")).text(artistObj.name)

	container.append(row)

}

generateSimilarBandList();
