class CDSMap extends API {

	constructor(elementID, location = {lat: 53.7990, lng: -1.5387}, zoom = 5) {
		super();
		this.elementID	= elementID;
		this.element	= document.getElementById(this.elementID);
		this.location	= location;
		this.zoomLevel	= zoom;
	}

	initMap() {
		this.setMap();
		this.setMarker();
		this.setDetails();
		
		this.map.addListener('click', (e) => {
			this.removeMarker();
			this.setMarker(e.latLng);
			this.setDetails(e.latLng.lat(), e.latLng.lng());
		});
	}

	setMap(zoomLevel = this.zoomLevel, location = this.location) {
		this.map = new google.maps.Map(this.element, {
			zoom: zoomLevel, 
			center: location,
			mapTypeControl: false,
		});
	}

	get getMap() {
		return this.map;
	}

	setMarker(location = this.location) {
		this.marker = new google.maps.Marker({
			position: location, 
			map: this.getMap
		});

		this.getMap.setOptions({
			center: location
		});
	}

	get getMarker() {
		return this.marker;
	}

	removeMarker() {
		this.getMarker.setMap(null);
	}

	setDetails(lat = this.location.lat, lng = this.location.lng) {
		var panel = document.getElementById('cds-details');
			panel.innerHTML = '<div class="cds-loading"></div>';

		this.getData(lat, lng).then((response) => {
			panel.innerHTML = '';
			if(response.status=="OK") {

				let descriptor = document.createElement('div');
					descriptor.id = `cds-descriptor`;
					descriptor.className = 'cds-detail';
					descriptor.innerHTML = `<h2 class="cds-detail-title">Please note</h2>`;

				if(this.isDark(response)) {
					this.setNightMap();
					descriptor.innerHTML = `<h2 class="cds-detail-title">It is currently dark</h2>`;

				} else {
					this.removeNightMap();
					descriptor.innerHTML = `<h2 class="cds-detail-title">It is currently Light</h2>`;
				}

				panel.appendChild(descriptor);

				
				var detail = document.createElement('div');
					detail.id = `cds-info`;
					detail.className = 'cds-detail';
					detail.innerHTML = `<h2 class="cds-detail-title">Please note</h2><p class="cds-detail-content">The map will change to Dark/Light mode depending on the sunrise and sunset times of your chosen location.</p>`;
				panel.appendChild(detail);
				
				var results = response.results;
				for (var prop in results) {
					let title = prop.replace(/_/g, " ");
					let date = this.convertToLocalDate(results[prop]);
					if(prop == "day_length") date = results[prop];
					let detail = document.createElement('div');
						detail.id = `cds-${prop}`;
						detail.className = 'cds-detail';
						detail.innerHTML = `<h2 class="cds-detail-title">${title}</h2><p class="cds-detail-content">${date}</p>`;
					panel.appendChild(detail)
				}
			} else {
				alert("We got an error from the API");
			}
		}).catch((err) => {
			console.error(err);
			alert("Can't get data");
		});
	}

	setNightMap() {
		this.getMap.setOptions({
			styles: [
				{elementType: 'geometry', stylers: [{color: '#242f3e'}]},
				{elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
				{elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
				{
					featureType: 'administrative.locality',
					elementType: 'labels.text.fill',
					stylers: [{color: '#d59563'}]
				},
				{
					featureType: 'poi',
					elementType: 'labels.text.fill',
					stylers: [{color: '#d59563'}]
				},
				{
					featureType: 'poi.park',
					elementType: 'geometry',
					stylers: [{color: '#263c3f'}]
				},
				{
					featureType: 'poi.park',
					elementType: 'labels.text.fill',
					stylers: [{color: '#6b9a76'}]
				},
				{
					featureType: 'road',
					elementType: 'geometry',
					stylers: [{color: '#38414e'}]
				},
				{
					featureType: 'road',
					elementType: 'geometry.stroke',
					stylers: [{color: '#212a37'}]
				},
				{
					featureType: 'road',
					elementType: 'labels.text.fill',
					stylers: [{color: '#9ca5b3'}]
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry',
					stylers: [{color: '#746855'}]
				},
				{
					featureType: 'road.highway',
					elementType: 'geometry.stroke',
					stylers: [{color: '#1f2835'}]
				},
				{
					featureType: 'road.highway',
					elementType: 'labels.text.fill',
					stylers: [{color: '#f3d19c'}]
				},
				{
					featureType: 'transit',
					elementType: 'geometry',
					stylers: [{color: '#2f3948'}]
				},
				{
					featureType: 'transit.station',
					elementType: 'labels.text.fill',
					stylers: [{color: '#d59563'}]
				},
				{
					featureType: 'water',
					elementType: 'geometry',
					stylers: [{color: '#17263c'}]
				},
				{
					featureType: 'water',
					elementType: 'labels.text.fill',
					stylers: [{color: '#515c6d'}]
				},
				{
					featureType: 'water',
					elementType: 'labels.text.stroke',
					stylers: [{color: '#17263c'}]
				}
			]
		});
	}

	removeNightMap() {
		this.getMap.setOptions({
			styles: []
		});
	}

}