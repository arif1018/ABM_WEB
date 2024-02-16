import axios from 'axios'

const API_URL = "https://server.silverrags.com/production/"
// const API_URL = "http://localhost:5001/production/"

const getTableData = async(EntDate)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${EntDate}`
        }
    }

    const response = await axios.get(API_URL + 'tableData', config)
    return response.data
}

const BarCode_Production = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.PDRONO} ${userData.UserID} ${userData.PartyCode}`
        }
    }

    const response = await axios.get(API_URL + 'ProductionSticker', config)
    return response.data
}

const addNewRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.UserID}`
        }
    }
    const response = await axios.post(API_URL + 'addNewRecord', userData, config)

    return response.data
}

const deleteRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.RONO} ${userData.PDRONO} ${userData.UserID}`
        }
    }
    const response = await axios.post(API_URL + 'deleteRecord', userData, config)

    return response.data
}

const getMachines = async(EntDate)=>{
    const response = await axios.get(API_URL + 'getMachines')
    return response.data
}

const adsEngAdsAllService = { getTableData, BarCode_Production, addNewRecord, deleteRecord, getMachines }

export default adsEngAdsAllService