var keystone = require('keystone');
var Types = keystone.Field.Types;

var TargetAudience = new keystone.List('TargetAudience');

TargetAudience.add({
	name: {type: String, required: true, initial: true},
});

TargetAudience.schema.add({
	filters: Array
})
TargetAudience.defaultColumns = '';
TargetAudience.register();
