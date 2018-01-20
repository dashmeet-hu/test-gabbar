if(document.querySelector('#logout')){
	document.querySelector('#logout').addEventListener('click', (evt) => {
		evt.preventDefault();

		fetch('/logout', {
			method: 'POST',
			credentials: 'same-origin'
		})
		.then(res => {
			return res.json();
		})
		.then(res => {

			console.log(res);
			if(res.error){
				console.log('error occured');
			}
			location.href = 'http://localhost:3000/landing'
		})
	});
}