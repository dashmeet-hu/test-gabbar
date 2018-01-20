let keystone = require('keystone');

let helperFunctions = require('./helpers.js');

let viewRenderer = helperFunctions.viewRenderer;
let retrieveUser = helperFunctions.retrieveUser;
let listOfAllCustomers = helperFunctions.listOfAllCustomers;
let generateCustomerId = helperFunctions.generateCustomerId;
let authenticateUser = helperFunctions.authenticateUser;
let saveUserToSession = helperFunctions.saveUserToSession;
let removeUserFromSession = helperFunctions.removeUserFromSession;
let createNewCustomer = helperFunctions.createNewCustomer;


let __user = keystone.list('Customer');
let __anonuser = keystone.list('AnonUser');
let __event = keystone.list('Event');

let login = (req, res) => {
	// login authentication using email and password
	// must be using body as it will come via post request
	let email = req.body.email;
	let password = req.body.password;

	retrieveUser({email: email})
	.then(user => {
		if (user && authenticateUser(user, password)) {
			saveUserToSession(req.session, user);

			res.send({user: {
				firstname : user.firstname,
				lastname:user.lastname,
				email: user.email,
				contactNo: user.contactNo,
				gender: user.gender,
				createdOn: user.createdOn,
				updatedOn: user.updatedOn,
				customerId: user.customerId
			}});
		} else {
			res.send({error: 'either email or password is wrong'})
		}
	})
	.catch(error => {
		return error;
	})
}

let logout = (req, res) => {
	removeUserFromSession(req.session);
	res.json({'succes': true});
}

let register = (req, res) => {

	let userDetails = {
		firstname: req.body.user.firstname,
		lastname: req.body.user.lastname,
		gender: req.body.user.gender,
		email: req.body.user.email,
		password: req.body.user.password,
		contactNo: req.body.user.contactNo
	}

	retrieveUser({email: userDetails.email})
	.then(user => {
		if(user){
			res.json({error: 'User with this email id is already registered'});
			return;
		} else {
			createNewCustomer(userDetails)
			.then(newUser => {
				saveUserToSession(req.session, newUser);
				res.json({user: {
					firstname : newUser.firstname,
					lastname: newUser.lastname,
					email: newUser.email,
					contactNo: newUser.contactNo,
					gender: newUser.gender,
					createdOn: newUser.createdOn,
					updatedOn: newUser.updatedOn,
					customerId: newUser.customerId
				}});
			})
			.catch(error => {
				return error;
			})
		}
	})
	
}

let getLoggedInUserId = (req, res) => {
	if(req.session.user) {
		res.send({
			customerId: req.session.user.customerId
		})
	} else {
		res.send({});
	}
}
let app = (req, res) => {
	if(req.session.user){
		viewRenderer(req, res, 'landing', {loggedInUser: req.session.user});
	} else {
		listOfAllCustomers()
		.then(customers => {
			viewRenderer(req, res, 'landing', {customers: customers});
		});
	}
	
}


module.exports = {login, logout, register, getLoggedInUserId, app}