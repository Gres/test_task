View = require 'views/base/view'
template = require 'views/templates/banner_item'

module.exports = class BannerItem extends View
	template: template
	autoRender: true

collectionView