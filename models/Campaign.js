var keystone = require('keystone');
var Types = keystone.Field.Types;

var Campaign = new keystone.List('Campaign');

Campaign.add({
	name: {type: Types.Text, required: true, initial: true, unique: true},
	targetAudience: {type: Types.Relationship, ref: 'TargetAudience'},
	active: {type: Types.Boolean, initial: true, default: false},
	communicationChannel: { type: Types.Select, required: true, initial: true, options: ['Email', 'SMS'], emptyOption: false, default: 'Email'},
	croneSchedule: { type: Types.Text, initial: true, default: '* * * * * *'},
	template: { type: Types.Text, initial: true},


	createdOn: {type: Types.Datetime, default: Date.now()},
	updatedOn: {type: Types.Datetime, default: Date.now()},

});

Campaign.defaultColumns = 'name, active, communicationChannel';
Campaign.register();
