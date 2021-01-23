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
var bandName = encodeBandName("Iron Maiden")
// var queryURL = `https://tastedive.com/api/similar?q=${bandName}&k=${APIKey}`
var queryURL = 'https://api.deezer.com/search?q=eminem&output=jsonp'
// var queryURL = 'https://api.deezer.com/track/119606&output=jsonp'
// var queryURL = 'https://api.deezer.com/album/119606/tracks&output=jsonp'



$.ajax({
	url: queryURL, 
	type: "GET",
	dataType: 'jsonp',
	success: function(response){
		// var bandNameArr = parseBandNames(response); 
		// console.log(bandNameArr);
		console.log(response)
	}
})