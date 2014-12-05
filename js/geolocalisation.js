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
	if (navigator.geolocation) survId = navigator.geolocation.getCurrentPosition(function (position) {
		window.currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		displayPOI()
	}, errorGeolocation, {
		maximumAge: 60000,
		timeout: 10000
	});
	else console.log("I'm sorry, but geolocation services are not supported by your browser.")
}

function addHTMLContent(text) {
	document.getElementById('ajaxContent').innerHTML = text
}

function setCallbacks() {
	document.getElementById('myLocation').addEventListener('click', function () {
		getPosition()
	}, false);
	document.getElementById('region').addEventListener('click', function () {
		if (window.searchAddress != null) ajaxText(addHTMLContent, 'http://nightswatch.projets-bx1.fr/raw/region-' + window.searchAddress);
		else ajaxText(addHTMLContent, 'http://nightswatch.projets-bx1.fr/raw/region')
	}, false);
	document.getElementById('categories').addEventListener('click', function () {
		if (window.searchAddress != null) ajaxText(addHTMLContent, 'http://nightswatch.projets-bx1.fr/raw/categories-' + window.searchAddress);
		else ajaxText(addHTMLContent, 'http://nightswatch.projets-bx1.fr/raw/categories')
	}, false);
	document.getElementById('reviews').addEventListener('click', function () {
		if (window.searchAddress != null) ajaxText(addHTMLContent, 'http://nightswatch.projets-bx1.fr/raw/reviews-' + window.searchAddress);
		else ajaxText(addHTMLContent, 'http://nightswatch.projets-bx1.fr/raw/reviews')
	}, false);
	document.getElementById('places').addEventListener('click', function () {
		if (window.searchAddress != null) ajaxText(addHTMLContent, 'http://nightswatch.projets-bx1.fr/raw/places-' + window.searchAddress);
		else ajaxText(addHTMLContent, 'http://nightswatch.projets-bx1.fr/raw/places')
	}, false);
	document.getElementById('walking').addEventListener('click', function () {
		setMode('WALKING')
	}, false);
	document.getElementById('driving').addEventListener('click', function () {
		setMode('DRIVING')
	}, false);
	document.getElementById('transit').addEventListener('click', function () {
		setMode('TRANSIT')
	}, false);
	document.getElementById('bicycling').addEventListener('click', function () {
		setMode('BICYCLING')
	}, false);
	document.getElementById('getAddressEnter').addEventListener('keydown', function (event) {
		if (event.keyIdentifier == "Enter") codeAddress()
	}, false)
}
window.addEventListener('load', function () {
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
	getPosition()
});

function displayPOI() {
	killMarkers();
	killDirections();
	addMarker(window.currentPosition, "Vous êtes ici", '<b>Vous êtes ici</b>', null);
	window.map.panTo(window.currentPosition);
	ajax(addPOI, 'http://nightswatch.projets-bx1.fr/raw/data-' + window.currentPosition.toUrlValue(3).replace("-", "n"))
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
	if (color != null) marker.setIcon(new google.maps.MarkerImage('http://maps.google.com/intl/en_us/mapfiles/ms/micons/' + color + '-dot.png'));
	marker.setClickable(true);
	marker.setMap(window.map);
	google.maps.event.addListener(marker, 'click', function () {
		if (window.infoWindow) window.infoWindow.close();
		window.infoWindow = new google.maps.InfoWindow({
			content: htmlContent
		});
		document.getElementById('markerContent').className = '';
		document.getElementById('markerContent').innerHTML = htmlContent;
		window.map.panTo(marker.position);
		if (window.map.getZoom() < 13) window.map.setZoom(13);
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
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			callback(xhr.responseXML)
		}
	};
	xhr.open("GET", url, true);
	xhr.send(null)
}

function ajaxText(callback, url) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			callback(xhr.responseText)
		}
	};
	xhr.open("GET", url, true);
	xhr.send(null)
}

function addPOI(xml) {
	var root = xml.childNodes[0];
	var nodes = root.childNodes;
	for (i = 0; i < nodes.length; i++) {
		if (nodes[i].getElementsByTagName('x_long').length > 0 && nodes[i].getElementsByTagName('y_lat').length > 0) {
			var xlong = parseFloat(nodes[i].getElementsByTagName('x_long')[0].firstChild.textContent);
			var ylat = parseFloat(nodes[i].getElementsByTagName('y_lat')[0].firstChild.textContent);
			if (xlong != null && ylat != null) {
				var latlng = new google.maps.LatLng(ylat, xlong);
				var name = nodes[i].getElementsByTagName('name')[0].firstChild.textContent;
				var htmlContent = '<h3 style="text-align:center">' + name + '</h3>';
				if (nodes[i].getElementsByTagName('summary').length > 0) {
					var info = nodes[i].getElementsByTagName('summary')[0].firstChild.textContent;
					htmlContent += '<p>' + info + '</p>'
				}
				if (nodes[i].getElementsByTagName('category').length > 0) {
					var type = nodes[i].getElementsByTagName('category')[0].firstChild.textContent;
					htmlContent += '<br/><b>Catégorie : </b>' + type
				}
				if (nodes[i].getElementsByTagName('address').length > 0) {
					var address = nodes[i].getElementsByTagName('address')[0].firstChild.textContent;
					htmlContent += '<br/><b>Adresse : </b>' + address
				}
				if (nodes[i].getElementsByTagName('url').length > 0) {
					var url = nodes[i].getElementsByTagName('url')[0].firstChild.textContent;
					htmlContent += '<br/><a href="' + url + '">Site web</a>'
				}
				if (nodes[i].getElementsByTagName('img_url').length > 0) {
					var img = nodes[i].getElementsByTagName('img_url')[0].firstChild.textContent;
					htmlContent += '<br/><img alt="Image" src="' + img + '"/>'
				}
				addMarker(latlng, name, htmlContent, 'green')
			}
		}
	}
}

function loadDirections(destination) {
	if (window.mode == null) window.mode = google.maps.TravelMode.DRIVING;
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
	directionsService.route(directionsRequest, function (resultDirections, statusCodeDirections) {
		if (statusCodeDirections === google.maps.DirectionsStatus.OK) window.directionsRenderer.setDirections(resultDirections);
		else console.log(resultDirections)
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
	var regexAlsace = new RegExp("alsace", "ig");
	var regexCanada = new RegExp("canada", "ig");
	var easterEgg = regexAlsace.test(window.searchAddress) ? 'alsace' : null;
	if (easterEgg == null) easterEgg = regexCanada.test(window.searchAddress) ? 'canada' : null;
	window.geocoder.geocode({
		'address': window.searchAddress
	}, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			window.currentPosition = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
			displayPOI()
		} else console.log("La géolocalisation de votre adresse n'a pu etre effectue pour la raison suivante: " + status)
	});
	if (easterEgg != null) document.body.className = easterEgg
}