
// define Global Variables
var searchInput;
var searchButton;
var deleteButton;

var map; 

var markerGroup;
var markerGroupCorrect;

//global variables to limit number of questions per game
//and to store id´s of already used questions per game to avoid asking a question twice
var numberOfQuestions = 0;
var usedQuestions = [];

// Create different marker for correct answer
var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


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
	
	loadQuestion();//load first question when page is loaded
	
	
}

// Load questions 
function loadQuestion()
{ 
	//console.info(data);
	
	//pick a random question from the list of questions in questions.js	
	//and check, that this question is not used already in the game 
	do{
		//get random question
		var questions = data[Math.floor(Math.random()*data.length)];
		//console.log("In do-loop " + questions.question_id);
	}
	//as long as it was not already asked in this game
	while(usedQuestions.includes(questions.question_id))
	
	//and display it in the left canvas
	document.getElementById("myQuestion").innerHTML = questions["question"];
	
	//increase the counter by one
	numberOfQuestions++;
	//store the id of the used question in an Array
	usedQuestions.push(questions.question_id, questions.correctAnswer);
	
	//console.log("Number of questions " + numberOfQuestions);
	console.log("Used Questions " + usedQuestions);
	
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
	
	$.getJSON('./data/PopPlaces.json', {s}, searchResponse);
	
}

function searchResponse( data )
{
	var latlon = [];
	var answer = [];
	
	//after giving an answer load next question --> clicking on Go-Button at the moment
	//or when answer was checked
	//############# have to decide, when the next question should be loaded!!!!!!#####
	if (numberOfQuestions >= 5){
		//after 5 questions the game is over and the results should be displayed!
		//max. number of questions per game can be changed of course
		console.log("End of Game!");
		//set counter and array for question control back to zero
		numberOfQuestions = 0;
		usedQuestions = [];
	}
	else{
		loadQuestion(); 
	}
	
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
						
			var marker = L.marker
			(
				{lng: latlon[ 1 ], lat: latlon[ 0 ]},
				{
					title: id
				}
			);
		}		
	}	
	
	// Add marker to layer group
	markerGroup.addLayer( marker );	
	
	loadJSON();
}

function loadJSON()
{
	$.getJSON
	(
		"./data/PopPlaces.json",
		{},
		checkAnswer
	);
}


function checkAnswer(json)
{
	console.log(json);
	
	var latlonCorrect = [];
	
	var givenAnswer = document.getElementById("answer").value;
	

	if(givenAnswer == usedQuestions[1])
	{
		console.info("YES!");
		
		//and display it in the left canvas
		//document.getElementById("points").innerHTML = score;
	}

	else
	{
		// Loop Result Location
		for (var i= 0; i< json.features.length; i++)
		{
			if (json.features[i].properties.NAME == usedQuestions[1])
			{
				var id = json.features[i].properties.NAME;
					
				var lat = json.features[i].properties.LATITUDE;
				var lng = json.features[i].properties.LONGITUDE;
					
				latlonCorrect.push(lat, lng); 				// string of two single strings
				latlonCorrect[ 0 ] = parseFloat(latlonCorrect [ 0 ]);
				latlonCorrect[ 1 ] = parseFloat(latlonCorrect [ 1 ]); 
							
				console.info("Coordinates:", latlonCorrect);
								
				var marker = L.marker
				(
					{lng: latlonCorrect[ 1 ], lat: latlonCorrect[ 0 ]},
					{
						title: id,
						icon: greenIcon
					}
				);

				// Create Popup
				var popup = "<p>";
				popup += id;	
				popup += "</p>"
					
				marker.bindPopup(popup);				
					
			}	
		}
		
		// Add marker to layer group
		markerGroupCorrect.addLayer( marker );
		
	}
}

// Main Entry point
$(document).ready(init);