var keystone = require('keystone');
var moment = require('moment');

var __campaign = keystone.list('Campaign')
exports = module.exports = (req, res) => {
	__campaign.model.findOne({name: req.body.name})
	.populate('targetAudience')
	.exec((error, response) => {
		if (error) {
			res.status(500).send({error: 'error message'});
		} else {
			response._doc.targetAudience = response._doc.targetAudience.name;
			res.send({campaign: response._doc});
		}
	})
}