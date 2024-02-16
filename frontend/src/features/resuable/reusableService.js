import axios from 'axios'
import '../../services/GlobalVariables'

const API_URL = global.SET_API_URL + "reUsable/"

// const API_URL = "http://localhost:5001/reUsable/"

const dataForBarCode = async(PDRONO_UserID)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${PDRONO_UserID}`
        }
    }

    const response = await axios.get(API_URL + 'barCodeData', config)

    return response.data
}

const getItems = async()=>{
    const response = await axios.get(API_URL + 'getItems')

    return response.data
}

const getParties = async()=>{

    const response = await axios.get(API_URL + 'getParties')

    return response.data
}

const getCurrency = async()=>{

    const response = await axios.get(API_URL + 'getCurrency')

    return response.data
}

const reusableService = { dataForBarCode, getItems, getParties, getCurrency }

export default reusableService