View = require 'views/base/view'
template = require 'views/templates/banner_item'
mediator = require 'mediator'
module.exports = class BannerItem extends View
	template: template
	autoRender: true
	tagName: "tr"
	initialize: ->
		@delegate 'click', '.clickable', @openBanner
		@delegate 'click', '.remove', @removeBanner

	openBanner:->
		mediator.publish '!router:route', "/banners/#{@model.id}"

	removeBanner:->

		collection=@model.collection
		@model.bind("remove", ->
			@destroy(success:=>
				alert(model, resp, options))
		)
		collection.remove(@model)

