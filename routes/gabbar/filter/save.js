let keystone = require('keystone');
let moment = require('moment');

let __customer = keystone.list('Customer');
let __distinctEvent = keystone.list('DistinctEvent');
let __targetAudience = keystone.list('TargetAudience');

exports = module.exports = (req, res) => {
	if(req.body.name && req.body.filters.length !== 0) {

		__targetAudience.model.findOne({name: req.body.filterName}).exec((error, response) => {
			if(error) {
				res.send({error: 'error message'});
			} else {
				if(response) {
					res.send({error: 'filter with same name already exists'});
				} else {
					let newFilter = new __targetAudience.model({
						name: req.body.name,
						filters: req.body.filters
					})

					newFilter.save((error, savedFilter) => {
						if (error) {
							res.send({error: 'error message'});		
						} else {
							res.send({success: 'success'});	
						}
					})
				}
			}
		})
		
	} else {
		res.send({error: 'error message'});
	}
}