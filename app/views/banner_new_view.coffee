View = require 'views/base/view'
template = require 'views/templates/banner_new'
mediator = require 'mediator'
module.exports = class BannerNewView extends View
	template: template
	events:
		"click .cancel": "closeForm"
		"submit form": "addNewBanner"
	closeForm:->
		@$el.hide(500,=>
			@dispose()
		)
	addNewBanner:->
		name=@$el.find(".name").val()
		@collection.create(
			name:name
		)
		@collection
		false

