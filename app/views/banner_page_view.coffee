PageView = require 'views/base/page_view'
template = require 'views/templates/banner_page'
rulesViews =
	time_start: require 'views/rule/date_view'
	time_end: require 'views/rule/date_view'
	hours: require 'views/rule/hours_view'
	days: require 'views/rule/days_view'
	countries:require 'views/rule/countries_view'
	platforms:require 'views/rule/platforms_view'
	vendor:require 'views/rule/platforms_view'
	price:require 'views/rule/platforms_view'
	counter:require 'views/rule/platforms_view'

module.exports = class BannerPageView extends PageView
	template: template
	container: '#page-container'
	autoRender: true
	events:
		"click #add_rule_button a": "addRule"

	initialize: ->
		super
		@delegate 'click', '.save', @save
		@separateRules()
	save:->
		values=new Array()
		self=@
		serialize =new Array()
		$(@$el.find(".modelInput")).each(	->
			values.push()
			if $(@).val() or $(@).val() is 0
				self.model.set($(@).attr("name"),$(@).val())
		)
		for otherName, otherView of @subviewsByName
			result=otherView.saveRule()
			serialize.push("#{otherName}:#{result}")
		$("#serialized").html(serialize.join(";"))
		$(".serialized").show()
		@model.set("rules",null)
		@model.save()
	cancel:->

	afterRender:->
		super
		@renderSubviews()
		$( "#accordion" ).accordion({
			header:"h3"
			heightStyle:"content"
		});
	separateRules:->
		rules=_.extend({}, @model.attributes)
		#create separate property for rules in model
		delete rules.rules
		delete rules.id
		delete rules.name
		delete rules.price
		delete rules.vendor
		delete rules.counter
		@model.set("rules",rules)
	renderSubviews:->
		rules=@model.get("rules")
		_.each(rules,(value,ruleId)=>
			if value?
				@subview ruleId, new rulesViews[ruleId]
					autoRender: yes
					new: true if value is "-"
					containerMethod: 'append'
					className: "rule #{ruleId}"
					rule:ruleId
					model: @model
					container: $("#accordion")
		)
	addRule:(e)->
		el=$(e.currentTarget)
		ruleId=el.attr("href").substring(1)
		if !@model.get(ruleId)?
			@model.set(ruleId,'-');
		@separateRules()
		@render()


		false
