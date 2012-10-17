View = require 'views/base/view'
template = require 'views/templates/rule/date'

module.exports = class dateView extends View
	template: template
	initialize: ->
		super
		@data=inputs: @defaults
		@on 'addedToDOM', =>
			@$el.find(".datepicker").datetimepicker({
				altField: "#alt_example_4_alt",
				altFieldTimeOnly: false
				defaultDate:@model.get(@options.rule)*1000
			});
	saveRule:->
		date=@$el.find(".datepicker").datetimepicker("getDate").getTime() / 1000
		@model.set(@options.rule,date)
		@model.set("rules",null)
		@model.save();

	getTemplateData: ->
		@data
