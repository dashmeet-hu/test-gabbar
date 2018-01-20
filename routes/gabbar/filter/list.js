let keystone = require('keystone');
let moment = require('moment');

let __customer = keystone.list('Customer');
let __distinctEvent = keystone.list('DistinctEvent');
let __targetAudience = keystone.list('TargetAudience');

exports = module.exports = (req, res) => {
	console.log(req.body)

	__targetAudience.model.find({}).exec((error, response) => {
		if(error) {
			res.send({error: 'error message'});
		} else {

			if(response) {
				response = response.map(eachFilter => eachFilter.name);
			}

			res.send({filters: response})
		}
	})
}