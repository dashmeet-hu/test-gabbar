let keystone = require('keystone');

let __user = keystone.list('Customer');
let __anonuser = keystone.list('AnonUser');
let __event = keystone.list('Event');

let viewRenderer = (req, res, viewPath, variables) => {
	if(viewPath) {
		let view = new keystone.View(req, res);
		// variables = ;
		view.render(viewPath, variables ? variables : {});
	} else {
		throw new Error('view is undefined');
	}
};

let retrieveUser = (query) => {
	query = query ? query : {};
	let _user = __user.model.findOne(query);
	let retrievedUser = new Promise((resolve, reject) => {
		_user.exec((error, user) => {
			resolve(user);
		})
	});
	return retrievedUser;
};

let listOfAllCustomers = () => {
	let _customer = __user.model.find();
	let list = new Promise((resolve, reject) => {
		_customer.exec((error, customers) => {
			resolve(customers);
		})
	})
	return list;
}

let generateCustomerId = (email) => {
	return `id-${email.replace('@', '-').split('.com')[0]}`;
}

let authenticateUser = (user, password) => {
	if(user && password) {
		if(user.password === password) {
			return true;
		}
		return false;
	} else {
		throw new Error('user and password both required')
	}
}

let saveUserToSession = (session, user) => {
	if(session.user){
		throw new Error('there is already a user logged in');
	} else {
		session.user = user;
	}
}

let removeUserFromSession = (session) => {
	if(!session.user) {
		throw new Error('No user is logged in');	
	}
	delete session.user;
}

let createNewCustomer = (userDetails) => {
	let newUser = __user.model(userDetails);
	newUser.customerId = generateCustomerId(userDetails.email);
	let createdUser = new Promise((resolve, reject) => {
		newUser.save((error) => {
			if (error){
				throw new Error('Error in saving new user');
			}
			resolve(newUser);
		});
	})
	return createdUser;
}

module.exports = {
	viewRenderer, retrieveUser, listOfAllCustomers, generateCustomerId, authenticateUser, saveUserToSession, removeUserFromSession, createNewCustomer
}