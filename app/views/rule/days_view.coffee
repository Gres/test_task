View = require 'views/base/view'
template = require 'views/templates/rule/days'

module.exports = class daysView extends View
	template: template
	defaults:[
		{
		name:"Mon"
		checked:null
		},
		{
		name:"Tue"
		checked:null
		},
		{
		name:"Wed"
		checked:null
		},
		{
		name:"Thu"
		checked:null
		},
		{
		name:"Fri"
		checked:null
		},
		{
		name:"Sat"
		checked:null
		},
		{
		name:"Sun"
		checked:null
		}
	]
	initialize: ->
		super

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
			$("#daysInputs").buttonset();
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
