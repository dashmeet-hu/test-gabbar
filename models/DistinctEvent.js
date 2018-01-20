var keystone = require('keystone');
var Types = keystone.Field.Types;

var DistinctEvent = new keystone.List('DistinctEvent');

DistinctEvent.add({
	eventName: { type: String, required: true, initial: true}
});

DistinctEvent.schema.add({
	traits: Object
})

DistinctEvent.defaultColumns = 'eventName';
DistinctEvent.register();
