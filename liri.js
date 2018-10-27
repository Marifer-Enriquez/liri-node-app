
require('dotenv').config()
var fs = require("fs");
var request = require ("request");
var keys = require("./keys.js");
var Spotify = require ("node-spotify-api"); 
var spotify = new Spotify(keys.spotify);
var argument = process.argv [2];
var moment = require('moment');

//Make it so liri.js can take in one of the following commands: * `concert-this`  * `spotify-this-song` * `movie-this` * `do-what-it-says

switch (argument) {
    case "concert-this": concertSearch (); 
    break;

    case "spotify-this-song": spotifyThisSong (process.argv.slice(3).join(" "));
    break;

    case "movie-this": movieThis ();
    break;

    case "do-what-it-says": doWhatitSays ();
    break;

    default: console.log ("To start type 'node liri' + one of the following commands:" + "\r\n" +  
    "concert-this + artist name" + "\r\n" +
    "spotify-this-song + song name" + "\r\n" +
    "movie-this + movie name" + "\r\n" +
    "do-what-it-says" + "\r\n")
};

function concertSearch () {
    var artist = process.argv.slice(3).join(" ");
    if(!artist){
        artist = "lady gaga";
    }
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body){
        if (!error && response.statusCode === 200) {
            var artistarr = JSON.parse(body);
            console.log("Upcoming concerts for "+ artist + ": "+ "\r\n")
            for(var i= 0; i < artistarr.length; i++){
                //var date = artistarr[i].datetime.split("-");
                var format = moment(artistarr[i].datetime).format("MMM Do YY")
                var artistRes = artistarr[i].venue.name + " " + artistarr[i].venue.city + " " + format;
                console.log(artistRes)
            }
            
          
    }})
}

//OMDB KEY : http://www.omdbapi.com/?i=tt3896198&apikey=79acdf20 
function movieThis (){
    var movie = process.argv.slice(3).join(" ");
    if(!movie){
        movie = "mr nobody";
    }
    request ("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json&tomatoes=true&apikey=79acdf20", function (error, response, body){
        if (!error && response.statusCode === 200) {
            var movieobj = JSON.parse(body);
            var movieResult = "---- " + movieobj.Title + " ----" + "\r\n" +
            "Year: " + movieobj.Year + "\r\n" +
            "IMDB rating: " + movieobj.imdbRating + "\r\n" +
            "Rotten Tomatoes Rating: " + movieobj.tomatoRating + "\r\n" +
            "Country: " + movieobj.Country + "\r\n" +
            "Language: " + movieobj.Language + "\r\n" +
            "Plot: " + movieobj.Plot + "\r\n" +
            "Actors: " + movieobj.Actors + "\r\n" +
            "-----------------------------------" + "\r\n";

            console.log (movieResult);
           }
        else{
            console.log(error);
            return;
        }
    });
};

function spotifyThisSong (song){

   // var song = process.argv[3];
    if(!song) {
        song = "The Sign"; 
    };
    spotify.search({type: "track", query: song}, function(error, response, body){
        if(!error){
        var songRes = response.tracks.items;
        for (var i = 0; i < 10; i++){
            var spotifyResult = "---- " + songRes[i].name + " ----"+ "\r\n" +
            "Artist: " + songRes[i].artists[0].name + "\r\n" +
            "Album: " + songRes[i].album.name + "\r\n" +
            "Preview link: " + songRes[i].preview_url + "\r\n" +
            "--------------------------------------" + + "\r\n" ;
            console.log(spotifyResult);
        }
        }
        else{
            console.log(error);
            return;
        }
        });
};


function doWhatitSays (){
    fs.readFile("random.txt", "utf8", function(error, data){
        if (!error) {
        doWhat = data.split(",");
       if (doWhat[0] === "spotify-this-song"){
           var songrandom = doWhat[1].trim();
           console.log(songrandom);
           spotifyThisSong (songrandom);
       }
       else if (doWhat [0] === "movie-this"){
            var movierandom = doWhat[1].trim();
            movieThis (movierandom);
       }
       else if (doWhat [0] === "concert-this"){
           var concertrandom = doWhat[1].trim();
           concertSearch (concertrandom);
       }
    }
    else{
        console.log(error);
    }
})
}

