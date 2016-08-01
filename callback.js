var hash = {};
location.hash.slice(1).split('&').forEach(function(pair) {
    pair = pair.split('=');
    hash[pair.shift()] = pair.join('=');
});
if (hash.error) {
    console.log(hash.error);
} else {
    token = hash.access_token;
}