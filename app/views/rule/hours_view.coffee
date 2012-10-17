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
			_.each(array, (val)	=>
				_.each(@defaults,(defval,defkey)=>
					if @defaults[defkey].name is 1
						@defaults[defkey].checked=true
				)
			)
		@data=inputs: @defaults
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

	getTemplateData: ->
		@data
