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
			_.each(array, (val,key)	=>
				if array[key] is '1'
					@defaults[key].checked=true

			)

		@data=
			inputs: @defaults
			title: @options.rule
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
		values.join()
	getTemplateData: ->
		@data
