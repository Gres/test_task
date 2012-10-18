View = require 'views/base/view'
template = require 'views/templates/rule/hours'

module.exports = class hoursView extends View
	template: template

	initialize: ->
		super
		@defaults=new Array
		for x in [1..24]
			y = new Object
			y.name=x
			y.checked=null
			@defaults.push(y)
		if !@options.new
			array=@model.get(@options.rule).split(",")
			_.each(array, (val,key)	=>
				if array[key] is '1'
					@defaults[key].checked=true
			)

		@data=
			inputs: @defaults
			title: @options.rule
		@on 'addedToDOM', =>
			$("#hoursInputs").buttonset();
	saveRule:->
		values= new Array()
		$(@$el.find("input")).each(	->
			if $(@).is(':checked')
				values.push(1)
			else
				values.push(0)
		)

		@model.set(@options.rule,values.join())
		@model.set("rules",null)
		@model.save();
		values.join()

	getTemplateData: ->
		@data
