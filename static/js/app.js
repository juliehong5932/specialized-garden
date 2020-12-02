var states=['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
      'New Jersey', 'New Mexico', 'New york', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 
      'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 
      'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
var sun_needs=['Partial Shade', 'Full Sun or Partial Shade', 'Full Sun',
       'Partial Shade or Full Shade', 'All Sun Types',
       'Full Sun or Partial Shade or Full Shade', 'Flexible'];
var soil_needs=['Well-drained', 'Well-drained, High fertility', 'Damp',
       'Well-drained, Damp', 'Dry', 'Droughty', 'Flexible'];
var plant_types=['Flower', 'Animal Feed', 'Fruit', 'Other', 'Vegetable',
       'Grain or Nut'];
var features=['Tolerates heat', 'Tolerates frost',
       'Non-invasive', 'Good for pressed flowers', 'Good for cut flowers',
       'Deer resistant', 'Attracts bees', 'Attracts butterflies',
       'Attracts beneficial insects', 'Attracts hummingbirds', 'None'];
var seasons=['Summer', 'Spring', 'Fall', 'Fall and Winter', 'Spring and Summer',
       'Winter', 'All']; 

// d3.csv('data/machine_learning.csv').then(data=>{
var statesSel=d3.select('#statesSelection').style("fill","black");
var soilNeedsSel=d3.select('#soilNeedsSelection');
var sunNeedsSel=d3.select('#sunNeedsSelection');
var plantTypesSel=d3.select('#plantTypesSelection');
var featuresSel=d3.select('#featuresSelection');
var seasonsSel=d3.select('#seasonsSelection');

var inputs=[{'dom': statesSel, 'list': states}, 
			{'dom': sunNeedsSel, 'list': sun_needs, 'header': 'Sun Needs_'}, 
			{'dom': soilNeedsSel, 'list': soil_needs, 'header': 'Soil Needs_'}, 
			{'dom': plantTypesSel, 'list': plant_types, 'header': 'Plant Type_'}, 
			{'dom': seasonsSel, 'list': seasons, 'header': 'Season_'}, 
			{'dom': featuresSel, 'list': features}];

inputs.forEach(input=>{
	input['list'].forEach(inputChoice=>{
		if (input['header']){ 
			input['dom'].append('option')
				.property('value', input['header']+inputChoice)
				.text(inputChoice);
		} else {
			input['dom'].append('option')
				.property('value', inputChoice)
				.text(inputChoice);
		};
	});
});

d3.select('#go').on('click', function() {
	var rec=d3.select('#recommendation');
	rec.html('');
	// rec.html(statesSel.property('value')+soilNeedsSel.property('value')+sunNeedsSel.property('value'))
	input_str=statesSel.property('value')+'&'+
		plantTypesSel.property('value')+'&'+
		soilNeedsSel.property('value')+'&'+
		sunNeedsSel.property('value')+'&'+
		featuresSel.property('value')+'&'+
		seasonsSel.property('value')
	d3.json('/predict/'+input_str).then(results=>{
		rec.html(results);
	});
});

////////////////////////////////////
var API_KEY='pk.eyJ1Ijoia2V2aW5jbGVlMjYiLCJhIjoiY2tmdTF4dGpoMGpnOTJxcWZ2bTRkZHB4ZyJ9.uN_ZmcdWxJmpwLGCKREFOg';
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	tileSize: 512,
	maxZoom: 18,
	zoomOffset: -1,
	id: "mapbox/streets-v11",
	accessToken: API_KEY
}).addTo(map);

// console.log(statesData['features'])
statesData['features'].forEach(feature=>{
	feature['properties']['flower']=statesFlowers[feature['properties']['name']];
});

console.log(statesData['features']);

function onEachFeature(feature, layer) {
	layer.bindPopup('<p>'+feature.properties.flower+'</p>');
}

L.geoJson(statesData, {
	onEachFeature: onEachFeature
}).addTo(map);