import axios from 'axios'

// const API_URL = "https://server.silverrags.com/physical/"
const API_URL = "http://localhost:5001/stock/"

const dataForDataTable = async(UserID)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${UserID}`
        }
    }
    const response = await axios.get(API_URL + '/getDataForTable', config)
    return response.data
}

const dataForBarCode = async(PDRONO_UserID)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${PDRONO_UserID}`
        }
    }

    const response = await axios.get(API_URL + '/getDataByBarCode', config)

    return response.data
}

const addNewRecord = async(userData)=>{

    const config = {
        headers: {
            Authorization: `Bearer ${userData.BarCode}`
        }
    }

    const response = await axios.post(`${API_URL}addNewRecord`, userData, config)

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


const partiesService = { dataForDataTable, dataForBarCode, addNewRecord, deleteRecord, SaveMasterRecord }

export default partiesService