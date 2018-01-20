var keystone = require('keystone');
var fs = require('fs');
var path = require('path');

exports = module.exports = (req, res) => {

	var templatesList = fs.readdirSync(path.resolve(__dirname, '../../../templates/email')).map(file => {
	  return file.split('.pug')[0];
	})

	res.send({templates: templatesList});
	
}