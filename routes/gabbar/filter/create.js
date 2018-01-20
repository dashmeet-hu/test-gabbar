let keystone = require('keystone');
let moment = require('moment');

let __customer = keystone.list('Customer');
let __distinctEvent = keystone.list('DistinctEvent');

exports = module.exports = (req, res) => {

		if(req.body.applyFilter === true) {

			let filterList = req.body.filters.map(filter => {
				let filterObject = { 'events.isAnon': false };
				if(filter.eventName) {
					filterObject['events.eventname'] = filter.eventName;
				}

				if(filter.traitKey && filter.traitValue) {
					filterObject[`events.details.${filter.traitKey}`] = filter.traitValue;
				}

				if(filter.occurenceKey && filter.occurenceValue && filter.occurenceUnit) {

					let multiplier = 0;

					switch (filter.occurenceUnit) {
						case 'Minutes':
							multiplier = 60*1000; 
							break;
						case 'Hours':
							multiplier = 60*60*1000;
							break;
						case 'Days':
							multiplier = 24*60*60*1000;
							break;

						default:
							break;
					}

					filterObject['events.timestamp'] = {};
					
					switch(filter.occurenceKey) {
						case 'before':
							filterObject['events.timestamp']['$lte'] = `${Date.now() - (filter.occurenceValue * multiplier)}`;
							break;
						case 'after': 
							filterObject['events.timestamp']['$gte'] = `${Date.now() - (filter.occurenceValue * multiplier)}`;
							break;

						case 'not after':
							filterObject['events.timestamp']['$not'] = {};
							filterObject['events.timestamp']['$not']['$gte'] = `${Date.now() - (filter.occurenceValue * multiplier)}`;
							break;

						case 'in range':
							filterObject['events.timestamp']['$gte'] = `${new Date(filter.occurenceRangeStart).getTime()}`;
							filterObject['events.timestamp']['$lte'] = `${new Date(filter.occurenceRangeEnd).getTime()}`;
							break;

						case 'not in range':
							filterObject['events.timestamp']['$not'] = {};
							filterObject['events.timestamp']['$not']['$gte'] = `${new Date(filter.occurenceRangeStart).getTime()}`;
							filterObject['events.timestamp']['$not']['$lte'] = `${new Date(filter.occurenceRangeEnd).getTime()}`;
							break;

						default:
							break;
					}
				}

				console.log('filter object :::: ', filterObject);
				return filterObject;

			})

			if(filterList.length === 0){
				filterList.push({});
			}

			console.log('filterObject: ', filterList);
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
				
				console.log(result);
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