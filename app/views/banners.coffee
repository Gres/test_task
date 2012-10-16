CollectionView = require 'views/base/collection_view'
Banner = require 'views/banner_item'
template = require 'views/templates/banners'

module.exports = class BannersView extends CollectionView
	itemView: Banner
	template: template
	listSelector: '#bannersPH'
	container: '#page-container'
	autoRender: true