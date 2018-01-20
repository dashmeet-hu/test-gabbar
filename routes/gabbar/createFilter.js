let keystone = require('keystone');
let moment = require('moment');

var getFilters = require('./getFilters.js');

let __customer = keystone.list('Customer');
let __distinctEvent = keystone.list('DistinctEvent');

exports = module.exports = (req, res) => {

		if(req.body.applyFilter === true) {

			let filterList = getFilters(req.body.filters);

			if(filterList.length === 0){
				filterList.push({});
			}
			__customer.model.aggregate()
			.lookup({
			    from: "events",
			    localField: "events",
			    foreignField: "_id",
			    as: "events"
			})
			.match({$and: filterList})
			.sort({updatedOn: -1})
			.exec((error, response) => {
				if(error) return error;
				response = response.map(customer => {
					customer.updatedOn = moment(Number(customer.updatedOn)).fromNow();
					return customer;
				})

				res.send(response);
			})

		} else {
			let queryObject = req.body.eventName ? {eventName: req.body.eventName} : {};

			__distinctEvent.model.aggregate()
			.match(queryObject)
			.exec((error, result) => {
				let returnObject;

				if (req.body.traitKey && req.body.eventName) {
					returnObject = result[0].traits[req.body.traitKey]
				} else if (req.body.eventName) {
					returnObject = Object.keys(result[0].traits);
				} else {
					returnObject = result.map(r => r.eventName);
				}
				res.send({result: returnObject});
			})
		}
	}