var nodeScheduler = require('node-schedule');
var nodemailer = require('nodemailer');

var sendMail = true;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://dashmeet2011@gmail.com:Souljas1313@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Jasmeet Singh" <jasmeetsingh797@gmail.com>', // sender address
    to: 'dashmeet2011@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plaintext body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});


// var scheduledJob = nodeScheduler.scheduleJob('*/5 * * * * *', function (d, e) {

// 	if(sendMail) {
// 		console.log('next invocation at: ',scheduledJob.nextInvocation());	
// 	}
	
// });

console.log('job started');
module.exports = true;