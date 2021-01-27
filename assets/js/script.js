var APIKey = '400264-project1-2ZU40HSL';
var unencodedBandName = ""

$('#searchBtn').on("click",function(){
	unencodedBandName = $('#searchParameter').val()
	console.log(unencodedBandName)
	var name=codeBandName(unencodedBandName)
	console.log(name)
	generateSimBandList(name)
});

function generateSimBandList(name){
	var queryURL = `https://tastedive.com/api/similar?q=${name}&k=${APIKey}`
	$.ajax({
		url:queryURL,
		type:'GET',
		dataType:'JSONP',
		success:function(response){
			console.log(response)
			var bandNameArr = []
			bandNameArr.push(unencodedBandName);
			response.Similar.Results.forEach(band =>{
				bandNameArr.push(band.Name)
			})
			console.log(bandNameArr);
			getArtistTrackList(bandNameArr);
		}
	})
};

function codeBandName(name){
	return name.replace(/ /g,"+");
};

function generateRandomNumber(response){
return Math.floor(Math.random() * response.data.length);
}

function getArtistTrackList(bandNameArr){
	bandNameArr.forEach(bandname=>{
		var queryURL = `https://api.deezer.com/search?q=${bandname}&output=jsonp`;
		$.ajax({
			url:queryURL,
			type:'GET',
			dataType:'JSONP',
			success:function(response){
				// console.log(response)
				var AlbumNumber = generateRandomNumber(response)
				var ArtistObj = {
					artistId:response.data[AlbumNumber].artist.id,
					albumId:response.data[AlbumNumber].album.id,
					artistName:response.data[AlbumNumber].artist.name,
					albumPicture:response.data[AlbumNumber].album.cover_small,
					albumName:response.data[AlbumNumber].title,
					tracklist:response.data[AlbumNumber].album.tracklist,
				}
				getTrack(ArtistObj);
			}
		})
	})
};

function getTrack(ArtistObj){
	var queryURL = `${ArtistObj.tracklist}&output=jsonp`;
	$.ajax({
		url:queryURL,
		type:"GET",
		dataType:'JSONP',
		success:function(response){
			// console.log(response);
			var trackNum = generateRandomNumber(response);
			ArtistObj.track = response.data[trackNum].title;
			ArtistObj.preview = response.data[trackNum].preview;

			console.log(ArtistObj);
		}
	})
}