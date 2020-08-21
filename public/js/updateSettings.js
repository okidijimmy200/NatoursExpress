//update data
import axios from 'axios'
import {showAlert} from './alerts'

// type of data wch is either password or data
export const updateSetting = async(data, type) => {
    try {
        // making either urls work using ternary operator
        const url = 
        type === 'password' 
        ? 'http://127.0.0.1:8080/api/v1/users/updateMyPassword' 
        : 'http://127.0.0.1:8080/api/v1/users/updateMe'

        const res = await axios({
            method: 'PATCH',
            url,
            data

        })
        if(res.data.status ? 'success': 'Success') {
            showAlert('success', `${type.toUpperCase()} updated successfuly`)
        }
    }
    catch(err) {
        showAlert('error', err.response.data.message)
    }
};