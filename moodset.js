// function for hashing the tokens received via the url after authorization via Spotify API
function mycallback(){ 
			//Create an object to hold the tokens and other return values from the url
			var hash = {};
			//first we remove the # that is prepended in the response
			var h = location.hash.slice(1);
			//then we remove all the '&'s in the url response
			h = h.split('&');
			//Next, we iterate over all of the pairs (forEach) and put the two pieces in the hash object (i. e. hash['access_token'] = '...';)
			h.forEach(function(pair) {
    			pair = pair.split('=');
    			hash[pair.shift()] = pair.join('=');
			});
			//After that we can read the data
			if (hash.error) {
		    	console.log(hash.error);
			} else {
			    token = hash.access_token;
			    hash.token_type === "Bearer";
			    var expiry = new Date();
			    expiry.setSeconds(expiry.getSeconds() + (+hash.expires_in));
			    return hash;	
			 }
		}
//calling the above hash function when page loads
var hash = mycallback();
console.log(hash);
globals= {};

var tracks = []	;
var weatherButton = document.querySelector(".weather-button");

weatherButton.addEventListener("click",function(){
	//clear preiously executed queries
	document.querySelector(".show-playlists").innerHTML = " ";
	if((document.querySelector("#table-show-playlist").style.visibility="visible")){
		document.querySelector("#table-show-playlist").style.visibility = "hidden";
	}
	document.querySelector(".final-playlist").innerHTML = " ";
	if(document.querySelector(".final-playlist-table").style.visibility="visible"){
		document.querySelector(".final-playlist-table").style.visibility = "hidden";
		document.querySelector(".final-playlist-button").style.visibility = "hidden";
	}
	
	if(document.querySelector(".hr-after-body-weather")){
		var newHr = document.querySelector(".hr-after-body-weather");
		if (newHr.parentNode) {
  			newHr.parentNode.removeChild(newHr) ;
  			console.log("hr removed");
  			console.log("seems like i gta make a substantial change");
		}
	}
	
	//take city input
	var inputCity = document.querySelector(".city").value;
	///////////////////   GOOGLE MAPS GEOCODER API   ///////////////////////////////

	//firing HTTPS request to Google Maps Geocoding Api to retrive the co-ordinates of address being input
	var xmlhttp = new XMLHttpRequest();
	var url="https://maps.googleapis.com/maps/api/geocode/json?address="+inputCity+"&key=AIzaSyD9ezq1BBd3Ln2qo7HaR58MfdahswMzcKM";
    
    //check status of fired request
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
	        var response = JSON.parse(xmlhttp.responseText);
	        myFunction(response);
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

	
	function myFunction(response){
		//if request successfull extract longitude and latitude of location
		console.log(response);
		var lat = response.results[0].geometry.location.lat;
		var lng = response.results[0].geometry.location.lng;

		/////////////////////   FORECAST.IO API   /////////////////////////////
		
		//pass the co-ordinates(lng,lat) to forcast api to determine the weather
		//using the jsonp calling method for cross-domain GET requests
		var script = document.createElement('script');
		//fire request to forecast api and trigger callback function hoora
		script.src = "https://api.forecast.io/forecast/3946988c895d80a1dd73506cac0517f5/"+lat+","+lng+"?callback=hoora";
		document.getElementsByTagName('body')[0].appendChild(script);
	}
});

function hoora(response){
	console.log(response);
	//load icon
	var skycons = new Skycons({"color": "#5bc0de"});
	globals['iconCurrent'] = response.currently.icon;
	skycons.add(document.getElementById("icon1"), globals['iconCurrent']);
	skycons.play();

	//load icon temperature
	var temperature = Math.round((response.currently.apparentTemperature -32)/1.8);
	var iconTemp = document.querySelector(".icon-temperature");
	iconTemp.innerHTML = temperature;
	var iElement = document.createElement("i");
	iElement.className = "wi wi-celsius";
	iconTemp.appendChild(iElement);

	//load icon summary
	var summary = response.currently.summary;
	var iconSumm = document.querySelector(".icon-summary");
	iconSumm.innerHTML = " \" " +summary+ " \" ";

	
	document.querySelector("#create-button").style.visibility = "visible";
	var hr = document.createElement("hr");
	document.querySelector(".body-weather").appendChild(hr);
	hr.className = "hr-after-body-weather";

}

	////////////    	SPOTIFY DEVELOPER API  //////////////////////
var createPlaylistButton = document.querySelector('#create-button');
createPlaylistButton.addEventListener("click",function(){
	//firing search request to spotify developer api with the q parameter as playlist
	var xmlhttp = new XMLHttpRequest();
	// check the weather and input search parameter q based on that
	var query = "";
	if(globals['iconCurrent'] == "clear-day"){
		query = "summer";
	}else if(globals['iconCurrent'] == "clear-night"){
		query = "dance";
	}else if(globals['iconCurrent'] == "partly-cloudy-day"){
		query = "autumn";
	}else if (globals['iconCurrent'] == "partly-cloudy-night"){
		query = "edm";
	}else if(globals['iconCurrent'] == "cloudy"){
		query = "mellow";
	}else if(globals['iconCurrent']=="rain"){
		query = "rainy+day";
	}else if(globals['iconCurrent'] == "sleet"){
		query = "chill"
	}else if(globals['iconCurrent'] == "snow"){
		query = "happy";
	}else if(globals['iconCurrent'] == "wind"){
		query = "acoustic+afternoon";
	}else if(globals['iconCurrent'] == "fog"){
		query = "relax";
	}

	var url="https://api.spotify.com/v1/search?q=" + query + "&limit=4&type=playlist";

    
    //check status of fired request
	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
	        var response = JSON.parse(xmlhttp.responseText);
	        spotifyFunction(response);
	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
});




