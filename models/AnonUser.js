var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * AnonUser Model
 * ==========
 */
var AnonUser = new keystone.List('AnonUser');

AnonUser.add({
	anonId: { type: String, required: true, index: true, initial: true }
});

AnonUser.defaultColumns = 'anonId';
AnonUser.register();
