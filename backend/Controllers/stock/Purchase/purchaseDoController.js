const sql = require('mssql')
const sqlConfig = require('../../../Config/dbConfig')
const { GetNewCodewithUserID } = require('../../../Middleware/allProcedures')

const getNewDONO = async (req, res) => {

    const DONO = await GetNewCodewithUserID(req.userid, 'PurchaseDOMaster','DONO',10)
    try {
        await sql.connect(sqlConfig)
        const insertQuery = `Select * From  PurchaseDODetail Where DONO='${DONO}' AND UserID='${req.userid}' Order By RONO`
        const result = await sql.query(insertQuery)
        res.status(200).json({
            DONO:DONO,
            dataForTable: result.recordset,
        })
            
    } catch (error) {}
}

const getSuppliers = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select PartyName From PartiesInformation Where PartyCategory='Suppliers'`
    res.status(200).json(result.recordset)
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

const getUnits = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select LocDescription From Units Order By LocDescription`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}

const getCurrency = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select CurrDescription From Currency Order By CurrDescription`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}


const AddNewRecord = async (req, res) => {
    let DONO
    let UserID
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            DONO = req.headers.authorization.split(' ')[1]
            UserID = req.headers.authorization.split(' ')[2]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    const RONO = await GetNewCodewithUserID(UserID, 'PurchaseDODetail', 'RONO', 10)

    try {
        const { EntDate, MPONO, PartyName, ItemName, ZoneItem, ItemUnit, HSCode, Quantity, DealCurrency, RR, ZR } = req.body
    await sql.connect(sqlConfig)
    const insertQuery = `Insert Into PurchaseDODetail(EntDate, DONO, MPONO, UserID, RONO, PartyName, ItemName, 
        ZoneItem, ItemUnit, HSCode, Quantity, DealCurrency, RR, ZR) Values('${EntDate}','${DONO}',
        '${MPONO}','${UserID}','${RONO}','${PartyName}','${ItemName}','${ZoneItem}','${ItemUnit}','${HSCode}','${Quantity}',
        '${DealCurrency}','${RR}','${ZR}')`
    const result = await sql.query(insertQuery)
    res.status(200).json(result)
} catch (err) {
 }
}

const SaveMasterRecord = async (req, res) => {
    let DONO
    let UserID
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            DONO = req.headers.authorization.split(' ')[1]
            UserID = req.headers.authorization.split(' ')[2]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    try {
        const { EntDate, MPONO, PartyName, NOI } = req.body
    await sql.connect(sqlConfig)
    const insertQuery = `Insert Into PurchaseDOMaster(EntDate, DONO, MPONO, UserID, PartyName, NOI, Remarks, 
        EditStatus, CloseStatus) Values('${EntDate}','${DONO}',
        '${MPONO}','${UserID}','${PartyName}','${NOI}','-','No','No')`
    const result = await sql.query(insertQuery)
    res.status(200).json(result)
} catch (err) {
 }
}

module.exports = { getSuppliers, getItems, getUnits, getNewDONO, getCurrency, AddNewRecord, SaveMasterRecord }

