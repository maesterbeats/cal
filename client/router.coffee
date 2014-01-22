###=========================================
									router.coffee
=========================================###
Router.configure
	autoRender: false
	layoutTemplate: 'layout'
	notFoundTemplate: 'notFound'
	loadingTemplate: 'loading'

Router.map ->
	
	############## HOME ################
	@route 'home',
		path: '/'
		template: 'home'
	

	
	############## PROFILE ##############
	@route 'profile',
		path: '/profile/:_id'
		data: ->


	############## CALENDAR ##############
	
	@route 'calendar',
		path: '/calendar'
		template: 'cal'