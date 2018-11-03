const api = {
	search(keyword, cb) {
		axios.get(`/weather.php?command=search&keyword=${keyword}`).then(response => {

			if (response.status !== 200) {
				return cb(response);
			}

			if (response.data.error) {
				return (response.data.error);
			}

			let city = response.data[0] || null;

			return cb(null, city);
		});
	},

	location(woeid, cb) {
		axios.get(`/weather.php?command=location&woeid=${woeid}`).then(response => {

			if (response.status !== 200) {
				return cb(response);
			}

			if (response.data.error) {
				return (response.data.error);
			}

			return cb(null, response.data);

		}).catch(res => {
			cb(res.response.data);
		});
	}
};

export default api;