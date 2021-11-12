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
	
}

//Main entry point
initMap();