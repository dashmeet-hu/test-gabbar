var keystone = require('keystone');
var Types = keystone.Field.Types;

var Event = new keystone.List('Event', {
	defaultSort: '-time'
});

Event.add({
	eventName: { type: Types.Text, required: true, index: true, initial: true },
	timeStamp: { type: Types.Text},
	referrer: { type: Types.Text},
	events: { type: Types.Relationship, ref: 'User', filters: { _id: ':user' }}
});

Event.schema.add({
	data: { type: Object },
	user: { type: Object}
});

Event.defaultColumns = 'eventName, timeStamp';
Event.register();
