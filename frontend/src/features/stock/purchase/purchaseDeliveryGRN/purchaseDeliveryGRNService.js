import axios from 'axios'

// const API_URL = "http://localhost:5001/purchaseGRN/"
const API_URL = "https://server.silverrags.com/purchaseGRN/"


const getSuppliers = async()=>{
    const response = await axios.get(API_URL + 'getPDSuppliers')

    return response.data
}

const getItems = async()=>{
    const response = await axios.get(API_URL + 'getPOItems')

    return response.data
}

const getPDDONO = async(partyname)=>{

    const config = {
        headers: {
            Authorization: `Bearer -${partyname}`
        }
    }

    const response = await axios.get(API_URL + 'getPDDONO', config)

    return response.data
}

const getDCNO = async(userid)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${userid}`
        }
    }

    const response = await axios.get(API_URL + 'getNewDCNO', config)

    return response.data
}

const addNewRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.DCNO} ${userData.DONO} ${userData.MadeID} ${userData.UserID}`
        }
    }
    const response = await axios.post(API_URL + 'addPDNewRecord', userData, config)

    return response.data
}

const deleteRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData}`
        }
    }
    const response = await axios.post(API_URL + 'delPDNewRecord', userData, config)

    return response.data
}

const SaveMasterRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.DCNO} ${userData.UserID}`
        }
    }

    const response = await axios.post(API_URL + 'addPDMasterecord', userData, config)
    console.log(response.data)
    return response.data
}


const partiesService = { getSuppliers, getPDDONO, getItems, getDCNO, addNewRecord, deleteRecord, SaveMasterRecord }

export default partiesService