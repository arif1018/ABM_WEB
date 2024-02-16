import axios from 'axios'

// const API_URL = "https://server.silverrags.com/stock/"
const API_URL = "https://server.silverrags.com/purchase/"


const getSuppliers = async()=>{
    const response = await axios.get(API_URL + 'getPOSuppliers')

    return response.data
}

const getItems = async()=>{
    const response = await axios.get(API_URL + 'getPOItems')

    return response.data
}

const getUnits = async()=>{
    const response = await axios.get(API_URL + 'getPOUnits')

    return response.data
}

const getDONO = async(userid)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${userid}`
        }
    }

    const response = await axios.get(API_URL + 'getNewDONO', config)

    return response.data
}

const getCurrency = async()=>{
    const response = await axios.get(API_URL + 'getPOCurrency')

    return response.data
}

const addNewRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.DONO} ${userData.UserID}`
        }
    }

    const response = await axios.post(API_URL + 'addPONewRecord', userData, config)

    return response.data
}

const SaveMasterRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.DONO} ${userData.UserID}`
        }
    }

    const response = await axios.post(API_URL + 'addPOMasterecord', userData, config)

    return response.data
}


const partiesService = { getSuppliers, getItems, getUnits, getDONO, getCurrency, addNewRecord, SaveMasterRecord }

export default partiesService