// Functions to add OpenLayers map
function initMap()
{
	
	
	// add layer to map view
	var BingLayer = new ol.layer.Tile
	(
		{
			source: new ol.source.BingMaps
			(
				{
					key: "ApTJzdkyN1DdFKkRAE6QIDtzihNaf6IWJsT-nQ_2eMoO4PN__0Tzhl2-WgJtXFSp",
					imagerySet: 'Aerial'
				}
			)
		}
	);
	
	var map = new ol.Map
	(
		{
			layers: [
			
				BingLayer
			],
			
			controls: ol.control.defaults
			(
				{
                    attributionOptions:
					(
						{
                            collapsible: false
                        }
					)
                }
			),
			
			//Set map center to NaWi
            target: 'map-container',
            view: new ol.View
			(
				{
					center: ol.proj.fromLonLat( [ 6.675067, 49.748032 ] ),
                    zoom: 2
                }
			)
		
		}
	);
	
	//ASTRID-----------------------------------------------------
	//load the first question
	load_question();
	//-----------------------------------------------------
	
}

//ASTRID-----------------------------------------------------
//questions
function load_question(){
	//console.log(JSON.parse(questionsJSONString));
	var quiz_questions = JSON.parse(questionsJSONString);
	
	var questionNumber = get_randomNumber(quiz_questions.Questions.length);
	var question = quiz_questions.Questions[questionNumber];
	
	//console.log(question.question);
	
	document.getElementById("myQuestion").innerHTML = question.question;
	document.getElementById("myAnswer").innerHTML = question.answer;
}

//get a random number to choose the next question
function get_randomNumber(n){
	randomNumber= Math.floor(Math.random() * (n));
	return randomNumber;
}
//TO DO: 
// 1)a question should only come once per game --> 
// memorize ID of questions, which have already been asked and exclude them from possible next questions
// 2) load new question after one is answered
// 3) add more questions to the questions.json --> what attributes are needed for evaluation
//To DISCUSS:
// Where do questions come from? JSON-file as suggested? 
//-----------------------------------------------------

//Main entry point
initMap();