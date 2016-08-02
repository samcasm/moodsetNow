var button1 = document.querySelector("#button1");
button1.addEventListener("click",function(){
	location.href = "https://accounts.spotify.com/authorize" + 
    "?client_id=" + "a2675007fa4d48409facbac791af9e2d" +
    "&response_type=token" + 
    "&redirect_uri=" + encodeURIComponent("https://samcasm.github.io/moodsetNow/moodset.html?callback=mycallback") + 
    "";
});
