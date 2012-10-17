View = require 'views/base/view'
template = require 'views/templates/rule/platforms'

module.exports = class platformsView extends View
	template: template
	defaults:[
		{
			name:"linux"
			checked:null
		},
		{
			name:"mac"
			checked:null
		},
		{
			name:"win"
			checked:null
		}
	]
	events:
		"click .save": "saveRule"
		"click .cancel": "cancel"
	initialize: ->
		super
		if !@options.new
			array=@model.get(@options.rule).split(",")
			console.info(@defaults)
			_.each(array,(val)=>
				_.each(@defaults,(defval)=>
					if @defaults[defval].name=val
						@defaults[defval].checked=true
			)
			@data ={
				inputs: @defaults
			}


	saveRule:->
		console.info()
		values= new Array()
		$(@$el.find("input:checked")).each(	->
			values.push($(@).val())
		)
		@model.set(@options.rule,values.join())
		@model.set("rules",null)
		@model.save()

	getTemplateData: ->
		@data;
	cancel:->
