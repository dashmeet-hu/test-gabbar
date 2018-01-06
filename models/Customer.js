var keystone = require('keystone');
var Types = keystone.Field.Types;

var Customer = new keystone.List('Customer');

Customer.add({
	customerId: { type: String},
	firstName: { type: String},
});

Customer.schema.add({
	events: [{
		type: Object
	}]
})
Customer.defaultColumns = 'customerId, name';
Customer.register();
