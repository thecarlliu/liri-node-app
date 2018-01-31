require("dotenv").config();

var keys = require("./keys.js");

var command = process.argv[2];

//shows last 20 tweets and when they were created
if (command == "my-tweets") {
	var client = new Twitter(keys.twitter);

	var queryURL = "https//api.twitter.com/1.1/search/tweets.json&count=10";
	


    log("Input:\n"+process.argv[2]+"\n");
}
//shows artist, song name, preview link of song from Spotify, and album the song is from
//if no song provided, program defaults to "The Sign" by Ace of Base.
else if (command == "spotify-this-song") {
	if (process.argv.length > 3) {
		searchSpotify(process.argv[3]);
		log("Input:\n"+process.argv[2]+" "+process.argv[3]+"\n");
	}
	else {
		searchSpotify("The Sign Ace of Base");
		log("Input:\n"+process.argv[2]+" "+"The Sign Ace of Base"+"\n");
	}
}
//outputs omdb data
//if user doesn't type a movie in, the program deafults to outputting the data for "Mr. Nobody".
else if (command == "movie-this") {
	if (process.argv.length > 3) {
		searchMovie(process.argv[3]);
		log("Input:\n"+process.argv[2]+" "+process.argv[3]+"\n");
	}
	else {
		searchMovie("Mr.Nobody");
		log("Input:\n"+process.argv[2]+" "+"Mr.Nobody"+"\n");
	}
}
//Uses fs node package to take the text inside of random.txt,
//then uses it to call one of LIRI'ss commands
else if (command == "do-what-it-says") {
	var fs = require("fs");
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}
		var arr = data.split(",");
		if (arr[0] == "my-tweets") {
			searchTwitter();
		}
		if (arr[0] == "spotify-this-song") {
			searchSpotify(arr[1]);
		}
		if (arr[0] == "movie-this") {
			searchMovie(arr[1]);
		}
		log("Input:\n"+arr[0]+" "+arr[1]+"\n");
	});
}

function searchTwitter() {

}

function searchSpotify(song) {
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);
	
	spotify.search({ type: 'track', query: song, limit: 1 }, function(err, data) {
		if (err) {
	    	return console.log('Error occurred: ' + err);
		}
	 
		var artistName = "Artist: "+data.tracks.items[0].album.artists[0].name;
		var songName = "Song: "+data.tracks.items[0].name;
		var preview = "Preview: "+data.tracks.items[0].external_urls.spotify;
		var album = "Album: "+data.tracks.items[0].album.name+"\n";
	 	log("Output:\n"+artistName+"\n"+songName+"\n"+preview+"\n"+album+"\n");
		console.log(artistName+"\n"+songName+"\n"+preview+"\n"+album); 
	});
}

function searchMovie(movie) {
	//title of movie
	//year the movie came out
	//imdb rating of the movie
	//rotten tomatoes rating of the movie
	//country where the movie was prduced
	//language of the movie
	//plot of the movie
	//actors in the movie
	var name = movie;
	var apiKey = "trilogy";
	var queryURL = "http://www.omdbapi.com/?apikey="+apiKey+"&"+"t="+name;

	var request = require('request');
	request.get(queryURL, function (error, response, body) {
		console.log('error:', error); // Print the error if one occurred
		var result = JSON.parse(body);
		var title = "Title: "+result.Title+"\n";
		var year = "Year: "+result.Year+"\n";
		var imdb = "Imdb Rating: "+result.Ratings[0].Value+"\n";
		var tomato = "Rotten Tomatoes Rating: "+result.Ratings[1].Value+"\n";
		var country = "Country: "+result.Country+"\n";
		var language = "Language: "+result.Language+"\n";
		var plot = "Plot: "+result.Plot+"\n";
		var actors = "Actors: "+result.Actors+"\n";
		log("Output:\n"+title+year+imdb+tomato+country+language+plot+actors+"\n");
		console.log(title+year+imdb+tomato+country+language+plot+actors);
	});
}

function log(text) {
	var fs = require("fs");
	fs.appendFile("log.txt", text, function(err) {
		// If an error was experienced we say it.
		if (err) {
			console.log(err);
		}
	});
}