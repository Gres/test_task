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
	initialize: ->
		super
		if !@options.new
			array=@model.get(@options.rule).split(",") if @model.get(@options.rule)
			_.each(array, (val)	=>
				_.each(@defaults,(defval,defkey)=>
					if @defaults[defkey].name is val
						@defaults[defkey].checked=true
				)
			)

		@data=
			inputs: @defaults
			title: @options.rule
		@on 'addedToDOM', =>
			$("#platformsInputs").buttonset();
	saveRule:->
		values= new Array()
		$(@$el.find("input:checked")).each(	->
			values.push($(@).val())
		)
		@model.set(@options.rule,values.join())
		@model.set("rules",null)
		@model.save();
		values.join()
	getTemplateData: ->
		@data
