var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event', {
	defaultSort: '-time'
});

Event.add({
	eventname: { type: Types.Text, required: true, index: true, initial: true },
	timestamp: { type: Types.Text},
	referrer: { type: Types.Text},
	isAnon: { type: Types.Boolean},
	anonuser: { type: Types.Relationship, ref: 'AnonUser', many: false},
	registereduser: { type: Types.Relationship, ref: 'Customer', many: false}
});

Event.schema.add({
	userAgent: String,
	details: Object
});

// Event.relationship({path:'user', ref: 'User', refPath: 'events'});
Event.defaultColumns = 'eventName, timeStamp';
Event.register();
