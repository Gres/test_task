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
		@separateRules()
	afterRender:->
		super
		@renderSubviews()
	separateRules:->
		rules=_.extend({}, @model.attributes)
		#create separate property for rules in model
		delete rules.rules
		delete rules.id
		delete rules.name
		@model.set("rules",rules)
	renderSubviews:->
		rules=@model.get("rules")
		_.each(rules,(value,ruleId)=>
			if value?
				@subview ruleId, new rulesViews[ruleId]
					autoRender: yes
					new: true if value is "-"
					containerMethod: 'html'
					className: "well rule #{ruleId}"
					rule:ruleId
					model: @model
					container: $("#rules_nav_#{ruleId}")
		)
	addRule:(e)->
		el=$(e.currentTarget)
		ruleId=el.attr("href").substring(1)
		if !@model.get(ruleId)?
			@model.set(ruleId,'-');
		@separateRules()
		@render()

		$("#ruletabs a[href='#rules_nav_#{ruleId}']").tab('show');
		false
