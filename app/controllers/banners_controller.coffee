Controller = require 'controllers/base/controller'
BannerItem = require 'views/banners'
BannerPage = require 'views/banner_page_view'
mediator = require 'mediator'
module.exports = class BannersController extends Controller
	historyURL: 'banners'
	index: ->
		collection = mediator.banners
		@view = new BannerItem(
			collection: collection
		)
		collection.fetch()
	banner:(route)->
		id=route.id
		collection = mediator.banners if !collection
		collection.fetch()#
		model=collection.get(id)
		@view = new BannerPage(
			model: model
		)
