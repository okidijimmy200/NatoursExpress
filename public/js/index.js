import '@babel/polyfill'
import { displayMap } from './mapbox'
import {login, logout} from './login'
import {updateSetting} from './updateSettings'
import { bookTour } from './stripe';

// create some DOM elements
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logOutBtn = document.querySelector('.nav__el--logout')
const userDataForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')
const bookBtn = document.getElementById('book-tour');


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
        // muitl-part form data
        const form = new FormData()
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0]);
        console.log(form)

        
        updateSetting(form, 'data')
    })

if (userPasswordForm) userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();

        // --creating a loading spinner
        document.querySelector('.btn--save-password').textContent = 'Updating...' 
        const passwordCurrent = document.getElementById('password-current').value 
        const password = document.getElementById('password').value 
        const passwordConfirm = document.getElementById('password-confirm').value 
        await updateSetting({passwordCurrent, password, passwordConfirm}, 'password')

        // --to delete password data after submitting form
        document.querySelector('.btn--save-password').textContent = 'Save Password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';

    })

    if (bookBtn)
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
