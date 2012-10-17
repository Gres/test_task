Chaplin = require 'chaplin'
require 'lib/view_helper'
# Just load the view helpers, no return value

module.exports = class View extends Chaplin.View
	dispose: ->
		return if @disposed

		# Dispose subviews
		subview.dispose() for subview in @subviews if subview

		# Unbind handlers of global events
		@unsubscribeAllEvents()

		# Unbind all model handlers
		@modelUnbindAll()

		# Remove all event handlers on this module
		@off()

		# Remove the topmost element from DOM. This also removes all event
		# handlers from the element and all its children.
		@$el.remove()

		# Remove element references, options,
		# model/collection references and subview lists
		properties = [
			'el', '$el',
			'options', 'model', 'collection',
			'subviews', 'subviewsByName',
			'_callbacks'
		]
		delete this[prop] for prop in properties

		# Finished
		@disposed = true

		# You’re frozen when your heart’s not open
		Object.freeze? this
# Precompiled templates function initializer.
	getTemplateFunction: ->
		@template
