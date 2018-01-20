var keystone = require('keystone');
var Types = keystone.Field.Types;

var Customer = new keystone.List('Customer');

Customer.add({
	customerId: { type: String, required: true, initial: true, index: true},
	firstname: { type: String, required: true, initial: true, index: true},
	lastname: { type: String, initial: true, index: true},
	gender: { type: String, initial:true},
	email: { type: Types.Email, required: true, initial: true, index: true},
	contactNo: { type: String, initial: true, index: true},
	password: { type: String, required: true, initial: true, index: true},
	events: { type: Types.Relationship, ref: 'Event', many: true},
	createdOn: {type: String, default: Date.now()},
	updatedOn: {type: String, default: Date.now()}
});

Customer.defaultColumns = 'customerId, name';
Customer.register();
