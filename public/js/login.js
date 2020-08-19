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
        url:'http://127.0.0.1:8080/api/v1/users/login',
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

