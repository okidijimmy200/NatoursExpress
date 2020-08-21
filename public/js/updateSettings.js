//update data
import axios from 'axios'
import {showAlert} from './alerts'

export const updateData = async(name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url:'http://127.0.0.1:8080/api/v1/users/updateMe',
            data: {
                name: name,
                email: email
            }

        })
        if(res.data.status === 'Success') {
            showAlert('success', 'Data updated successfuly')
        }
    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
}