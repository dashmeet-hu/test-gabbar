/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

pug = require('pug');
var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	gabbar: importRoutes('./gabbar'),
};

var __campaign = keystone.list('Campaign');
var Cron = require('./gabbar/campaign/startCron.js').Cron;


// Setup Route Bindings
exports = module.exports = function (app) {
	// Views

	app.post('/login', routes.gabbar.generalRoutes.login);
	app.post('/logout', routes.gabbar.generalRoutes.logout);
	app.post('/register', routes.gabbar.generalRoutes.register);

	
	app.get('/landing', routes.gabbar.generalRoutes.app);
	app.get('/getLoggedInUserId', routes.gabbar.generalRoutes.getLoggedInUserId);

	app.post('/filter', routes.gabbar.filter.create);
	app.post('/filter/save', routes.gabbar.filter.save);
	app.post('/filter/update', routes.gabbar.filter.update);
	app.post('/filter/list', routes.gabbar.filter.list);
	app.post('/filter/getFilter', routes.gabbar.filter.getFilter);

	app.post('/campaigns/create', routes.gabbar.campaign.create);
	app.post('/campaigns/update', routes.gabbar.campaign.update);
	app.post('/campaigns/list', routes.gabbar.campaign.campaigns);
	app.post('/campaigns/getCampaign', routes.gabbar.campaign.getCampaign)

	app.get('/campaigns/view/:campaignName', routes.gabbar.campaign.view);
	app.get('/campaigns', routes.gabbar.campaign.campaigns);

	app.post('/templates/list', routes.gabbar.template.list);

	app.get('/users', routes.views.users);
	app.get('/users/view/:customerId', routes.gabbar.getUserProfile);

	app.get('/sambha/track.png', routes.gabbar.track);
	app.get('/', routes.views.index);


	__campaign.model.find({}).exec((error, campaigns) => {
		if(campaigns && !error) {
			campaigns.forEach(campaign => {
				let cron = new Cron(campaign._doc);
				// startCron.initialize(campaign._doc);
				cron.start();
			})
		}
	})

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};