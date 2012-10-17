CollectionView = require 'views/base/collection_view'
Banner = require 'views/banner_item'
template = require 'views/templates/banners'
createFormView = require 'views/banner_new_view'
module.exports = class BannersView extends CollectionView
	itemView: Banner
	template: template
	listSelector: '#bannersPH'
	container: '#page-container'
	autoRender: true
	events:
		"click #createBanner": "showCreateForm"
	removeBanner:(e)->

	showCreateForm:->
		@subview 'createForm', new createFormView
			autoRender: yes
			containerMethod: 'after'
			className: "well"
			collection: @collection
			model: @model
			id: "createForm"
			container: $("#createBanner")