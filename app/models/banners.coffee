Collection = require 'models/base/collection'
Banner = require 'models/banner'

module.exports = class Banners extends Collection
	localStorage: new Backbone.LocalStorage("Banners"),
	model: Banner
