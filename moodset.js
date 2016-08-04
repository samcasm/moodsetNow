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
	globals['iconCurrent'] = response.currently.icon;
	
	//load background
	var newbg = "";
	if(globals['iconCurrent'] == "clear-day"){
		newbg = "https://www.flickr.com/photos/stephenwalford/8116884592/in/photolist-dnga15-6iFZNo-5vS1oE-iFYC57-5vBQVj-6e8vyD-62yhYD-6pr5vr-8ZckvT-8ZSFM7-6uMh3b-5MQNSh-6MKABz-ciAL5Y-8KkDRD-cBtWfG-cyTdo3-5uCWBd-53Zfi7-aH84NH-efP5TF-AEXwtL-6ursJF-d1w3du-9gSS9d-9hVfkk-ckHDx9-6hCX7L-7QKD4v-7z7unp-7DP1Cz-5qU2Cy-7tPmwj-8TP8Nu-8KJShh-64Py2T-9a6yEt-8WPRv6-78XRdW-8X3zhD-8sD9WY-77xNKC-93J74w-9KyaV4-BkrRUS-a5VWwv-77EM5o-8UwoNY-9186pn-9A42oG";
	}else if(globals['iconCurrent'] == "clear-night"){
		newbg = "https://www.flickr.com/photos/mattpugs/14570392200/in/photolist-ocx4YC-kMzKac-7jBzeZ-oms8W8-iMfrqt-qHxqWh-od61is-drXnEz-5oSppt-rgk9MG-oVsSaJ-qAQ23g-ecfxaT-ocedPE-arMxdX-8ExNoW-mVfKGi-5K2FX7-fCcQnD-8huRdn-cy4C3w-6shvbW-bQduaa-dr5tQo-oZakkV-opfN2H-nZ7xLm-ePWczV-owqa8X-oRBa4u-p4UqA4-35vKa8-aC4H3J-b6Svsi-aAz13n-nRo7NJ-rsjqKw-8huRbn-iPc5qD-h4uF4V-jkekZ8-qtKxeS-oeb6X2-cgcHH7-9vhuia-4vwP6g-br3SaM-9vAfCU-eiFdbe-cQV3pE";
	}else if(globals['iconCurrent'] == "partly-cloudy-day"){
		newbg = "https://www.flickr.com/photos/joannarb2009/15350065986/in/photolist-por6Q7-aypJFo-eShcAe-9RiH3Q-9AoLso-ar98hp-fuUTYu-p22eXG-pD5Vbo-pFRjU4-eerC8R-ccpXBG-jrRA44-nAvHnW-g8Jiw1-535S17-8LQLLU-gJhXSc-qb8Hf8-gJi5Y7-53NP8K-ai2VFk-dFMmqc-gJhYzA-GR3gyG-fTKL2j-sghZzt-rdi9i6-bMXzcH-nGZNft-egtqY2-nYQXrx-8HQfmM-aRPc3e-6vq8GJ-raFeXF-qoRdwZ-nRrFgL-rA4FZf-nGEL2k-kkXwYH-qMTKTe-dRtGrL-bjhY2t-9cY7FT-oUCvp5-8pDkG8-omT6Ty-rpLbBF-5TBgY9";
	}else if (globals['iconCurrent'] == "partly-cloudy-night"){
		newbg = "https://www.flickr.com/photos/77437968@N00/14276673077/in/photolist-nKzFvP-8msKZW-cjmsV3-eShSQ8-nvR3sJ-9ToHYy-ozGCQf-d3TwXC-oHnuhR-9c3k6T-9y44jY-fQc3X5-3KCZ99-e6KRM8-pmu6Cp-rkSvVN-8pEpmE-9VGSHK-9WbjXF-ryXmqP-oxQrt9-25jZuZ-an2mPV-9c6pNQ-84aTLe-5bb92D-8V9TVE-4EFPST-eJYE3D-5BmYgE-c5wKqs-5uGXDu-9T93Mj-a4Yf43-faFUoc-4Zarqt-fhLs3n-wKEp4Q-aoFoJK-a4Yf9J-bXfsdg-9VGSKB-Srhgj-SrhpJ-nLjH49-fsmqcF-6JxRQN-7BcNpP-dTctsL-o4eoXV";
	}else if(globals['iconCurrent'] == "cloudy"){
		newbg = "https://www.flickr.com/photos/podkozo/15557773890/in/photolist-pGME9S-8PHr3a-q9v1nu-pQHt1g-D2P7Vt-q8dCRE-G6WUky-pQK4Ny-oCcF6n-pQG357-k5nLYc-por6Q7-aypJFo-eShcAe-9RiH3Q-9AoLso-ar98hp-fuUTYu-p22eXG-pD5Vbo-pFRjU4-eerC8R-ccpXBG-jrRA44-nAvHnW-g8Jiw1-535S17-8LQLLU-gJhXSc-qb8Hf8-gJi5Y7-53NP8K-ai2VFk-dFMmqc-gJhYzA-GR3gyG-fTKL2j-sghZzt-rdi9i6-bMXzcH-nGZNft-egtqY2-nYQXrx-8HQfmM-aRPc3e-6vq8GJ-raFeXF-qoRdwZ-nRrFgL-rA4FZf";
	}else if(globals['iconCurrent']=="rain"){
		newbg = "https://www.flickr.com/photos/www-gohip-de/6807992923/in/photolist-bnAK7k-97dnGM-9mgZWs-btpnwY-aDY9xv-drLCzS-9tTc2W-qrZh8k-9e9Y54-93eigw-9xYWdG-8UsnLe-bDPBM6-bsNGQG-cDgPj5-Dii38X-yqcwA3-mkaf9z-pYbYNu-aPvCPX-C1gYGv-9erpHv-aHRMCv-9MDMpf-pTTr9R-dVaMGY-dFeAE9-oSCQyd-atj6vs-ee9ts1-aCzCHW-auSLs3-e53HgT-9eKJAg-aDbXyL-dTZip2-egsE52-mZ8HxB-qhBNgp-92sVna-ftZhDB-mF7iXc-kF9jT4-99xW8B-rHcePz-r3Dxt9-kq2p5o-9nRfyX-pmPr3o-eTR6kE";
	}else if(globals['iconCurrent'] == "sleet"){
		newbg = "chill"
	}else if(globals['iconCurrent'] == "snow"){
		newbg = "https://www.flickr.com/photos/moaan/6720390995/in/photolist-oTk3QN-beRL7g-bgBcCP-4V6LN5-dAWd6j-bfnUXa-dSzea5-p9YSNc-qCchT2-q2HKsd-hkrEUB-qPYw2q-qnC9h5-dAcvXQ-bNNLdX-98niUm-pqXMdS-icCZQE-qDVer3-4kmPqQ-iymRbF-93S8Ze-qWCKDN-61JSkA-e3emVx-bJ2K14-4CSCuF-bHVVzZ-prce5p-iNXifJ-ErqQsn-pE4hVt-aQMvXK-idJKip-98oBzg-bqSAcz-8d6d4k-7vjCkE-98rGVG-98oEHM-CDak-8YADLd-ebsnRd-inmKtp-e7ekUP-vmM3G-9gp2Fg-mztznz-bJ2JuB-bJ2Jf8";
	}else if(globals['iconCurrent'] == "wind"){
		newbg = "https://www.flickr.com/photos/excitingart/7389252410/in/photolist-cfXRiC-fDxKZL-9396UH-nJ8YQY-ejhq8C-9KMnsT-d5r9Tb-d5rabm-8vfx6x-o4uffD-9TMBV4-ahe5pF-7ngBqS-sESEto-f3fnC8-ae9Bue-pcZATD-hs4isa-5Ej5B7-4NY2JK-cRrVQS-q5EKHM-pM7xEm-riG4YA-nm74Dx-iPqap-p94T2n-a2Vki7-jy8h3B-nuhoht-rpbJvY-8FAikb-qHeG2Y-2ZHqfi-6wDcMj-eHm3L5-etXGLK-ck2vZj-9tvhEd-4tjBpu-oKjL7U-9Nozhs-JzWAXf-djcqBp-qbYFsd-4c92Wq-a94Vqg-qTjM8e-48rZYt-pXmJqE";
	}else if(globals['iconCurrent'] == "fog"){
		newbg = "https://www.flickr.com/photos/miliepirate/16715514726/in/photolist-rt6oaL-6h9H88-8jNkAZ-rBBXaR-L2BMm-7GVkgA-opjdUV-nrmyh6-7GRpUV-oaqkKp-oxVwK1-7GVmtj-dGexJ6-pNWjUN-bkj8fE-7GVm3N-okuNNe-c2atas-8ecQG8-2aePtt-iPu8DE-6B6a52-8FXmeV-azZhnF-rt6nKh-Ed3cTW-cYEnao-4ucgEf-ovrNgs-q2Wod4-ga4pc5-cXReyU-4CCP6m-t1DX13-pBCu6f-q3nJoe-vRNEzS-qbjgE8-nuXnmp-qhKcVm-eXFM3P-cs7pFC-qCuzVe-JEvPgX-voYA6n-cBcbK7-jZdq1u-eiKwL6-nBUsTZ-p6kSqW";
	}
	
	var body = document.querySelector("body");
	body.style.backgroundImage = "url(" + newbg + ")";
	body.style.backgroundAttachment = "fixed";
	body.style.backgroundRepeat = "no-repeat";
	body.style.backgroundSize = "cover";
	
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
