Model = require 'models/base/model'
module.exports = class Banner extends Model
	defaults:
		time_start: null
		time_end: null
		hours: null
		countries: null
		platforms: null
		vendor: null
		counter: 0
		price: 0

