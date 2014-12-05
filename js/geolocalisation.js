function errorGeolocation(error) {
	var info = "Erreur lors de la géolocalisation : ";
	switch (error.code) {
		case error.TIMEOUT:
			info += "Timeout !";
			break;
		case error.PERMISSION_DENIED:
			info += "Vous n’avez pas donné la permission";
			break;
		case error.POSITION_UNAVAILABLE:
			info += "La position n’a pu être déterminée";
			break;
		case error.UNKNOWN_ERROR:
			info += "Erreur inconnue";
			break
	}
	console.log(info)
}

function getPosition() {
	if (navigator.geolocation)
		survId = navigator.geolocation.getCurrentPosition(function(position) {
			window.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			addMarker(window.currentPosition, "Vous êtes ici", '<b>Vous êtes ici</b>', null);
			window.map.panTo(window.currentPosition);
		}, errorGeolocation, {
			maximumAge: 60000,
			timeout: 10000
		});
	else
		console.log("I'm sorry, but geolocation services are not supported by your browser.")
}

function addHTMLContent(text) {
	document.getElementById('ajaxContent').innerHTML = text
}

window.addEventListener('load', function() {
	var centerpos = new google.maps.LatLng(48.856578, 2.351828);
	var optionsGmaps = {
		center: centerpos,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		zoom: 12
	};
	window.map = new google.maps.Map(document.getElementById("map"), optionsGmaps);
	window.infoWindow = null;
	window.directionsRenderer = null;
	window.geocoder = new google.maps.Geocoder();
	window.geomarkers = new Array();
	window.searchAddress = null;
	getPosition();
});

function displayFire()
{
	displayPOI("fire_stations_paris_mapped", 1);
}
function displayWater()
{
	displayPOI("water_paris_mapped", 2);
}
function displayPolice()
{
	displayPOI("police_stations_paris_mapped", 3);
}

function displayPOI(table, type) {
	killMarkers();
	killDirections();
	if (navigator.geolocation)
		survId = navigator.geolocation.getCurrentPosition(function(position) {
			window.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			addMarker(window.currentPosition, "Vous êtes ici", '<b>Vous êtes ici</b>', null);
			window.map.panTo(window.currentPosition);
			var params = {
				sort: [
					{
						_geo_distance: {
							location: [position.coords.longitude, position.coords.latitude],
							order: "asc",
							unit: "km"
						}
					}
				],
				query: {
					query_string: {
						query: "*"
					}
				}
			};
			ajaxText(addPOI, 'http://vps120954.ovh.net:9200/open_data/' + table + '/_search', JSON.stringify(params), type);
		}, errorGeolocation, {
			maximumAge: 60000,
			timeout: 10000
		});
	else
		console.log("I'm sorry, but geolocation services are not supported by your browser.")
}

function killMarkers() {
	for (i = 0; i < window.geomarkers.length; i++) {
		window.geomarkers[i].setMap(null)
	}
	window.geomarkers = new Array()
}

function addMarker(latlng, titleContent, htmlContent, color) {
	var marker = new google.maps.Marker({
		position: latlng,
		map: window.map,
		title: titleContent,
		animation: google.maps.Animation.DROP
	});
	if (color != null)
		marker.setIcon(new google.maps.MarkerImage('http://maps.google.com/intl/en_us/mapfiles/ms/micons/' + color + '-dot.png'));
	marker.setClickable(true);
	marker.setMap(window.map);
	google.maps.event.addListener(marker, 'click', function() {
		if (window.infoWindow)
			window.infoWindow.close();
		window.infoWindow = new google.maps.InfoWindow({
			content: htmlContent
		});
		document.getElementById('info').className = '';
		document.getElementById('info').innerHTML = htmlContent;
		window.map.panTo(marker.position);
		if (window.map.getZoom() < 13)
			window.map.setZoom(13);
		if (!currentPosition.equals(this.getPosition())) {
			killDirections();
			loadDirections(this.getPosition(), "WALKING")
		}
	});
	window.geomarkers.push(marker)
}

function killDirections() {
	if (window.directionsRenderer != null) {
		window.directionsRenderer.setMap(null);
		window.directionsRenderer.setPanel(null)
	}
}

function ajax(callback, url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			callback(xhr.responseXML)
		}
	};
	xhr.open("GET", url, true);
	xhr.send(null);
}

function ajaxText(callback, url, params, type) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			callback(xhr.responseText, type);
		}
	};
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhr.send(params);
}

function addPOI(json, type)
{
	var poi = JSON.parse(json);
	for (i = 0; i < poi.hits.hits.length; i++) {
		var source = poi.hits.hits[i]._source;
		var xlong = parseFloat(source.location.lon);
		var ylat = parseFloat(source.location.lat);
		var latlng = new google.maps.LatLng(ylat, xlong);
		var name;
		if (type == 1)
			name = "Caserne de pompiers";
		else if (type == 2)
			name = "Fontaine d'eau"
		else if (type == 3)
			name = "Commissariat"
		var htmlContent = '<h3 style="text-align:center">' + name + '</h3>';
		if (type == 1 || type == 3)
			htmlContent += '<b>Ville : </b>' + source.city;
		if (type == 1)
			htmlContent += '<br/><b>Téléphone : </b><a href="tel:' + source.phone.replace(' ', '') + '">' + source.phone + '</a>';
		else if (type == 3)
			htmlContent += '<br/><b>Téléphone : </b><a href="tel:17">17</a>';
		if (type == 1)
			htmlContent += '<br/><b>Adresse : </b>' + source.address;
		addMarker(latlng, name, htmlContent, 'green');
	}
}


function loadDirections(destination) {
	if (window.mode == null)
		window.mode = google.maps.TravelMode.DRIVING;
	var directionsRendererOptions = {
		map: window.map,
		panel: document.getElementById("directions"),
		suppressMarkers: true
	};
	window.directionsRenderer = new google.maps.DirectionsRenderer(directionsRendererOptions);
	var directionsRequest = {
		origin: window.currentPosition,
		destination: destination,
		travelMode: window.mode
	};
	var directionsService = new google.maps.DirectionsService();
	directionsService.route(directionsRequest, function(resultDirections, statusCodeDirections) {
		if (statusCodeDirections === google.maps.DirectionsStatus.OK)
			window.directionsRenderer.setDirections(resultDirections);
		else
			console.log(resultDirections)
	})
}

function setMode(modeString) {
	switch (modeString.toUpperCase()) {
		case 'WALKING':
			window.mode = google.maps.TravelMode.WALKING;
			break;
		case 'BICYCLING':
			window.mode = google.maps.TravelMode.BICYCLING;
			break;
		case 'TRANSIT':
			window.mode = google.maps.TravelMode.TRANSIT;
			break;
		default:
			window.mode = google.maps.TravelMode.DRIVING;
			break
	}
}

function codeAddress() {
	window.searchAddress = document.getElementById("getAddressEnter").value;
	window.geocoder.geocode({
		'address': window.searchAddress
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			window.currentPosition = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
			displayPOI()
		} else
			console.log("La géolocalisation de votre adresse n'a pu etre effectue pour la raison suivante: " + status)
	});
}