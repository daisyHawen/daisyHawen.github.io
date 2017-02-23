var getGroups = function() {
	var photo_id = "";
	var url = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=56a8221a406f0c4f150601ed15512173&photo_id=" + photo_id + "&format=json";

	$.ajax(url)
		.done(function() {
			console.log(url + "done");
		}).fail(function() {
			console.log(url + "fail")
		});　　
}