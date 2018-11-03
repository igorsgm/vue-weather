import {map as asyncMap, waterfall} from 'async';
import api from './api';

export function getCity(keyword, cb) {

	let cities = store('cities') || [];

	cities = cities.filter(city => city);

	//search city in storage
	let city = cities.find(city => {
		return city.title.toLowerCase() === keyword.toLowerCase();
	});

	if (city) {
		return cb(null, city);
	}

	api.search(keyword, (err, city) => {
		if (err) return cb(err);

		//save to local storage
		cities.push(city);
		store('cities', cities);

		cb(null, city);
	});

}

export function getWeather(woeid, cb) {
	const key   = 'weather-' + woeid;
	let weather = store(key);

	if (weather) {
		return cb(null, weather);
	}

	api.location(woeid, function (err, weather) {
		if (err) return cb(err);

		//save to local storage for 1 minute
		store(key, weather, 60);

		cb(null, weather);
	});
}

export function getWeathers(keywords, cb) {

	waterfall([
		cb => {
			asyncMap(keywords, (keyword, cb) => {
				getCity(keyword, cb);
			}, cb);
		},

		(cities, cb) => { //removing  empty cities
			cities = cities.filter(city => city);
			cb(null, cities);
		},

		(cities, cb) => {
			asyncMap(cities, (city, cb) => {
				getWeather(city.woeid, (err, weather) => {
					if (err) return cb(err);
					cb(null, weather);
				});
			}, cb);
		}
	], cb);

}