import axios from 'axios'

const API_URL = "https://server.silverrags.com/physical/"
// const API_URL = "http://localhost:5001/physical/"

const dataForDataTable = async(UserID)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${UserID}`
        }
    }
    const response = await axios.get(API_URL + 'PA_getData', config)
    return response.data
}

const dataForBarCode = async(PDRONO_UserID)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${PDRONO_UserID}`
        }
    }

    const response = await axios.get(API_URL + 'IDF_Audit', config)

    return response.data
}

const dataForBarCodeOld = async(OldBarCode)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${OldBarCode}`
        }
    }

    const response = await axios.get(API_URL + 'IDFOld_Audit', config)

    return response.data
}

const addNewRecord = async(userData)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userData.UserID}`
        }
    }
    const response = await axios.post(API_URL + 'add_A_R', userData, config)

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


const partiesService = { dataForDataTable, dataForBarCode, dataForBarCodeOld, addNewRecord, deleteRecord, SaveMasterRecord }

export default partiesService