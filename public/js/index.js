import '@babel/polyfill'
import { displayMap } from './mapbox'
import {login, logout} from './login'
import {updateData} from './updateSettings'


// create some DOM elements
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logOutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')



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

if(logOutBtn) logOutBtn.addEventListener('click', logout)

if (userDataForm) userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value 
        const email = document.getElementById('email').value 
        updateData(name, email)
    })