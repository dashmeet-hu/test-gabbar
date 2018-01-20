var keystone = require('keystone');
var moment = require('moment');

var __campaign = keystone.list('Campaign')
exports = module.exports = (req, res) => {

	var view = new keystone.View(req, res);

	__campaign.model.find({}).exec((error, campaigns) => {
		if(error) {
			console.error('error');
			res.send({error: 'error message'});
		} else {

			if(campaigns){
				campaigns = campaigns.map(campaign => {
					console.log(moment(campaign.updatedOn).fromNow())
					campaign._doc.updatedOn = moment(campaign._doc.updatedOn).fromNow();

					return campaign._doc;
				})
			}

			console.log(campaigns)

			if(req.method === 'GET') {
				view.render('campaigns', {noKeystone: true, campaigns: campaigns});
			}

			if(req.method === 'POST') {
				res.send({campaigns: campaigns});
			}
			
		}
	})
	
}