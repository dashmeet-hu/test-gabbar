let keystone = require('keystone');
let moment = require('moment');

let __customer = keystone.list('Customer');
let __distinctEvent = keystone.list('DistinctEvent');
let __targetAudience = keystone.list('TargetAudience');

exports = module.exports = (req, res) => {
	if(req.body.name && req.body.filters.length !== 0) {

		__targetAudience.model.update({name: req.body.name}, {$set: {filters: req.body.filters}}).exec((error, response) => {
			if(error) {
				res.send({error: 'error message'});
			} else {
				res.send({success: 'done'});
			}
		})
		
	} else {
		res.send({error: 'error message'});
	}
}