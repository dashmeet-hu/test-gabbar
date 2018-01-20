var registrationForm = document.querySelector('#registrationForm');

if(registrationForm) {
	registrationForm.addEventListener('submit', (evt) => {

		evt.preventDefault();
		
		var formData = {};
		Array.from(registrationForm.querySelectorAll('[name]')).forEach((inputElement) => {
			formData[inputElement.name] = inputElement.value;
		})

		console.log(formData);
		debugger;
		fetch('/register', {
			method: 'POST',
			headers: {
				"Content-type": "application/json; charset=UTF-8"
			},
			body: JSON.stringify({user: formData}),
			credentials: 'same-origin'
		})
		.then(res => {
			return res.json();
		})
		.then(response => {
			console.log(response);
			if (response.error) {
				document.querySelector('#formError').innerText = response.error;
			} else {
				trackRegister(response.user);
			}
			return response;
		})
		.catch(err => {
			return err;
		})
	})

	var trackRegister = function (user) {
		Gabbar.register(user, user.customerId, () => {
			location.replace(`${location.origin}/landing`);
		});
	}
}