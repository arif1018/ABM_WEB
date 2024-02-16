const sql = require('mssql')
const sqlConfig = require('../Config/dbConfig')
const e = require('express')

const getParentMenu = async (req, res) => {

    let token 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
                
    }

    let AllMenus = []
    try {
        const  userid = token
        await sql.connect(sqlConfig)
        const findMasterQuery = `Select menu_id, menu_name From MenuMaster Where menu_parent_id is null AND UserID='${userid}' Group By menu_name, menu_id Order By menu_id`
        const result = await sql.query(findMasterQuery)
        // res.status(200).json(result.recordset)
        let userData = result.recordset
    for (let index = 0; index < userData.length; index++) {
        const findQuery = `Select menu_name, webURL From MenuMaster Where menu_parent_id='${userData[index].menu_id}' AND UserID='${userid}' AND NOT(webURL IS NULL) Order By menu_id`
        const resultSM = await sql.query(findQuery)
        let subMenu = resultSM.recordset
        const myObj = {"menu_id": userData[index].menu_id,"menu_name": userData[index].menu_name,"subMenus":subMenu}
        AllMenus.push(myObj)
    }
    // userData.map(async(item, index)=>{


    //     const findQuery = `Select * From MenuMaster Where menu_parent_id='${item.menu_id}' AND UserID='arif' Order By menu_id`
    //     const resultSM = await sql.query(findQuery)
    //     let subMenu = resultSM.recordset
    //     const myObj = {"menu_id": item.menu_id,"menu_name": item.menu_name,"subMenus":[subMenu]}
    //     AllMenus.push(myObj)
    //     // subMenu.map(async(sm)=>{
    //     // })
    // })
    // console.log(AllMenus[0].subMenus)
    res.status(200).json(AllMenus)
} catch (err) {
 }
}

const getChildMenu = async (req, res) => {
    console.log("Done")
    try {
    await sql.connect(sqlConfig)
    const findQuery = `Select * From MenuMaster Where menu_parent_id='${req.menu_id}' AND UserID='arif' Order By menu_id`
    const result = await sql.query(findQuery)
    res.status(200).json(result.recordset)
    let userData = result.recordset
    // userData.map((item)=>{
    //     console.log("User ID : ", item.menu_name)
    //     console.log("User Name : ", item.menu_url)
    // })
} catch (err) {
 }
}

module.exports = { getParentMenu, getChildMenu }
