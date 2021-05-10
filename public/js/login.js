// making the login func work
import  axios from 'axios'
import {showAlert} from './alerts'
// --to disable es-lint
/* eslint-disable */

// create the login function
export const login = async (email,password) => {
    try {
         // we use axios for doing this
    const res =  await axios({
        method: 'POST',
        url:'http://127.0.0.1:4000/api/v1/users/login',
        data: {
            email,
            password
        }
    })
    // sending alert incase the password or email is correct
    if(res.data.status === 'Success'){
        showAlert('success', 'Logged in successfully ')
        // --load the front page
        window.setTimeout(() => {
            location.assign('/')
        }, 1500)
    }
    // console.log(res)
    }
    catch(err) {
        // console.log(err.response.data) //this gives us the same code we have bn seeing from postman
        showAlert('error',err.response.data.message)
    }
   
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:4000/api/v1/users/logout',
        })
        // reload the page
        if((res.data.status = 'success')) location.reload(true)
    }
    catch(err) {
        showAlert('error', 'Error logging out')
    }
}

//signup
export const signup = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:4000/api/v1/users/signup',
            data: {
                name, email, password, passwordConfirm
            }
        })
        if (res.data.status === 'Success') {
            showAlert('success', 'Created an account')
            window.setTimeout(() => {
                location.assign('/login')
            },1000)
        }
    } catch(err) {
         // console.log(err.response.data) //this gives us the same code we have bn seeing from postman
         showAlert('error',err.response.data.message)
    }
}