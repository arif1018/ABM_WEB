import axios from 'axios'

const API_URL = "https://server.silverrags.com/salesGDN/"
// const API_URL = "http://localhost:5001/salesGDN/"

const getPDDONO = async()=>{

    const response = await axios.get(API_URL + 'getSDDONO')

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

const getDODetail = async(sdono)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${sdono}`
        }
    }

    const response = await axios.get(API_URL + 'getSDDONODetail', config)

    return response.data
}

const dataForBarCode = async(PDRONO_UserID)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${PDRONO_UserID}`
        }
    }

    const response = await axios.get(API_URL + 'getBarCodeDetail', config)

    return response.data
}

const addNewRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.DCNO} ${userData.DONO} ${userData.MadeID} ${userData.UserID}`
        }
    }
    const response = await axios.post(API_URL + 'addSDNewRecord', userData, config)

    return response.data
}

const deleteRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData}`
        }
    }
    const response = await axios.post(API_URL + 'deleteSDNewRecord', userData, config)

    return response.data
}


const SaveMasterRecord = async(userData)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${userData.DCNO} ${userData.UserID}`
        }
    }

    const response = await axios.post(API_URL + 'addSDMasterecord', userData, config)

    return response.data
}


const partiesService = { getPDDONO, getDODetail, getDCNO, dataForBarCode, addNewRecord, deleteRecord, SaveMasterRecord }

export default partiesService