// making the login func work

// --to disable es-lint
/* eslint-disable */

// create the login function
const login = async (email,password) => {
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
        alert('Logged in successfully ')
        // --load the front page
        window.setTimeout(() => {
            location.assign('/')
        }, 1500)
    }
    // console.log(res)
    }
    catch(err) {
        // console.log(err.response.data) //this gives us the same code we have bn seeing from postman
        alert(err.response.data.message)
    }
   
}

document.querySelector('.form').addEventListener('submit', e => { // when the user clicks the submit form either the btn or enter
     e.preventDefault();
     const email = document.getElementById('email').value // to get the email
     const password = document.getElementById('password').value // to get the password

     login(email, password)
})