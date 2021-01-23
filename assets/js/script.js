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
var bandName = encodeBandName("the doors")
var queryURL = `https://tastedive.com/api/similar?q=${bandName}&k=400264-project1-2ZU40HSL`

$.ajax({
	url: queryURL, 
	type: "GET",
	dataType: 'jsonp',
	success: function(response){
		var bandNameArr = parseBandNames(response); 
		console.log(bandNameArr);
	}
})