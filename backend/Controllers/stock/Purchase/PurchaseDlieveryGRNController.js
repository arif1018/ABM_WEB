const sql = require('mssql')
const sqlConfig = require('../../../Config/dbConfig')
const { GetNewCodewithUserID, GetNewMasterCodewithUserID } = require('../../../Middleware/allProcedures')

const getNewDCNO = async (req, res) => {

    const DCNO = await GetNewMasterCodewithUserID(req.userid, 'PurchaseDeliveryMaster','DCNO',10)
    
    try {
        await sql.connect(sqlConfig)
        const insertQuery = `Select * From  PurchaseDeliveryDetail Where DCNO='${DCNO}' AND UserID='${req.userid}' Order By RONO`
        const result = await sql.query(insertQuery)
        res.status(200).json({
            DCNO:DCNO,
            dataForTable: result.recordset,
        })
            
    } catch (error) {}
}

const getSuppliers = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select PartyName as [PDPartyName] From PurchaseDOMaster Where CloseStatus='No' 
    Group By PartyName Order By PartyName`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}

const getDONO = async (req, res) => {

    let PartyName
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            PartyName = req.headers.authorization.split('-')[1]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    try {
    await sql.connect(sqlConfig)
    const findQuery = `Select DONO, UserID From PurchaseDOMaster Where PartyName='${PartyName}' AND CloseStatus='No' Order By DONO`
    const result = await sql.query(findQuery)
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

const AddNewRecord = async (req, res) => {
    let DCNO
    let DONO
    let MadeID
    let UserID
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            DCNO = req.headers.authorization.split(' ')[1]
            DONO = req.headers.authorization.split(' ')[2]
            MadeID = req.headers.authorization.split(' ')[3]
            UserID = req.headers.authorization.split(' ')[4]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    const RONO = await GetNewCodewithUserID(UserID, 'PurchaseDeliveryDetail', 'RONO', 10)
    try {
        const { EntDate, PartyName, ItemName, KG, LBS } = req.body
    await sql.connect(sqlConfig)
    const insertQuery = `Insert Into PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, PartyName, 
        ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) Values('${EntDate}','${DCNO}','${DONO}',
        '${MadeID}','${UserID}','${RONO}','${PartyName}','${ItemName}','1','1','${KG}',
        '${LBS}','GROUND FLOOR','No')`
    const result = await sql.query(insertQuery)
    res.status(200).json(result)
} catch (err) {
 }
}

const DeleteRecord = async (req, res) => {
    let RONO
    let UserID
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            RONO = req.headers.authorization.split(' ')[1]
            UserID = req.headers.authorization.split(' ')[2]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }
    try {
    await sql.connect(sqlConfig)
    const findQuery = `Select * From PurchaseDeliveryDetail Where RONO='${RONO}' AND UserID='${UserID}'`
    const findresult = await sql.query(findQuery)
    if(findresult.recordset[0].IssueStatus === "Yes"){
        res.status(200).json({
            deleteMessage:"Select item issued now you can not delete this!..."
    })
    }else{
        await sql.connect(sqlConfig)
        const findQuery = `Delete From PurchaseDeliveryDetail Where RONO='${RONO}' AND UserID='${UserID}'`
        const findresult = await sql.query(findQuery)    
        res.status(200).json({
            deleteMessage:"Record Deleted!..."
    })
    }
    }catch(err){ }
}

const SaveMasterRecord = async (req, res) => {
    let DCNO
    let UserID
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            DCNO = req.headers.authorization.split(' ')[1]
            UserID = req.headers.authorization.split(' ')[2]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }
    try {
        await sql.connect(sqlConfig)
        const findQuery = `Select * From  PurchaseDeliveryMaster Where DCNO='${DCNO}' AND UserID='${UserID}'`
        const resultfind = await sql.query(findQuery)
        if(resultfind.recordset.length > 0){
            const { EntDate, PartyName, NOI, WeightSlip, VehicleNo, CaseNo, TruckWeight } = req.body
            await sql.connect(sqlConfig)
            const insertQuery = `Update PurchaseDeliveryMaster Set EntDate='${EntDate}', 
            PartyName='${PartyName}', NOI=${NOI}, WeightSlip=${WeightSlip}, VehicleNo='${VehicleNo}', 
            CaseNo='${CaseNo}', TruckWeight=${TruckWeight}, Remarks='-', InvStatus='No', EditStatus='No' Where 
            DCNO='${DCNO}' AND UserID='${UserID}'`
            const result = await sql.query(insertQuery)
            res.status(200).json(result)    
        }else{
            const { EntDate, PartyName, NOI, WeightSlip, VehicleNo, CaseNo, TruckWeight } = req.body
            await sql.connect(sqlConfig)
            const insertQuery = `Insert Into PurchaseDeliveryMaster(EntDate, DCNO, UserID, PartyName, NOI, 
            WeightSlip, VehicleNo, CaseNo, TruckWeight, Remarks, InvStatus, EditStatus) Values('${EntDate}',
            '${DCNO}','${UserID}','${PartyName}',${NOI},${WeightSlip},'${VehicleNo}','${CaseNo}',
            ${TruckWeight},'-','No','No')`
            const result = await sql.query(insertQuery)
            res.status(200).json(result)    
        }
    } catch (err) {}
}

module.exports = { getSuppliers, getDONO, getItems, getNewDCNO, AddNewRecord, DeleteRecord, SaveMasterRecord }

