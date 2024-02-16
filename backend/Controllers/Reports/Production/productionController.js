const sql = require('mssql')
const sqlConfig = require('../../../Config/dbConfig')
const { GetNewCodewithUserID } = require('../../../Middleware/allProcedures')

let BarCodeData = []

const getTableData = async (req, res) => {
    let PartyDate
    let FromDate
    let ToDate
    let Currency

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            PartyDate = req.headers.authorization.split(' ')[1]
            FromDate = req.headers.authorization.split(' ')[2]
            ToDate = req.headers.authorization.split(' ')[3]
            Currency = req.headers.authorization.split(' ')[4]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }
    
    await sql.connect(sqlConfig)
    const findTableData = `Select EntDate, UserID, RONO, PDRONO, Code, ItemName , KG, LBS, 
    MachineNo From Production Where EntDate='${EntDate}' Order By RONO Desc`
    const resultTableData = await sql.query(findTableData)

    res.status(200).json({
        TableData:resultTableData.recordset,
    })

}

const BarCode_Production = async (req, res) => {
    let UserID
    let PDRONO
    let PartyCode
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            PDRONO = req.headers.authorization.split(' ')[1]
            UserID = req.headers.authorization.split(' ')[2]
            PartyCode = req.headers.authorization.split(' ')[3]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    await sql.connect(sqlConfig)
    const findForBarCodeQuery = `Select CAST(EntDate AS DATE) AS EntDate, PartyName, RONO, UserID, ItemName, 
    ROUND(CAST (LBS AS decimal (6)),0) as LBS, ROUND(CAST (KG AS decimal (6)),0) as KG From PurchaseDeliveryDetail 
    Where UserID='${UserID}' AND RONO='${PDRONO}'`
    const findForBarCoderesult = await sql.query(findForBarCodeQuery)
    await sql.connect(sqlConfig)
    const findUserSerial = `Select * From Users Where ID='${UserID}'`
    const UserSerialresult = await sql.query(findUserSerial)
    BarCodeData = []
    for (let index = 0; index < findForBarCoderesult.recordset.length; index++) {
        const myObj = {"PartyCode": PartyCode, "RONO": 
        findForBarCoderesult.recordset[index].RONO, "UserID":UserSerialresult.recordset[0].UserSerial,
        "ItemName":findForBarCoderesult.recordset[index].ItemName, 
        "LBS":findForBarCoderesult.recordset[index].LBS, "KG":findForBarCoderesult.recordset[index].KG,
        "EntDate":findForBarCoderesult.recordset[index].EntDate}
        BarCodeData.push(myObj)
    }
    res.status(200).json({
        DataForBarCode: BarCodeData
    })

}

const deleteRecord = async (req, res) => {
    let RONO
    let PDRONO
    let UserID
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            RONO = req.headers.authorization.split(' ')[1]
            PDRONO = req.headers.authorization.split(' ')[2]
            UserID = req.headers.authorization.split(' ')[3]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }
    try {
    await sql.connect(sqlConfig)
    const findQuery = `Select * From PurchaseDeliveryDetail Where RONO='${PDRONO}' AND UserID='${UserID}'`
    const findresult = await sql.query(findQuery)
    if(findresult.recordset[0].IssueStatus === "Yes"){
        res.status(200).json({
            deleteMessage:"Selected item issued now you can not delete this!..."
    })
    }else{
        await sql.connect(sqlConfig)
        const deletePDQuery = `Delete From PurchaseDeliveryDetail Where RONO='${PDRONO}' AND UserID='${UserID}'`
        const resultPDDelete = await sql.query(deletePDQuery)
        const deleteProdQuery = `Delete From Production Where RONO='${RONO}' AND UserID='${UserID}'`
        const resultdeleteProd = await sql.query(deleteProdQuery)    
        res.status(200).json({
            deleteMessage:"Record Deleted!..."
        })
    }
    }catch(err){ }
}

const addNewRecord = async (req, res) => {
    let UserID
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            UserID = req.headers.authorization.split(' ')[1]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }
    BarCodeData = []
    const { MultiStick, EntDate, Code, ItemName, Packing, Quantity, KG, LBS, MachineNo, StQnty } = req.body



    if(MultiStick){
        for (let index = 0; index < StQnty; index++) {
            const RONO = await GetNewCodewithUserID(UserID, "Production", "RONO", 10)
            const PDRONO = await GetNewCodewithUserID(UserID, "PurchaseDeliveryDetail", "RONO", 10)
    
            await sql.connect(sqlConfig)
            const insertQueryProduction = `INSERT INTO Production(EntDate, UserID, RONO, Code, PDRONO, ItemName, 
            Packing, Quantity, KG, LBS, MachineNo) Values('${EntDate}','${UserID}','${RONO}','${Code}',
            '${PDRONO}','${ItemName}',${Packing},${Quantity},${KG},${LBS},'${MachineNo}')`
            const insertQueryProductionresult = await sql.query(insertQueryProduction)

            const insertQueryPD = `INSERT INTO PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
            PartyName, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) Values('${EntDate}','Prod',
            'Prod','${UserID}','${UserID}','${PDRONO}','${Code}','${ItemName}',${Packing},${Quantity},${KG},
            ${LBS},'GROUND FLOOR','No')`
            const insertQueryPDresult = await sql.query(insertQueryPD)
    
            const findUserSerial = `Select * From Users Where ID='${UserID}'`
            const UserSerialresult = await sql.query(findUserSerial)
                 
            const myObj = {"PartyCode": Code, "RONO": PDRONO, "UserID":UserSerialresult.recordset[0].UserSerial, 
            "ItemName":ItemName, "LBS":LBS, "KG":KG,"EntDate":EntDate}
            BarCodeData.push(myObj)    
        }
    }else{
        const RONO = await GetNewCodewithUserID(UserID, "Production", "RONO", 10)
        const PDRONO = await GetNewCodewithUserID(UserID, "PurchaseDeliveryDetail", "RONO", 10)

        await sql.connect(sqlConfig)
        const insertQueryProduction = `INSERT INTO Production(EntDate, UserID, RONO, Code, PDRONO, ItemName, 
        Packing, Quantity, KG, LBS, MachineNo) Values('${EntDate}','${UserID}','${RONO}','${Code}',
        '${PDRONO}','${ItemName}',${Packing},${Quantity},${KG},${LBS},'${MachineNo}')`
        const insertQueryProductionresult = await sql.query(insertQueryProduction)

        const insertQueryPD = `INSERT INTO PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
        PartyName, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) Values('${EntDate}','Prod',
        'Prod','${UserID}','${UserID}','${PDRONO}','${Code}','${ItemName}',${Packing},${Quantity},${KG},
        ${LBS},'GROUND FLOOR','No')`
        const insertQueryPDresult = await sql.query(insertQueryPD)

        const findUserSerial = `Select * From Users Where ID='${UserID}'`
        const UserSerialresult = await sql.query(findUserSerial)
             
        const myObj = {"PartyCode": Code, "RONO": PDRONO, "UserID":UserSerialresult.recordset[0].UserSerial, 
        "ItemName":ItemName, "LBS":LBS, "KG":KG,"EntDate":EntDate}
        BarCodeData.push(myObj)    

    }
    res.status(200).json({
        DataForBarCode: BarCodeData
    })

}

const getMachines = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select LocDescription From Machines Where LocStatus='True'`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}

module.exports = { getTableData, BarCode_Production, deleteRecord, addNewRecord, getMachines }
