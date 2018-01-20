let keystone = require('keystone');
let moment = require('moment');

let __customer = keystone.list('Customer');
let __distinctEvent = keystone.list('DistinctEvent');
let __targetAudience = keystone.list('TargetAudience');

exports = module.exports = (req, res) => {

	if(req.body.filterName) {
		__targetAudience.model.findOne({name: req.body.filterName}).exec((error, response) => {
			if(error) {
				res.send({error: 'error message'});
			} else {
				res.send(response)
			}
		})
	} else {
		res.send({error: 'error message'});
	}
	
}