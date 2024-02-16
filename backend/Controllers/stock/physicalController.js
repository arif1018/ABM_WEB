const sql = require('mssql')
const sqlConfig = require('../../Config/dbConfig')
const e = require('express')
const { GetNewCodewithOutUserID, GetNewCodewithUserID } = require('../../Middleware/allProcedures')

let OldBarCodeStatus = false
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
        const findQueryForItemDetail = `Select * From PurchaseDeliveryDetail Where UserID='${UserID}' 
        AND RONO='${PDRONO}'`
        const resultForItemDetail = await sql.query(findQueryForItemDetail)
        res.status(200).json(resultForItemDetail.recordset)
        // }
        } catch (err) {
    
        }
}

const dataForBarCodeOld = async (req, res) => {
    let OldBarCode
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            OldBarCode = req.headers.authorization.split(' ')[1]
        } catch (error) {
            res.status(200).json({message:"Token Not Found"})
        }
    }
    try {       
        await sql.connect(sqlConfig)
        const findQueryNormal = `Select * From PurchaseDeliveryDetail Where BarCode='${OldBarCode}'`
        const resultForItemNormal = await sql.query(findQueryNormal)
        if(resultForItemNormal.recordset.length > 0){
            res.status(200).json(resultForItemNormal.recordset)
        }else{
            OldBarCodeStatus = true
            await sql.connect(sqlConfig)
            const findQueryNormal = `Select * From PurchaseDeliveryDetail27082023 Where BarCode='${OldBarCode}'`
            const resultForItemNormal = await sql.query(findQueryNormal)
            res.status(200).json(resultForItemNormal.recordset)
        }

        } catch (err) {
    
        }
}

const dataForDataTable = async (req, res) => {
    let UserID
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            UserID = req.headers.authorization.split(' ')[1]
        } catch (error) {
            res.status(200).json({message:"Token Not Found"})
        }
    }
    try {

        await sql.connect(sqlConfig)
        const findQuery = `Select * From Audit Where UserID='${UserID}' Order By RONO Desc`
        const result = await sql.query(findQuery)
        res.status(200).json(result.recordset)
        } catch (err) {
    
        }
}

const AddNewRecord = async (req, res) => {
 
 
    let UserID

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            UserID = req.headers.authorization.split(' ')[1]
        } catch (error) {
            res.status(200).json({message:"Token Not Found"})
        }
    }

    const AuditID = await GetNewCodewithOutUserID('AuditMaster', 'AuditID', 5)
    const RONO = await GetNewCodewithUserID(UserID, 'Audit', 'RONO', 10)

    try {
        const { BarCode, OldBarCode, ItemName, KG, LBS, Quantity, Packing } = req.body

    await sql.connect(sqlConfig)

    const insertQuery = `INSERT INTO Audit(AuditID, UserID, RONO, BarCode, OldBarCode, ItemName, KG, LBS, 
    Quantity, Packing) Values('${AuditID}','${UserID}','${RONO}','${BarCode}','${OldBarCode}','${ItemName}',
    '${KG}','${LBS}','${Quantity}','${Packing}')`
    const result = await sql.query(insertQuery)


    const PDRONO = BarCode.split('-')[0]
    const PDUserID = BarCode.split('-')[1]
    

    await sql.connect(sqlConfig)
    const findUserNameQuery = `Select * From Users Where UserSerial='${PDUserID}'`
    const findUserNameresult = await sql.query(findUserNameQuery)
    await sql.connect(sqlConfig)
    if(OldBarCodeStatus === true){
        await sql.connect(sqlConfig)
        const findQueryNormal = `Select * From PurchaseDeliveryDetail27082023 Where BarCode='${OldBarCode}'`
        const resultForItemNormal = await sql.query(findQueryNormal)
        let data = resultForItemNormal.recordset

        await sql.connect(sqlConfig)
        const insertQuery = `Insert Into PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
        PartyName, BarCode, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus, AuditStatus) 
        Values('2023-11-22','${data[0].DCNO}','${data[0].DONO}','${data[0].MadeID}','${data[0].UserID}',
        '${data[0].RONO}','${data[0].PartyName}','${OldBarCode}','${data[0].ItemName}','1','1','${data[0].KG}',
        '${data[0].LBS}','GROUND FLOOR','No','Yes')`
        const result = await sql.query(insertQuery)
        OldBarCodeStatus = false

    }else{
        await sql.connect(sqlConfig)
        const findUserNameQuery = `Select * From PurchaseDeliveryDetail Where BarCode='${OldBarCode}'`
        const findUserNameresult = await sql.query(findUserNameQuery)
        const UpdatePDQuery = `Update PurchaseDeliveryDetail Set AuditStatus='Yes' Where RONO='${findUserNameresult.recordset[0].RONO}' 
        AND UserID='${findUserNameresult.recordset[0].UserID}'`
        const UpdatePDresult = await sql.query(UpdatePDQuery)    
        OldBarCodeStatus = false

    }
    
    await sql.connect(sqlConfig)
    const findQueryAudited = `Select * From  Audit Where AuditID='${AuditID}' AND UserID='${req.userid}' Order By RONO`
    const AuditedResult = await sql.query(findQueryAudited)
    res.status(200).json({
        dataForTable: AuditedResult.recordset,
    })

} catch (err) {
 }
}

module.exports = { dataForBarCode, AddNewRecord, dataForDataTable, dataForBarCodeOld }