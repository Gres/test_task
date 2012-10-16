Controller = require 'controllers/base/controller'
mediator = require 'mediator'
Banners = require 'models/banners'

module.exports = class StorageController extends Controller
	initialize: ->
		super
		@collection = new Banners()
		@collection.fetch()
		mediator.banners = @collection

