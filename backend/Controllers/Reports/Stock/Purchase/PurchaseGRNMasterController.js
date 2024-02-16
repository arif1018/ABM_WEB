const sql = require('mssql')
const sqlConfig = require('../../../../Config/dbConfig')
const { dataForMasterTable } = require('../../../../Middleware/allProcedures')

const getMasterData = async (req, res) => {
    let EntDate
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            EntDate = req.headers.authorization.split(' ')[2]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    await sql.connect(sqlConfig)
    const UserRoleQuery = `Select * From Users Where ID='${req.userid}'`
    const resultUserRoleQuery = await sql.query(UserRoleQuery)
    const userRole = resultUserRoleQuery.recordset[0].Member
    const userData = await dataForMasterTable(req.userid, 'PurchaseDeliveryMaster','EntDate',EntDate, "DCNO")

    await sql.connect(sqlConfig)
    const findPartyWiseQuery = `Select PartyName, Count(PartyName) as TotalTruck From  PurchaseDeliveryMaster Where 
    EntDate='${EntDate}' ${userRole === 'User' ? "AND UserID='${req.userid}'" :""} Group By PartyName Order By PartyName`
    const resultPartyWiseQuery = await sql.query(findPartyWiseQuery)
    let TotalTruck = 0 
    const totalTruck = resultPartyWiseQuery.recordset.forEach(item => {
        TotalTruck = TotalTruck + item.TotalTruck
    });
    await sql.connect(sqlConfig)
    const findItemWiseQuery = `Select ItemName, Count(ItemName) as TotalItem From  PurchaseDeliveryDetail Where 
    EntDate='${EntDate}' ${userRole === 'User' ? "AND UserID='${req.userid}'" :""} AND NOT(DCNO='Prod') Group By ItemName Order By ItemName`
    const resultItemWiseQuery = await sql.query(findItemWiseQuery)
    let TotalItem = 0 
    const totalitem = resultItemWiseQuery.recordset.forEach(item => {
        TotalItem = TotalItem + item.TotalItem
    });

    await sql.connect(sqlConfig)
    const findIParty_Item_WiseQuery = `Select PartyName, ItemName, Count(ItemName) as TotalItem From  PurchaseDeliveryDetail Where 
    EntDate='${EntDate}' ${userRole === 'User' ? "AND UserID='${req.userid}'" :""} AND NOT(DCNO='Prod') Group By PartyName, ItemName Order By PartyName, ItemName`
    const resultIParty_Item_WiseQuery = await sql.query(findIParty_Item_WiseQuery)
    res.status(200).json({
        MasterData:userData, 
        PartyWise:resultPartyWiseQuery.recordset,
        ItemWise: resultItemWiseQuery.recordset,
        Party_Item_Wise: resultIParty_Item_WiseQuery.recordset,
        TotalTruck: TotalTruck,
        TotalItem: TotalItem,
    })

}

const updatedEditStatus = async (req, res) => {
    let UserID
    let DCNO
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            DCNO = req.headers.authorization.split(' ')[1]
            UserID = req.headers.authorization.split(' ')[2]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    await sql.connect(sqlConfig)
    const updatedEditStatusQuery = `Update PurchaseDeliveryMaster Set EditStatus='Yes' Where 
    UserID='${UserID}' AND DCNO='${DCNO}'`
    const updatedEditStatusresult = await sql.query(updatedEditStatusQuery)

    res.status(200).json({
        updatedStatus: updatedEditStatusresult,
    })

}

const BarCode_GRN = async (req, res) => {
    let UserID
    let DCNO
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            DCNO = req.headers.authorization.split(' ')[1]
            UserID = req.headers.authorization.split(' ')[2]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }
    let BarCodeData = []

    await sql.connect(sqlConfig)
    const findForBarCodeQuery = `Select CAST(EntDate AS DATE) AS EntDate, PartyName, RONO, UserID, ItemName, ROUND(CAST (LBS AS decimal (6)),0) as LBS, ROUND(CAST (KG AS decimal (6)),0) as KG From PurchaseDeliveryDetail Where
    UserID='${UserID}' AND DCNO='${DCNO}'`
    const findForBarCoderesult = await sql.query(findForBarCodeQuery)
    await sql.connect(sqlConfig)
    const findPartyCode = `Select * From PartiesInformation Where
    PartyName='${findForBarCoderesult.recordset[0].PartyName}'`
    const PartyCoderesult = await sql.query(findPartyCode)
    await sql.connect(sqlConfig)
    const findUserSerial = `Select * From Users Where ID='${UserID}'`
    const UserSerialresult = await sql.query(findUserSerial)
    for (let index = 0; index < findForBarCoderesult.recordset.length; index++) {
        const myObj = {"PartyCode": PartyCoderesult.recordset[0].PartyOldCode, "RONO": 
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

module.exports = { getMasterData, updatedEditStatus, BarCode_GRN }
