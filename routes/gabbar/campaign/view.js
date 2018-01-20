let keystone = require('keystone');

let moment = require('moment');
let useragent = require('useragent');

let __campaign = keystone.list('Campaign');
let __distinctEvent = keystone.list('DistinctEvent');

exports = module.exports = (req, res) => {
		// var view = new keystone.View(req, res);
		// __customer.model.findOne({customerId: req.params.customerId})
		// .populate('events')
		// .exec((error, response) => {
			
		// 	response.noKeystone = true;
		// 	view.render('userProfile', response);
		// });
	}