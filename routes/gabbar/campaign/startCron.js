var keystone = require('keystone');
nodeScheduler = require('node-schedule');

var nodemailer = require('nodemailer');
var pug = require('pug');

var path = require('path');
var fs = require('fs');

var getMatchQueryList = require('../getFilters.js');

var __targetAudience = keystone.list('TargetAudience');
var __customer = keystone.list('Customer');

var cronJobs = {};

let Cron = function(details) {

	this.details = {
		campaignName: '',
		isActive: false,
		schedule: '* * * * * *',
		targetAudienceRef: '',
		templateFile: '',
		communicationChannel: '',
	};

	this.job = {};

	this.initialize = function (details) {

		this.details.campaignName = details.name;
		this.details.communicationChannel = details.communicationChannel;
		this.details.targetAudienceRef = details.targetAudience;
		this.details.schedule = details.croneSchedule;
		this.details.isActive = details.active;
		this.details.templateFile = `${details.template}.pug`;
	};

	this.start = function () {
		console.log('........: ', this.details.schedule)
		this.job = nodeScheduler.scheduleJob(this.details.schedule, () => {
			this.cronOperation();
		})

		cronJobs[this.details.campaignName] = this;

		if(!this.details.isActive) {
			this.job.cancel(true);	
		}
	};

	this.update = function(details) {
		cronJobs[this.details.campaignName].job.cancel(true);
		this.initialize(details);
		this.start();

		console.log('hello details:::', this.details.schedule);
	};

	this.compileHTMLString = function(bindingData) {
		return pug.compileFile(templateFile)(bindingData);
	};

	this.getFilters = function(cb) {
		__targetAudience.model.findOne({_id: this.details.targetAudienceRef}).exec((error, filter) => {
			if(error) return cb(error);
			return cb(null, filter.filters.toBSON());
		})
	};

	this.getUsers = function (cb) {
		this.getFilters((error, filters) => {
			let matchQuery = getMatchQueryList(filters);	

			__customer.model.aggregate()
			.lookup({
			    from: "events",
			    localField: "events",
			    foreignField: "_id",
			    as: "events"
			})
			.match({$and: matchQuery})
			.sort({updatedOn: -1})
			.exec((error, response) => {
				if(error) return cb(error);
				return cb(null, response);
			})
		})
	};

	this.cronOperation = function() {
		this.getUsers((error, users) => {
			console.log(this.details.campaignName, ': users: ', users);
			console.log('-----------------')

			if(users && users.length !== 0){
				switch(this.details.communicationChannel) {
					case 'Email': 
						users.forEach(user => {
							this.sendMail(this.details.templateFile, user);
						})
				}
			}
		})
	}

	this.sendMail = function(templateFile, user) {
		// setup e-mail data with unicode symbols

		let pathToFile = path.resolve(__dirname, '../../../templates/email/' + templateFile);
		let htmlString = pug.compileFile(pathToFile)(user);

		let mailOptions = {
		    from: '"Happily Unmarried" <dashmeet2011@gmail.com>', // sender address
		    to: user.email, // list of receivers
		    subject: `Hello, ${user.firstname} ${user.lastname}`, // Subject line
		    html: htmlString // html body
		};


		console.log(htmlString)
		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});

	}

	this.initialize(details);
	return this;
}

var transporter = nodemailer.createTransport('smtps://dashmeet2011@gmail.com:Souljas1313@smtp.gmail.com');

module.exports = {Cron: Cron, cronJobs:cronJobs}