function spotifyFunction(response){
	console.log(response);
	var playlists = response.playlists.items;
	var showPlaylists = document.querySelector(".show-playlists");
	// showPlaylists.innerHTML = " ";
	
	playlists.forEach(function(playlist){
		var tr = document.createElement("tr");
		var newImg = new Image();
		var imgSrc = playlist.images[0].url;
		newImg.src = imgSrc;
		newImg.style.height = "100px";
		newImg.style.width = "100px";
		var playlistTitle = playlist.name;
		
		
		var newtd1 = document.createElement("td");
		newtd1.innerHTML= "#";
		tr.appendChild(newtd1);

		var newtd2 = document.createElement("td");
		newtd2.appendChild(newImg);
		tr.appendChild(newtd2);

		var newtd3 = document.createElement("td");
		newtd3.innerHTML = playlistTitle;
		newtd3.style.fontWeight = "800";
		newtd3.style.lineHeight = "7";
		tr.appendChild(newtd3);

		showPlaylists.appendChild(tr);

	});
	//displays the playlists
	document.querySelector("#table-show-playlist").style.visibility="visible";
	document.querySelector(".final-playlist-button").style.visibility = "visible";


	//collect playlist ids an array
		var playlistUrls = new Array();
		playlists.forEach(function(playlist){
			playlistUrls.push(playlist.tracks.href);
		});
		console.log(playlistUrls);
		
		if(tracks.length>0){
		console.log(tracks,"emptying");
		tracks = [];
		tracks.length = 0;
		}
		console.log(tracks,"empty");
	    
		//HTTPRequest for getting the tracks of a playlist with playlist ID
		playlistUrls.forEach(function(playlistURL){
			$.ajax({
				url: playlistURL + "?limit=10",
				headers: {
		  				'Authorization': 'Bearer ' + token,
		  		   	},
				success: function(response) {
					var playlistTracks = response.items ; 
					playlistTracks.forEach(function(track){
						tracks.push(track);
					
					});
				      console.log(tracks,"filling up with 40 tracks")	
				 }
			});
			
		}); 
				       	
}

	
					
var finalPlaylistButton = document.querySelector(".final-playlist-button");
finalPlaylistButton.addEventListener("click",makeFinalPlaylist);


//display final mashed up playlist 
function makeFinalPlaylist(){
	
	//filter tracks for promos and ads that are 60secs or less duration
	tracks = tracks.filter(function(track){
	var duration_ms = track.track.duration_ms;
		return parseInt(duration_ms)>60000 ; 
	});
	
	//sort all tracks based on popularity
	tracks.sort(function(a,b){
		return b.track.popularity-a.track.popularity;	
	});
	
	//search adjacent tracks and delete all duplicates replacing them with "undefined"
	for( var i=0; i<tracks.length-1; i++ ) {
  		if ( tracks[i].track.name == tracks[i+1].track.name ) {
    		delete tracks[i];
  		}
	}
	//filter out all tracks that aren't undefined
	tracks = tracks.filter( function( el ){ return (typeof el !== "undefined"); } );

	var newTracks = tracks.slice(0,10);
	console.log(tracks,"all filtered tracks")
	console.log(newTracks,"the chosen 10");
	
	//create final playlist elements, fill in their data and append them to the body
	for(i=0;i<newTracks.length;i++){
		var tr = document.createElement("tr");
		var numberTD = document.createElement("td");
		var playButtonTD = document.createElement("td");
		var trackNameTD = document.createElement("td");
		var trackArtistTD = document.createElement("td");
		var trackDurationTD = document.createElement("td");

		numberTD.innerHTML = i + 1;
		tr.appendChild(numberTD);

		playButtonTD.className = "glyphicon glyphicon-play";
		tr.appendChild(playButtonTD);

		trackNameTD.innerHTML = newTracks[i].track.name;
		tr.appendChild(trackNameTD);

		trackArtistTD.innerHTML = newTracks[i].track.artists[0].name;
		tr.appendChild(trackArtistTD);

		var durationInSeconds = newTracks[i].track.duration_ms/1000;
		var totalDuration = secondsToTime(durationInSeconds);
		trackDurationTD.innerHTML = totalDuration['m'] + ":" + totalDuration['s'];
		tr.appendChild(trackDurationTD);

		var finalPlaylist = document.querySelector(".final-playlist");
		finalPlaylist.appendChild(tr);
		
		document.querySelector(".final-playlist-table").style.visibility = "visible";

	}

}

function secondsToTime(secs){
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
   
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}
