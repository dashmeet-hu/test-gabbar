var login = function(element) {
			var formData = {
				email: element.dataset.email,
				password: element.dataset.password
			}

			fetch(`/login`, {
				method: 'POST',
				headers: {
					"Content-type": "application/json; charset=UTF-8"
				},
				credentials: 'same-origin',
				body: JSON.stringify(formData)
			})
			.then(res => {
				return res.json();
			})
			.then(response => {
				if (response.error) {
					document.querySelector('#formError').innerText = response.error;
				} else {
					console.log(response.user);
					trackLogin(response.user);
				}
				return response;
			})
			.catch(err => {
				return err;
			})
		}
		
		var trackLogin = function (user) {
			Gabbar.login(user, user.customerId, () => {
				location.href = `${location.origin}/landing`;
			});
		}