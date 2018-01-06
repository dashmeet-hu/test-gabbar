var sambha = document.createElement('script');
sambha.id = 'sambha';
sambha.src = 'http://localhost:3000/gabbar/js/sambha.js';
sambha.async = false;
var sb = document.getElementsByTagName('script')[0];
sb.parentNode.insertBefore(sambha, sb);
window.GabbarQueue=[],"undefined"==typeof
Gabbar&&(window.Gabbar={recognize:function(a){GabbarQueue.push({_action:"recognize",_args:
{id:a}})},track:function(a,e,r,c){GabbarQueue.push({_action:"track",_args:{eventToTrack:a,
params:e,callback:r,associateEarlierAnonEvents:c}})},register:function(a,e,r){GabbarQueue.
push({_action:"register",_args:{customer:a,id:e,callback:r}})},login:function(a,e,r){Gabba
rQueue.push({_action:"login",_args:{customer:a,id:e,callback:r}})},captureLead:function(a,
e){GabbarQueue.push({_action:"captureLead",_args:{lead:a,callback:e}})}});


var id = typeof customerId == "undefined" ? null : customerId;
Gabbar.recognize(id);

window.login = (target) => {
	console.log(target.value);

	Gabbar.login({
	customerId : 'customerId',
	sourceCreatedAt : 'date',
	sourceUpdatedAt : 'date',
	contactNo : 'contactNo',
	email : `${target.value.toLowerCase()}@keystonejs.com`,
	firstname : `${target.value}`,
	gender : 'gender',
	lastname : 'lastname'
	}, `id-${target.value.toLowerCase()}`, function() {
	// Code to execute after event is tracked
	});

}
// window.sendTaxi = function(){
// 	Gabbar.track('Booked Taxi', {}, () => {
// 		console.log('send taxi');	
// 	});
// }

// window.sendAuto = function() {
// 	Gabbar.track('Booked Auto', {}, () => {
// 		console.log('send auto');
// 	});
// }

// window.sendBike = function() {
// 	Gabbar.track('Booked Bike', {}, () => {
// 		console.log('send bike');
// 	});
// }

document.querySelectorAll('.book-ride').forEach(button => {
	button.addEventListener('click', evt => {
		var mainBlock = evt.target.parentElement;
		Gabbar.track(
			`Booked Ride`,
			{
				"Vehicle":  mainBlock.querySelector('.vehicle').innerText,
				"When": evt.target.innerText,
				"Price": mainBlock.querySelector('.price').innerText
			}
		)
	})
	console.log(button)
})