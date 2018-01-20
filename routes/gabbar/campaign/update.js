let keystone = require('keystone');

let moment = require('moment');
let useragent = require('useragent');

var cronJobs = require('./startCron.js').cronJobs;

let __campaign = keystone.list('Campaign');
let __targetAudience = keystone.list('TargetAudience');

exports = module.exports = (req, res) => {
	
	__targetAudience.model.findOne({name: req.body.targetAudience}).exec((error, targettedAudience) => {
		if(error) {
			console.error(error.message);
			res.status(500).send({error: 'error message'});
			return;
		}

		req.body.targetAudience = targettedAudience._id;
		req.body.updatedOn = Date.now();

		console.log(req.body);

		__campaign.model.update({name: req.body.name}, req.body, (error, result) => {
			if(error) {
				console.log(error)
				res.status(500).send({error: 'error message'});
			} else {

				__campaign.model.findOne({name: req.body.name}).exec((error, campaign) => {
					// console.log(cronJobs[campaign.name]);
					cronJobs[campaign.name].update(campaign._doc);
				})
				console.log('updated: ', result);
				res.send({success: true})
			}
		})
	})

	
}