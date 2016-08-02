var hash = {};
	location.hash.slice(1).split('&').forEach(function(pair) {
    	pair = pair.split('=');
    	hash[pair.shift()] = pair.join('=');
	});
	if (hash.error) {
    	console.log(hash.error);
	} else {
		console.log(token);
	    console.log(hash);
	    token = hash.access_token;
	    hash.token_type === "Bearer";
	    var expiry = new Date();
	    expiry.setSeconds(expiry.getSeconds() + (+hash.expires_in));
	    
}

