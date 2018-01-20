let keystone = require('keystone');

let moment = require('moment');
let useragent = require('useragent');

let __customer = keystone.list('Customer');
let __distinctEvent = keystone.list('DistinctEvent');

exports = module.exports = (req, res) => {
		var view = new keystone.View(req, res);
		__customer.model.findOne({customerId: req.params.customerId})
		.populate('events')
		.exec((error, response) => {
			
			let custom = {};

			custom.groupedByDate = _.chain(response.events).orderBy('timestamp', 'desc').groupBy((event) => {
				return moment(Number(event.timestamp)).format('dddd, MMMM Do, YYYY')
			}).value();

			custom.getTime = function (timestamp) {
				return moment(Number(timestamp)).format('hh:mm:ss A');
			}
			custom.getUserAgent = function (userAgentString) {
				return useragent.parse(userAgentString).toAgent();
			}
			custom.getTimeFromNow = function (timestamp) {
				return moment(Number(timestamp)).fromNow();
			}

			response.custom = custom;
			response.noKeystone = true;

			// response.helperFunctions = helperFunctions;
			view.render('userProfile', response);	
		});
	}