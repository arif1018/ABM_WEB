import axios from 'axios'

const API_URL = "https://server.silverrags.com/stock/"
// const API_URL = "http://localhost:5000/api/ads/eng"


const getStockAll = async()=>{
    const response = await axios.get(API_URL + 'getallstock')

    return response.data
}

const getStockPartyWise = async()=>{
    let response
    if(localStorage.getItem('ItemName')){
            response = await axios.get(`${API_URL}/partywise/?ItemName=${localStorage.getItem('ItemName')}` )
    }
    return response.data
}

const getAllItemName = async()=>{
    const response = await axios.get(API_URL + 'getallitemname')

    return response.data
}

// const getAdsEng = async(token)=>{
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     }

//     const response = await axios.get(API_URL, config)

//     return response.data
// }

// const addEngNewAd = async(adData, token)=>{
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     }

//     const response = await axios.post(API_URL, adData, config)

//     return response.data
// }


const adsEngAdsAllService = { getStockAll, getStockPartyWise, getAllItemName }

export default adsEngAdsAllService