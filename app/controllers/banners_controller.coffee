Controller = require 'controllers/base/controller'
BannerItem = require 'views/banners'
mediator = require 'mediator'
module.exports = class BannersController extends Controller
	historyURL: 'banners'
	index: ->
		@collection = mediator.banners

		console.info @collection

		@view = new BannerItem(
			collection: @collection
		)

		@collection.add(
			name: "test"
			time_start: null
			time_end: null
			hours: null
			countries: null
			platforms: null
			vendor: null
			counter: null
			price: null
		)