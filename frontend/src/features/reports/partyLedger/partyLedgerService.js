import axios from 'axios'
import '../../../services/GlobalVariables'

const API_URL = global.SET_API_URL + "report/Accounts/"

const getData = async(dataForLedger)=>{
    const config = {
        headers: {
            Authorization: `Bearer /${dataForLedger.PartyName}/${dataForLedger.FromDate}/${dataForLedger.ToDate}/${dataForLedger.Currency}/${dataForLedger.CBDetail}`
        }
    }
    const response = await axios.get(API_URL + 'getData', config)
    return response.data
}


const partyLedgerService = { getData }

export default partyLedgerService