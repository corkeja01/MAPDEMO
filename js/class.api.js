class API {

	constructor(url = 'https://api.sunrise-sunset.org/json?') {
		this.url = url;
	}

	get getUrl() {
		return this.url;
	}

	async getData(lat, lng, method = 'get') {
		if(!lng) alert('Required Field "lng" Missing');
		if(!lat) alert('Required Field "lat" Missing');

		let response = await fetch(`${this.url}lat=${lat}&lng=${lng}&formatted=0`, {
			method: method,
			mode: 'cors'
		});
		if (response.ok) return await response.json();
		throw new Error(response);
	}

	convertToLocalDate(ISOdate) {
		try {
			var date = new Date(ISOdate);
			date.toLocaleString();
			return date;
		} catch(e) {
			alert('Date could not convert');
		}
	}

	isDark(response) {
		var current = this.convertToLocalDate(new Date()); 
		var results = response.results;

		var sunrise = this.convertToLocalDate(results.sunrise);
		var sunset = this.convertToLocalDate(results.sunset);

		if(current >= sunrise && current < sunset) {
			return false;
		} else {
			return true;
		}
	}

}