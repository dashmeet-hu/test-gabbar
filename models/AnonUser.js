var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * AnonUser Model
 * ==========
 */
var AnonUser = new keystone.List('AnonUser');

AnonUser.add({
	anonId: { type: String, required: true, index: true, initial: true },
	events: { type: Types.Relationship, ref: 'Event', many: true}
});

// AnonUser.relationship({path: 'events', ref:'Event', refPath: 'user'});
AnonUser.schema.add({
	// events: [ {
	// 	eventname: String,
	// 	referrer: String,
	// 	timestamp: String,
	// 	details: Object,
	// 	eventId: Object
	// } ]
	// events: [{type: Object, ref: 'Event'}]
})

AnonUser.defaultColumns = 'anonId';
AnonUser.register();
