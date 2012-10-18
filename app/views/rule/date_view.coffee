View = require 'views/base/view'
template = require 'views/templates/rule/date'

module.exports = class dateView extends View
	template: template
	initialize: (options)->
		super
		if @model.get(options.rule) isnt "-"
			dd=new Date(@model.get(options.rule)*1000)
		else
			dd=new Date()
		@data=
			inputs: @defaults
			title: @options.rule
		@on 'addedToDOM', =>

			@$el.find(".datepicker").datetimepicker({
				altField: "#alt_example_4_alt",
				altFieldTimeOnly: false
				defaultDate:dd
				hour:dd.getHours()
				minute:dd.getMinutes()

			});
	saveRule:->
		date=@$el.find(".datepicker").datetimepicker("getDate").getTime() / 1000
		@model.set(@options.rule,date)
		@model.set("rules",null)
		@model.save();

	getTemplateData: ->
		@data
