module.exports = (match) ->
	match '', 'banners#index'
	match 'banners', 'banners#index'
	match 'banners/:id', 'banners#banner'
