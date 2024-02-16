import axios from 'axios'
import '../../services/GlobalVariables'

const API_URL = global.SET_API_URL + "menu/"

const getParentMenu = async(userid)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${userid}`
        }
    }

    const response = await axios.get(API_URL + 'getparentmenu', config)

    return response.data
}

const menuService = { getParentMenu }

export default menuService