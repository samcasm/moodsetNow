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
	
	if(document.querySelector('.icon-temperature').innerHTML===""){
		//spinner.js
		var opts = {
			  lines: 11 // The number of lines to draw
			, length: 25 // The length of each line
			, width: 8 // The line thickness
			, radius: 30 // The radius of the inner circle
			, scale: 0.5 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0.3 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 1 // Rounds per second
			, trail: 60 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '50%' // Top position relative to parent
			, left: '50%' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
		}
	
		var target = document.querySelector('.spinner-div-1');
		globals['spinner'] = new Spinner(opts).spin(target);
		console.log(globals['spinner']);
	
	}
	
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
	globals['iconCurrent'] = response.currently.icon;
	
	// //load background
	// var newbg = "";
	// if(globals['iconCurrent'] == "clear-day"){
	// 	newbg = "http://www.bullshift.net/data/images/2013/11/al-59840.jpg";
	// }else if(globals['iconCurrent'] == "clear-night"){
	// 	newbg = "http://imgview.info/download/20150712/manhattan-city-new-york-light-river-night-clear-sky-hd-wallpaper-1920x1200.jpg";
	// }else if(globals['iconCurrent'] == "partly-cloudy-day"){
	// 	newbg = "http://eskipaper.com/images/cloudy-sky-9.jpg";
	// }else if (globals['iconCurrent'] == "partly-cloudy-night"){
	// 	newbg = "http://wallpaperbeta.com/wallpaper_3840x2160/storm_field_spikelets_cloudy_landscapes_ultra_3840x2160_hd-wallpaper-149115.jpg";
	// }else if(globals['iconCurrent'] == "cloudy"){
	// 	newbg = "http://www.thecitypictures.net/wp-content/uploads/cloudy-shanghai-skyline.jpg";
	// }else if(globals['iconCurrent']=="rain"){
	// 	newbg="http://www.hd-wallpapers9.com/Thumbnail-Gallery/Natural/Rain%20Wallpapers/Rain%20Wallpapers003.jpg";
	// }else if(globals['iconCurrent'] == "sleet"){
	// 	newbg = "http://cdn1.theodysseyonline.com/files/2016/01/21/6358899960068147322127282582_635861833670816810507191518_6670-perfect-snow-1920x1080-nature-wallpaper.jpg"
	// }else if(globals['iconCurrent'] == "snow"){
	// 	newbg = "http://www.team-bhp.com/forum/attachments/travelogues/1215911d1394086824-un-chained-melody-36-hours-snow-manali-leh-highway-d70005815xl.jpg";
	// }else if(globals['iconCurrent'] == "wind"){
	// 	newbg = "http://www.walldevil.com/wallpapers/a81/sea-ocean-sky-cloud-wind-storm-palm.jpg";
	// }else if(globals['iconCurrent'] == "fog"){
	// 	newbg = "https://wallpaperscraft.com/image/new_york_bridge_fog_rain_59529_3840x2160.jpg";
	// }
	
	// var bgDiv = document.querySelector(".bg-div");
	// bgDiv.style.backgroundImage = "url(" + newbg + ")";
	// bgDiv.style.backgroundAttachment = "fixed";
	// bgDiv.style.backgroundRepeat = "no-repeat";
	// bgDiv.style.backgroundSize = "cover";
	
	//load icon
	var skycons = new Skycons({"color": "#5bc0de"});
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

	if(!document.querySelector('.icon-temperature').innerHTML===""){
		console.log(globals['spinner']);
		globals['spinner'].stop();
		
	}
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
		newtd3.innerHTML = playlistTitle.toUpperCase();
		newtd3.style.fontWeight = "bolder";
		newtd3.style.lineHeight = "7";
		tr.appendChild(newtd3);

		showPlaylists.appendChild(tr);

	});
	//displays the playlists
	document.querySelector("#table-show-playlist").style.visibility="visible";
	document.querySelector("#table-show-playlist").style.transition="all 3s";
	document.querySelector(".final-playlist-button").style.visibility = "visible";
	document.querySelector(".final-playlist-button").style.transition = "all 3s";

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
	}
	
	document.querySelector(".final-playlist-table").style.visibility = "visible";
	document.querySelector(".final-playlist-table").style.transition = "all 3s";
		
	makeIframePlayer(newTracks);

}

function makeIframePlayer(newTracks){

	var iframeSrc="https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:";
	var newarr = new Array();
	for(var i=0; i<newTracks.length; i++){
		newarr.push(newTracks[i].track.id);
	}

	iframeSrc += newarr.join();
	
	var tableBody = document.querySelector(".final-playlist");
	tableBody.addEventListener("click",function(){
		console.log(iframeSrc);
		window.location.href = iframeSrc;
	});

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
