let keystone = require('keystone');

let _ = require('lodash');

let __user = keystone.list('Customer');
let __event = keystone.list('Event');
let __anonuser = keystone.list('AnonUser');
let __distinctevent = keystone.list('DistinctEvent');

let eventRegistrar = {
	isAnonSession: true,
	id: '',
	anonId: '',
	eventDetails: {},
	request: {},
	response: {},

	initiateEventRegistration: function (req, res) {
		this.request = req;
		this.response = res;
		this.storeEventDetailsToLocalVariables(req.query);


		this.registerEvent(this.eventDetails, (error, event) => {
			if(error) return error;

			if (this.isAnonSession) {
				this.findUser(__anonuser, {anonId: this.id}, (error, foundUser) => {

					let user = foundUser;
					if(!user) {
						this.createUser(__anonuser, {anonId: this.id}, (error, createdUser) => {
							if(error) return error;

							this.association({
								userCollection: __anonuser,
								eventCollection: __event,
								user: createdUser,
								event: event
							}, error => {
								if(error) return error;
								return true;
							});
						})
					} else {
						this.association({
							userCollection: __anonuser,
							eventCollection: __event,
							user: user,
							event: event
						}, error => {
							if(error) return error;
							return true;
						});
					}

					
				})
			} else {

				this.findUser(__user, {customerId: this.id}, (error, foundUser) => {
					let user = foundUser;
					this.association({
						userCollection: __user,
						eventCollection: __event,
						user: user,
						event: event
					}, error => {
						if(error) return error;

						if (this.eventDetails.eventname == 'Login' || this.eventDetails.eventname == '_Register') {
							
							__anonuser.model.findOne({anonId: this.anonId})
							.exec((error, linkedAnonUser) => {
								if(linkedAnonUser) {
									this.associateAnonUserToRegisteredUser(user, linkedAnonUser, event, (error) => {
										if(error) return error;

										__anonuser.model.remove({anonId: this.anonId}, (error, success) => {
										});

									});
								}
							})
						}
					});
				});
			}
		});
		res.send({});
	},

	associateAnonUserToRegisteredUser: function (user, linkedAnonUser, event, callback) {
		let eventsLinkedToRegisteredUser = new Promise((resolve, reject) => {
			__user.model.update(
				{_id: user._id},
				{$addToSet: {events: {$each: linkedAnonUser.events.toBSON()}}},
				(error, success) => {
					if(error) reject(error);
					resolve(error);
				}
			);
		});

		let referenceToRegisteredUserInEvent = new Promise((resolve, reject) => {
			__event.model.update(
				{anonuser: linkedAnonUser._id},
				{$unset: {anonuser: ''}, $set: {registereduser: user._id}},
				{multi: true}, 
				(error, success) => {
					if (error) reject(error);
					resolve(error);
					
				}
			);
		});

		Promise.all([eventsLinkedToRegisteredUser, referenceToRegisteredUserInEvent])
		.then(resolvedPromises => {
			return callback(null);
		})
		.catch(error => {
			return callback(error);
		})
	},

	storeEventDetailsToLocalVariables : function (eventDetails) {
		this.isAnonSession = eventDetails.isAnonSession == 'true' ? true : false;

		this.id = eventDetails.id;
		this.anonId = eventDetails.anonId;

		this.eventDetails.eventname = eventDetails.eventToTrack;
		this.eventDetails.timestamp = Date.now();
		this.eventDetails.referrer = eventDetails.referrer ? eventDetails.referrer : '-';
		this.eventDetails.details = JSON.parse(eventDetails.params);
		this.eventDetails.isAnon = this.isAnonSession;

		this.eventDetails.userAgent = this.request.headers['user-agent'];

		return this;
	},

	registerEvent: function (eventDetails, callback) {
		let newEvent = __event.model(eventDetails);
		newEvent.save((error) => {
			if (error) return callback(error);
			return callback(null, newEvent);
		});	

		__distinctevent.model.findOne({eventName: eventDetails.eventname}, (error, distinctEvent) => {
			if(distinctEvent) {
				let traits = distinctEvent.traits ? distinctEvent.traits : {};

				Object.keys(eventDetails.details).forEach(trait => {
					if(traits.hasOwnProperty(trait)){
						if(!traits[trait].includes(eventDetails.details[trait])){
							traits[trait].push(eventDetails.details[trait]);
						}
					} else {
						traits[trait] = [eventDetails.details[trait]];
					}
				});

				__distinctevent.model.update({eventName: eventDetails.eventname}, {$set: {traits: traits}})
				.exec((error, distinctEventUpdated) => {
					if(error) return error;
				});
			} else {
				let newDistinctEvent = new __distinctevent.model({
					eventName: eventDetails.eventname,
					traits: {}
				})

				Object.keys(eventDetails.details).forEach(trait => {
					newDistinctEvent.traits[trait] = [eventDetails.details[trait]];
				});

				newDistinctEvent.save(err => {
					if(error) return error;
				});
			}
		})
	},

	findUser: function (userCollection, query, callback) {
		userCollection.model.findOne(query).exec((error, user) => {
			if (error) return callback(error);
			return callback(null, user);
		})
	},

	createUser: function (userCollection, userDetails, callback) {
		userDetails.createdOn = Date.now();
		let newUser = userCollection.model(userDetails);
		newUser.save(error => {
			if (error) return callback(error);
			return callback(null, newUser);
		})
	},

	association: function (options, callback) {
		let userCollection = options.userCollection;
		let eventCollection = options.eventCollection;

		let user = options.user;
		let event = options.event;

		let associationOption = { anonuser: user._id};

		if(!user.anonId){
			associationOption = {
				registereduser: user._id
			};	
		}

		let updateTime = new Promise((resolve, reject) => {
			userCollection.model.update({_id: user._id}, {$set: { updatedOn: Date.now()}}, (error, success) => {
				if(error) reject(error);
				resolve(success);
			});
		});

		let userToEvents = new Promise((resolve, reject) => {
			userCollection.model.update({_id: user._id}, { $addToSet: { events: event._id }}, (error, success) => {
				if(error) reject(error);
				resolve(success);
			});
		});

		let eventToUser = new Promise((resolve, reject) => {
			eventCollection.model.update({_id: event._id}, {$set: associationOption}, (error, success) => {
				if(error) reject(error);
				resolve(success);
			});
		})

		Promise.all([updateTime, userToEvents, eventToUser])
		.then(resolvedPromises => {
			return callback(null);
		})
		.catch(error => {
			return callback(error);
		})
	}
}
 		 
module.exports = (req, res) => {
	eventRegistrar.initiateEventRegistration(req, res);
}