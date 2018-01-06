var keystone = require('keystone');

exports = module.exports = function (req, res) {
	var Event = keystone.list('Event');
	var Customer = keystone.list('Customer');
	var AnonUser = keystone.list('AnonUser');


	var isAnonSession = req.query.isAnonSession;
	var id = req.query.id;
	var anonId = req.query.anonId;
	var eventToTrack = req.query.eventToTrack;
	var timeStamp = req.query.timestamp;
	var referrer = req.query.referrer;
	var trackedData = JSON.parse(req.query.params);

	var userQuery = isAnonSession === 'true' ? AnonUser.model.findOne({anonId: id}) : Customer.model.findOne({customerId: id});

	var insertEvent = function (cb) {
		var newEvent = Event.model({
			eventName: eventToTrack,
			timeStamp: timeStamp,
			referrer: referrer ? referrer : 'Direct',
			data: trackedData
		});
		userQuery.exec((error, linkedUser) => {
			if(error){
				return cb(error, null);
			}

			if(linkedUser){
				newEvent.user = linkedUser._id;
				newEvent.save();
				return cb(null, newEvent);
			}

			insertAnonUser(id, (error, insertedUser) => {
				newEvent.user = insertedUser._id;
				newEvent.save();
				return cb(null, newEvent);
			});
		});
	}

	var insertAnonUser = function (id, cb) {
		var newAnonUser = AnonUser.model({
			anonId: id
		})
		newAnonUser.save();
		userQuery = AnonUser.model.findOne({anonId: id});
		return cb(error, newAnonUser);
	}

	var linkAnonEventsToCustomer = function (insertedEvent, cb) {
		AnonUser.model.findOne({anonId: anonId}).exec((err, anonymousUser) => {
				Event.model.update({user: anonymousUser._id}, { $set: {user: insertedEvent.user}}, {multi: true}, (error, event) => {
					if (error) {
						return cb(error, null);
					}
					return cb(null, true);
				})
		});
	}


	insertEvent((error, insertedEvent) => {
		// after successful insertion of event, check if event was login or register?
		if(insertedEvent.eventName === 'Login') {
			linkAnonEventsToCustomer(insertedEvent)
		}	
	});

	

	res.send('');
};