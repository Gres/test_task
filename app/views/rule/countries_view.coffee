View = require 'views/base/view'
template = require 'views/templates/rule/countries'

module.exports = class countriesView extends View
	template: template
	events:
		"click button": "addCountry"
	initialize: ->
		super
		@defaults=new Array()
		if @model.get(@options.rule) is '-'
			@model.set(@options.rule,null)
		if !@options.new
			array=@model.get(@options.rule).split(",")
			_.each(array, (val)	=>
				@defaults.push(
					name: val
				)
			)
		@delegate 'click', '.icon-trash', @deleteCountry
		@data=
			inputs: @defaults
			title: @options.rule
			countryArr:@model.get(@options.rule)
		@on 'addedToDOM', =>
			@$el.find('select').selectToAutocomplete();

	addCountry:->
		country=@$el.find('.ui-autocomplete-input').val()
		if country is "Select Country"
			return false
		for item in @defaults
			if item.name is country
				return
		if country
			@defaults.push(
				name: country
			)
			val=$("#countyHidden").val()
			if val
				$("#countyHidden").val("#{val},#{country}")
			else
				$("#countyHidden").val("#{country}")
			ul=@$el.find(".countries")
			$(ul).append("<li data-country='#{country}'>#{country}<i class='icon-trash'></i></li>")

	deleteCountry:(e)->
		el=$(e.currentTarget).parent("li")
		country=el.data("country")
		newtxt=new Array()
		for item, index in @defaults
			if item.name is country
				indexToRemove=index
		@defaults.splice(indexToRemove, indexToRemove);
		indexToRemove
		for item, index in @defaults
			newtxt.push(item.name)
		$("#countyHidden").val(newtxt.join())
		el.hide(500).remove()


	saveRule:->
		values=$(@$el.find("#countyHidden")).val()
		@model.set(@options.rule,values)
		@model.set("rules",null)
		@model.save();

	getTemplateData: ->
		@data
