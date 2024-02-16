import axios from 'axios'

const API_URL = "https://server.silverrags.com/report/purchase/"
// const API_URL = "http://localhost:5001/report/purchase/"

const getMasterData = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.userID} ${userData.EntDate}`
        }
    }

    const response = await axios.get(API_URL + 'DataMasterTable', config)
    return response.data
}

const updateEditStatus = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData}`
        }
    }

    const response = await axios.get(API_URL + 'updateEditStatusGRN', config)
    return response.data
}

const BarCode_GRN = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData}`
        }
    }

    const response = await axios.get(API_URL + 'getDataForBarCode', config)
    return response.data
}

const adsEngAdsAllService = { getMasterData, updateEditStatus, BarCode_GRN }

export default adsEngAdsAllService