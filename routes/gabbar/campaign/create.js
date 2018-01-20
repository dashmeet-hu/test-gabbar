var keystone = require('keystone')
var __campaign = keystone.list('Campaign');
var __targetAudience = keystone.list('TargetAudience');

var Cron = require('./startCron.js').Cron;

exports = module.exports = (req, res) => {
	if(req.body){

		__targetAudience.model.findOne({name: req.body.targetAudience}).exec((error, targettedAudience) => {
			if(error) {
				console.error(error.message);
				res.status(500).send({error: 'error message'});
				return;
			}

			let newCampaign = new __campaign.model(req.body);

			newCampaign.targetAudience = targettedAudience._id;
			newCampaign.createdOn = Date.now();
			newCampaign.updatedOn = Date.now();
			newCampaign.save((error, savedCampaign) => {
				if(error){
					console.error(error.message);
					res.status(500).send({error: 'error message'});
					return
				}

				res.send({campaign: savedCampaign._doc});

				let cron = new Cron(savedCampaign._doc);
				cron.start();
			})
		})
	}
}