
// define Global Variables
var searchInput;
var searchButton;
var deleteButton;

var map; 

var markerGroup;
var markerGroupCorrect;


// Functions to add OpenLayers map

function init()
{
	searchInput= $( "#response" );				// Abfrage nach ID
	searchButton= $( "#Go-button" );
	deleteButton= $( "#delete-button" );
	
	
	searchButton.click( searchClick );
	deleteButton.click( deleteClick );
	
	// Create Map
	map = L.map
	(
		"map-container", 
		{
			center: {lng: 6.675067, lat: 49.748032},
			zoom: 3
		}
	);
	
	var osmLayer = L.tileLayer
	(
		"http://{s}.tile.osm.org/{z}/{x}/{y}.png",
		{
			// Source
			attribution: "&copy; <a href= 'http://osm.org/copyright'>OpenStreetMap</a> Contributors"
		}
	);
	
	map.addLayer(osmLayer);
	
	// group layer for all created markers 
	markerGroup = L.layerGroup();
	map.addLayer(markerGroup);
	
	markerGroupCorrect = L.layerGroup();
	map.addLayer(markerGroupCorrect);
	
	
	
	
}

// Load questions 
function loadQuestion()
{ //myQuestion
	for(var i = 0; i < data.length; i++){
		//console.log(data[i].question)
		//console.log(document.getElementById("answer").value)
		
		//another function for this down to be evaluated
		//prints out the question to log
		document.getElementById("myQuestion").innerHTML = data[i].question
		/*
		var givenQuestion = data[i].correctAnswer
		var givenAnswer = document.getElementById("answer").value
		if(givenQuestion === givenAnswer){
			console.log("YES!")
		}else{
			console.log("NO")
		}*/
	
	}
	// console.info(data);
	
	// var questions = data[Math.floor(Math.random()*data.length)];
	
	// document.getElementById("myQuestion").innerHTML = questions["questions"];
}


// Event Handler - When clicking on "Search / Delete Button"
function deleteClick()
{
	//resultList.empty();
	markerGroup.clearLayers();
}


function searchClick()
{
	var v = searchInput.val();
	
	startSearch( v );
	
}

function startSearch(s)
{
	
	console.info( "Search:", s);
	
	$.getJSON('./data/PopPlaces.json', {s}, searchResponse);
	
}

function searchResponse( data )
{
	var latlon = [];
	var answer = [];
	loadQuestion();
	// Loop Result Location
	for (var i= 0; i< data.features.length; i++)
	{
		if (data.features[i].properties.NAME == document.getElementById("answer").value)
		{
			var id = data.features[i].properties.NAME;
			console.info("Response", id);
			
			var lat = data.features[i].properties.LATITUDE;
			var lng = data.features[i].properties.LONGITUDE;
			latlon.push(lat, lng); 				// string of two single strings
			latlon[ 0 ] = parseFloat(latlon [ 0 ]);
			latlon[ 1 ] = parseFloat(latlon [ 1 ]); 
					
			console.info("Coordinates:", latlon);
						
			var marker = L.marker
			(
				{lng: latlon[ 1 ], lat: latlon[ 0 ]},
				{
					title: id
				}
			);
			
			answer.push(marker);
		}		
	}	
	
	// Add marker to layer group
	markerGroup.addLayer( marker );
	
	//checkAnswer(marker);
}

/*
function checkAnswer(marker)
{
	if(marker == correctAnswer)
	{
		alert("Bravo!"));
	}
	else
	{
		// Search for correctAnswer in JSOn Object, get coordinates and add marker
		// Loop Result Location
		for (var i= 0; i< data.features.length; i++)
		{
			var id = data.features[i].properties.NAME;
			var lat = data.features[i].properties.LATITUDE;
			var lng = data.features[i].properties.LONGITUDE;
			latlon.push(lat, lng); 				// string of two single strings
			latlon[ 0 ] = parseFloat(latlon [ 0 ]);
			latlon[ 1 ] = parseFloat(latlon [ 1 ]); 
			
			var marker = L.marker
			(
				{lng: latlon[ 1 ], lat: latlon[ 0 ]},
				{
					title: id
				}
			);
			
		}
	}
	
	markerGroupCorrect.addLayer(marker);
}
*/

// Main Entry point
$(document).ready(init);