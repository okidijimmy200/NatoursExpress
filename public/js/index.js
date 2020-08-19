import '@babel/polyfill'
import { displayMap } from './mapbox'
import {login} from './login'


// create some DOM elements
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form')



// delegation
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
// console.log(locations)
displayMap(locations);

}



if(loginForm)
    loginForm.addEventListener('submit', e => { // when the user clicks the submit form either the btn or enter
    e.preventDefault();
    //values
    const email = document.getElementById('email').value // to get the email
    const password = document.getElementById('password').value // to get the password
    login(email, password)
})