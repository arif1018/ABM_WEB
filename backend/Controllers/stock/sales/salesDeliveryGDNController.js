const sql = require('mssql')
const sqlConfig = require('../../../Config/dbConfig')
const { GetNewCodewithUserID } = require('../../../Middleware/allProcedures')

const getNewDCNO = async (req, res) => {

    const DCNO = await GetNewCodewithUserID(req.userid, 'SalesDeliveryMaster','DCNO',10)
    try {
        await sql.connect(sqlConfig)
        const findNormalDetailQuery = `Select * From  SalesDeliveryDetail Where DCNO='${DCNO}' AND UserID='${req.userid}' Order By RONO`        
        const resultNormalDetailQuery = await sql.query(findNormalDetailQuery)
    
        await sql.connect(sqlConfig)
        const findItemWiseDetailQuery = `Select ItemName, Count(ItemName) TotalBales, ROUND(CAST (SUM(LBS) AS decimal (6)),0) as LBS, ROUND(CAST (SUM(KG) AS decimal (6)),0) as KG From  
        SalesDeliveryDetail Where DCNO='${DCNO}' AND UserID='${req.userid}' Group By ItemName Order By ItemName`
        let resultItemWiseDetailQuery = await sql.query(findItemWiseDetailQuery)
        let TotalQuanttiy = 0 
        let TotalLBS = 0
        let TotalKG = 0
        const totalitem = resultItemWiseDetailQuery.recordset.forEach(item => {
            TotalQuanttiy = TotalQuanttiy + item.TotalBales
            TotalLBS = TotalLBS + item.LBS
            TotalKG = TotalKG + item.KG
        });
        resultItemWiseDetailQuery.recordset.push({ItemName:"TOTAL",TotalBales:TotalQuanttiy,LBS:TotalLBS,KG:TotalKG})
        res.status(200).json({
            DCNO:DCNO,
            dataForTable: resultNormalDetailQuery.recordset,
            itemWiseDetail: resultItemWiseDetailQuery.recordset,
            TotalQuanttiy: TotalQuanttiy,
            TotalLBS: TotalLBS,
            TotalKG: TotalKG
        })
            
    } catch (error) {}
}

const getDONO = async (req, res) => {

    try {
    await sql.connect(sqlConfig)
    const findQuery = `Select DONO From SalesDOMaster Where CloseStatus='No' AND Allowed='Yes' Order By DONO`
    const result = await sql.query(findQuery)
    res.status(200).json(result.recordset)
    } catch (err) {

    }
}

const getDONODetail = async (req, res) => {
    let DONO
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            DONO = req.headers.authorization.split(' ')[1]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    try {
       
    await sql.connect(sqlConfig)
    const findQuery = `Select * From SalesDOMaster Where DONO='${DONO}'`
    const result = await sql.query(findQuery)
    
    await sql.connect(sqlConfig)
    const findQueryPort = `Select * From ShippingPorts Where LocDescription='${result.recordset[0].Port}'`
    const resultPort = await sql.query(findQueryPort)

    await sql.connect(sqlConfig)
    const findQueryItemDetail = `Select * From SalesDODetail Where DONO='${DONO}'`
    const resultItemDetail = await sql.query(findQueryItemDetail)
    const sum = resultItemDetail.recordset.reduce((acc, item) => acc + item.Quantity,0);    
    resultItemDetail.recordset.push({RONO:"", ItemName:"Total Quantity", Quantity:sum})
    res.status(200).json({
        DODetail:result.recordset,
        PortCode:resultPort.recordset,
        ItemDetail:resultItemDetail.recordset,
        })
    } catch (err) {

    }
}

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

    const RONO = await GetNewCodewithUserID(UserID, 'SalesDeliveryDetail', 'RONO', 10)
    try {
        const { EntDate, BarCode, PartyName, ItemName, KG, LBS } = req.body
    await sql.connect(sqlConfig)
    const insertQuery = `INSERT INTO SalesDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, PartyName, 
        BarCode, ItemName, Quantity, KG, LBS) Values('${EntDate}','${DCNO}','${DONO}',
        '${MadeID}','${UserID}','${RONO}','${PartyName}','${BarCode}','${ItemName}','1','${KG}',
        '${LBS}')`
    const result = await sql.query(insertQuery)

    const PDRONO = BarCode.split('-')[0]
    const PDUserID = BarCode.split('-')[1]

    await sql.connect(sqlConfig)
    const findUserNameQuery = `Select * From Users Where UserSerial='${PDUserID}'`
    const findUserNameresult = await sql.query(findUserNameQuery)

    await sql.connect(sqlConfig)
    const UpdatePDQuery = `Update PurchaseDeliveryDetail Set IssueStatus='Yes' Where RONO='${PDRONO}' 
    AND UserID='${findUserNameresult.recordset[0].ID}'`
    const UpdatePDresult = await sql.query(UpdatePDQuery)
    
    await sql.connect(sqlConfig)
    const FindSavedRecordQuery = `Select * From SalesDeliveryDetail Where RONO='${RONO}' AND UserID='${UserID}'`
    const resultFindSavedRecordQuery = await sql.query(FindSavedRecordQuery)

    res.status(200).json(result.recordset)
} catch (err) {
 }
}

const deleteRecord = async (req, res) => {
    let RONO
    let UserID
    let BarCode
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            RONO = req.headers.authorization.split(' ')[1]
            UserID = req.headers.authorization.split(' ')[2]
            BarCode = req.headers.authorization.split(' ')[3]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    try {

        const PDRONO = BarCode.split('-')[0]
        const PDUserID = BarCode.split('-')[1]
    
        await sql.connect(sqlConfig)
        const findUserNameQuery = `Select * From Users Where UserSerial='${PDUserID}'`
        const findUserNameresult = await sql.query(findUserNameQuery)
    
        await sql.connect(sqlConfig)
        const UpdatePDQuery = `Update PurchaseDeliveryDetail Set IssueStatus='No' Where RONO='${PDRONO}' 
        AND UserID='${findUserNameresult.recordset[0].ID}'`
        const UpdatePDresult = await sql.query(UpdatePDQuery)
    
    
        await sql.connect(sqlConfig)
        const insertQuery = `Delete From SalesDeliveryDetail Where RONO='${RONO}' AND UserID='${UserID}'`
        const result = await sql.query(insertQuery)
        res.status(200).json(result.recordset)
    } 
    catch (err) {
        
    }
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
        const { EntDate, PartyName, NOI, VehicleNo, ContainerNo, DONO } = req.body
        await sql.connect(sqlConfig)
        const insertQuery = `Insert Into SalesDeliveryMaster(EntDate, DCNO, UserID, PartyName, NOI, VehicleNo, 
        ContainerNo, Remarks, InvStatus, EditStatus) Values('${EntDate}',
        '${DCNO}','${UserID}','${PartyName}',${NOI},'${VehicleNo}','${ContainerNo}','-','No','No')`
        const result = await sql.query(insertQuery)
        await sql.connect(sqlConfig)
        const updateQuery = `Update SalesDOMaster Set CloseStatus='Yes' Where DONO='${DONO}'`
        const resultUpdate = await sql.query(updateQuery)

    res.status(200).json(result)
} catch (err) {
 }
}

module.exports = { getDONO, getNewDCNO, getDONODetail, dataForBarCode, AddNewRecord, deleteRecord, SaveMasterRecord }

