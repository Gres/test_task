mediator = require 'mediator'
utils = require 'chaplin/lib/utils'

# Application-specific view helpers
# ---------------------------------

# http://handlebarsjs.com/#helpers

# Conditional evaluation
# ----------------------

# Choose block by user login status
Handlebars.registerHelper 'if_logged_in', (options) ->
	if mediator.user
		options.fn(this)
	else
		options.inverse(this)

# Map helpers
# -----------

# Make 'with' behave a little more mustachey
Handlebars.registerHelper 'with', (context, options) ->
	if not context or Handlebars.Utils.isEmpty context
		options.inverse(this)
	else
		options.fn(context)

# Inverse for 'with'
Handlebars.registerHelper 'without', (context, options) ->
	inverse = options.inverse
	options.inverse = options.fn
	options.fn = inverse
	Handlebars.helpers.with.call(this, context, options)

# Evaluate block with context being current user
Handlebars.registerHelper 'with_user', (options) ->
	context = mediator.user or {}
	Handlebars.helpers.with.call(this, context, options)

Handlebars.registerHelper "compare", (lvalue, rvalue, options) ->
	throw new Error("Handlerbars Helper 'compare' needs 2 parameters")  if arguments_.length < 3
	operator = options.hash.operator or "=="
	operators =
		"==": (l, r) ->
			l is r

		"===": (l, r) ->
			l is r

		"!=": (l, r) ->
			l isnt r

		"<": (l, r) ->
			l < r

		">": (l, r) ->
			l > r

		"<=": (l, r) ->
			l <= r

		">=": (l, r) ->
			l >= r

		typeof: (l, r) ->
			typeof l is r

	throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator)  unless operators[operator]
	result = operators[operator](lvalue, rvalue)
	if result
		options.fn this
	else
		options.inverse this

Handlebars.registerHelper "eachProperty", (context, options) ->
	ret = ""
	for prop of context
		ret = ret + options.fn(
			property: prop
			value: context[prop]
		)
	ret
