const sql = require('mssql')
const sqlConfig = require('../../Config/dbConfig')
const e = require('express')

const stockGetAllStock = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select ItemName, Count(ItemName) as [Quantity], SUM(LBS) as [LBS], SUM(KG) as [KG]
    From PurchaseDeliveryDetail Where IssueStatus='No' Group By ItemName Order By ItemName`
    res.status(200).json(result.recordset)
    // let userData = result.recordset
    // userData.map((item)=>{
    //     console.log("User ID : ", item.ID)
    //     console.log("User Name : ", item.UserName)
    // })
    } 
    catch (err) {
    
    }
}

const getAllItemName = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select ItemName From PurchaseDeliveryDetail Where IssueStatus='No' Group By ItemName Order By ItemName`
    res.status(200).json(result.recordset)
    // let userData = result.recordset
    // userData.map((item)=>{
    //     console.log("User ID : ", item.ID)
    //     console.log("User Name : ", item.UserName)
    // })
} catch (err) {
 }
}

const stockGetItemPartyWise = async (req, res) => {
    try {
    const findQuery = `Select PartyName as [ItemName], Count(ItemName) as [Quantity], SUM(LBS) as [LBS], SUM(KG) as [KG] From PurchaseDeliveryDetail Where ItemName='${req.query.ItemName}' AND IssueStatus='No' Group By PartyName, ItemName Order By PartyName`
    await sql.connect(sqlConfig)
    const result = await sql.query(findQuery)
    res.status(200).json(result.recordset)
} catch (err) {
 }
}
module.exports = { stockGetAllStock, stockGetItemPartyWise, getAllItemName }