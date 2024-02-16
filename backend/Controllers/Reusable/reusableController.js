const sql = require('mssql')
const sqlConfig = require('../../Config/dbConfig')
const { GetNewCodewithUserID } = require('../../Middleware/allProcedures')

const dataForBarCode = async (req, res) => {
    let UserID
    let PDRONO
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            let withoutBearer = req.headers.authorization.split(' ')[1]
            PDRONO = withoutBearer.split('-')[0]
            UserID = withoutBearer.split('-')[1]
        } catch (error) {
            res.status(200).json({message:"Token Not Found"})
        }
    }
    try {
       
        await sql.connect(sqlConfig)
        const findQuery = `Select * From Users Where UserSerial='${UserID}'`
        const result = await sql.query(findQuery)
        UserID = result.recordset[0].ID
        await sql.connect(sqlConfig)
        const findQueryForItemDetail = `Select * From PurchaseDeliveryDetail Where UserID='${UserID}' AND RONO='${PDRONO}'`
        const resultForItemDetail = await sql.query(findQueryForItemDetail)
        res.status(200).json(resultForItemDetail.recordset)
        // }
        } catch (err) {
    
        }
}

const getItems = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select ItemName From ItemsInformation Where ItemStatus='True'`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}

const getParties = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select PartyName From PartiesInformation Where PartyStatus='True' Group By PartyName Order By PartyName`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}

const getCurrency = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select * From Currency Order By CurrID`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}

module.exports = { dataForBarCode, getItems, getParties, getCurrency }
