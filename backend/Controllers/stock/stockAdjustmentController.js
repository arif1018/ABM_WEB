const sql = require('mssql')
const sqlConfig = require('../../Config/dbConfig')
const e = require('express')
const { dataForMasterTable, GetNewCodewithUserID } = require('../../Middleware/allProcedures')
const date = require('date-and-time')
let GUserID

const getDataByBarCode = async (req, res) => {
    
    let withoutBearer
    let UserID
    let PDRONO
    let QueryCondition
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            withoutBearer = req.headers.authorization.split(' ')[1]
            PDRONO = withoutBearer.split('-')[0]
            UserID = withoutBearer.split('-')[1]
        } catch (error) {
            res.status(200).json({message:"Token Not Found"})
        }
    }
    try {
        let resultForItemDetail
        if(PDRONO.slice(0,1) !== "0"){
            QueryCondition = `BarCode='${PDRONO}-${UserID}'`
        }else{
            await sql.connect(sqlConfig)
            const findQuery = `Select * From Users Where UserSerial='${UserID}'`
            const result = await sql.query(findQuery)
            UserID = result.recordset[0].ID 
            QueryCondition = `UserID='${UserID}' AND RONO='${PDRONO}'`
        }
        await sql.connect(sqlConfig)
        const findQueryForItemDetail = `Select * From PurchaseDeliveryDetail Where ${QueryCondition}`
        resultForItemDetail = await sql.query(findQueryForItemDetail)
        if(resultForItemDetail.recordset.length > 0){
        res.status(200).json({message:"Record already added!.."})
        }else{
            await sql.connect(sqlConfig)
            const findQueryForItemDetail27082023 = `Select * From PurchaseDeliveryDetail27082023 Where ${QueryCondition}`
            const resultForItemDetail27082023 = await sql.query(findQueryForItemDetail27082023)
            if(resultForItemDetail27082023.recordset.length > 0){
                res.status(200).json(
                    resultForItemDetail27082023.recordset
                )
            }else{
                await sql.connect(sqlConfig)
                const findQueryForItemDetailOld = `Select * From PurchaseDeliveryDetailOld Where ${QueryCondition}`
                const resultForItemDetailOld = await sql.query(findQueryForItemDetailOld)
                if(resultForItemDetailOld.recordset.length > 0){
                    res.status(200).json(
                        resultForItemDetailOld.recordset
                    )
                }else{
                    await sql.connect(sqlConfig)
                    const findQueryForItemDetail = `Select * From ${PDRONO.slice(0,1) === "G" ? "tbl_GRN_Detail" : "tbl_Bale_Prd"} Where ${PDRONO.slice(0,1) === "G" ? `G_DID='${PDRONO}-${UserID}'` : `Bale_ID='${PDRONO}-${UserID}'`}`
                    resultForItemDetail = await sql.query(findQueryForItemDetail)
                    const findQueryForItemName = `Select * From tbl_Item Where Item_Code=${PDRONO.slice(0,1) === "G" ? `${resultForItemDetail.recordset[0].Item_Code}` : `${resultForItemDetail.recordset[0].item_code}`}`
                    resultForItemName = await sql.query(findQueryForItemName)
                    if(PDRONO.slice(0,1) === "G"){
                        const findQueryForGRNID = `Select * From tbl_GRN_M Where GRN_ID='${resultForItemDetail.recordset[0].GRN_ID}'`
                        resultForGRNID = await sql.query(findQueryForGRNID)
                        const findQueryForPartyName = `Select * From tbl_Account_L_Four Where Level_Four_ID='${resultForGRNID.recordset[0].Level_Four_ID}'`
                        resultForPartyName = await sql.query(findQueryForPartyName)
                    }
                    let resData = []
                    const myObj =  {"ItemName": resultForItemName.recordset[0].Item_Name, 
                        "KG":(PDRONO.slice(0,1) === "G" ? Math.round(resultForItemDetail.recordset[0].Item_Weight / 2.20462) : 
                        Math.round(resultForItemDetail.recordset[0].Bale_Weight / 2.20462)), 
                        "LBS":(PDRONO.slice(0,1) === "G" ? resultForItemDetail.recordset[0].Item_Weight : 
                        resultForItemDetail.recordset[0].Bale_Weight), "Quantity":1, "Packing":1}
                    resData.push(myObj)
                    res.status(200).json(resData)
                }    
            }
        }
    } catch (err) {
    
    }
}

const getDataForTable = async (req, res) => {

    let UserID

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            UserID = req.headers.authorization.split(' ')[1]
        } catch (error) {
            res.status(200).json({message:"Token Not Found"})
        }
    }

    await sql.connect(sqlConfig)

    const VoucherNo = await GetNewCodewithUserID(UserID,'StockAdjustmentMaster', 'VoucherNo',10)

    const tableData = await dataForMasterTable(UserID, "StockAdjustmentDetail", "VoucherNo", VoucherNo, "RONO")

    res.status(200).json(tableData)



}
const addRecordNotAdded = async (req, res) => {
    let withoutBearer
    let UserID
    let PDRONO
    let QueryCondition
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            withoutBearer = req.headers.authorization.split(' ')[1]
            PDRONO = withoutBearer.split('-')[0]
            UserID = withoutBearer.split('-')[1]
        } catch (error) {
            res.status(200).json({message:"Token Not Found"})
        }
    }
    try {
        const { EntDate, EntUserID, Floor } = req.body
        GUserID = EntUserID
        let resultForItemDetail
        if(PDRONO.slice(0,1) !== "0"){
            QueryCondition = `BarCode='${PDRONO}-${UserID}'`
        }else{
            await sql.connect(sqlConfig)
            const findQuery = `Select * From Users Where UserSerial='${UserID}'`
            const result = await sql.query(findQuery)
            UserID = result.recordset[0].ID 
            QueryCondition = `UserID='${UserID}' AND RONO='${PDRONO}'`
        }
        await sql.connect(sqlConfig)
        const findQueryForItemDetail = `Select * From PurchaseDeliveryDetail Where ${QueryCondition}`
        resultForItemDetail = await sql.query(findQueryForItemDetail)
        if(resultForItemDetail.recordset.length > 0){
        res.status(200).json({message:"Record already added!.."})
        }else{

        await sql.connect(sqlConfig)
        const findQueryForItemDetail = `Select * From PurchaseDeliveryDetail27082023 Where ${QueryCondition}`
        resultForItemDetail = await sql.query(findQueryForItemDetail)
        if(resultForItemDetail.recordset.length > 0){
            if(PDRONO.slice(0,1) === "0"){
                await sql.connect(sqlConfig)
                const insertQuery = `Insert Into PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
                PartyName, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) 
                Values('${date.format(resultForItemDetail.recordset[0].EntDate, 'YYYY-MM-DD')}',
                '${resultForItemDetail.recordset[0].DCNO}','${resultForItemDetail.recordset[0].DONO}',
                '${resultForItemDetail.recordset[0].MadeID}','${resultForItemDetail.recordset[0].UserID}',
                '${resultForItemDetail.recordset[0].RONO}','${resultForItemDetail.recordset[0].PartyName}',
                '${resultForItemDetail.recordset[0].ItemName}',
                '1','1','${resultForItemDetail.recordset[0].KG}','${resultForItemDetail.recordset[0].LBS}',
                '${resultForItemDetail.recordset[0].Location}','No')`
                const result = await sql.query(insertQuery)

                const StAdjRONO = await GetNewCodewithUserID(EntUserID,'StockAdjustmentDetail', 'RONO',10)
                const VoucherNo = await GetNewCodewithUserID(EntUserID,'StockAdjustmentMaster', 'VoucherNo',10)

                await sql.connect(sqlConfig)
                const insertStockAdjQuery = `INSERT INTO StockAdjustmentDetail(EntDate, VoucherNo, UserID, RONO, 
                BarCode, ItemName, KG, LBS, Quantity, Packing) Values('${EntDate}','${VoucherNo}','${EntUserID}',
                '${StAdjRONO}','${withoutBearer.split('-')[0]}-${withoutBearer.split('-')[1]}',
                '${resultForItemDetail.recordset[0].ItemName}','${resultForItemDetail.recordset[0].KG}',
                '${resultForItemDetail.recordset[0].LBS}','1','1')`
                const resultStockAdjQuery = await sql.query(insertStockAdjQuery)
            }else{
                await sql.connect(sqlConfig)
                const insertQuery = `Insert Into PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
                PartyName, BarCode, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) 
                Values('${date.format(resultForItemDetail.recordset[0].EntDate, 'YYYY-MM-DD')}',
                '${resultForItemDetail.recordset[0].DCNO}','${resultForItemDetail.recordset[0].DONO}',
                '${resultForItemDetail.recordset[0].MadeID}','${resultForItemDetail.recordset[0].UserID}',
                '${resultForItemDetail.recordset[0].RONO}','${resultForItemDetail.recordset[0].PartyName}',
                '${resultForItemDetail.recordset[0].BarCode}','${resultForItemDetail.recordset[0].ItemName}',
                '1','1','${resultForItemDetail.recordset[0].KG}','${resultForItemDetail.recordset[0].LBS}',
                '${resultForItemDetail.recordset[0].Location}','No')`
                const result = await sql.query(insertQuery)


                const StAdjRONO = await GetNewCodewithUserID(EntUserID,'StockAdjustmentDetail', 'RONO',10)
                const VoucherNo = await GetNewCodewithUserID(EntUserID,'StockAdjustmentMaster', 'VoucherNo',10)

                await sql.connect(sqlConfig)
                const insertStockAdjQuery = `INSERT INTO StockAdjustmentDetail(EntDate, VoucherNo, UserID, RONO, 
                BarCode, ItemName, KG, LBS, Quantity, Packing) Values('${EntDate}','${VoucherNo}','${EntUserID}',
                '${StAdjRONO}','${withoutBearer.split('-')[0]}-${withoutBearer.split('-')[1]}',
                '${resultForItemDetail.recordset[0].ItemName}','${resultForItemDetail.recordset[0].KG}',
                '${resultForItemDetail.recordset[0].LBS}','1','1')`
                const resultStockAdjQuery = await sql.query(insertStockAdjQuery)
            }
        }else{
            await sql.connect(sqlConfig)
            const findQueryForItemDetail = `Select * From PurchaseDeliveryDetailOld Where ${QueryCondition}`
            resultForItemDetail = await sql.query(findQueryForItemDetail)
            if(resultForItemDetail.recordset.length > 0){
            if(PDRONO.slice(0,1) === "0"){
                await sql.connect(sqlConfig)
                const insertQuery = `Insert Into PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
                PartyName, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) 
                Values('${date.format(resultForItemDetail.recordset[0].EntDate, 'YYYY-MM-DD')}',
                '${resultForItemDetail.recordset[0].DCNO}','${resultForItemDetail.recordset[0].DONO}',
                '${resultForItemDetail.recordset[0].MadeID}','${resultForItemDetail.recordset[0].UserID}',
                '${resultForItemDetail.recordset[0].RONO}','${resultForItemDetail.recordset[0].PartyName}',
                '${resultForItemDetail.recordset[0].ItemName}',
                '1','1','${resultForItemDetail.recordset[0].KG}','${resultForItemDetail.recordset[0].LBS}',
                '${resultForItemDetail.recordset[0].Location}','No')`
                const result = await sql.query(insertQuery)

                const StAdjRONO = await GetNewCodewithUserID(EntUserID,'StockAdjustmentDetail', 'RONO',10)

                const VoucherNo = await GetNewCodewithUserID(EntUserID,'StockAdjustmentMaster', 'VoucherNo',10)

                await sql.connect(sqlConfig)
                const insertStockAdjQuery = `INSERT INTO StockAdjustmentDetail(EntDate, VoucherNo, UserID, RONO, 
                BarCode, ItemName, KG, LBS, Quantity, Packing) Values('${EntDate}','${VoucherNo}','${EntUserID}',
                '${StAdjRONO}','${withoutBearer.split('-')[0]}-${withoutBearer.split('-')[1]}',
                '${resultForItemDetail.recordset[0].ItemName}','${resultForItemDetail.recordset[0].KG}',
                '${resultForItemDetail.recordset[0].LBS}','1','1')`
                const resultStockAdjQuery = await sql.query(insertStockAdjQuery)
            }else{
                await sql.connect(sqlConfig)
                const insertQuery = `Insert Into PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
                PartyName, BarCode, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) 
                Values('${date.format(resultForItemDetail.recordset[0].EntDate, 'YYYY-MM-DD')}',
                '${resultForItemDetail.recordset[0].DCNO}','${resultForItemDetail.recordset[0].DONO}',
                '${resultForItemDetail.recordset[0].MadeID}','${resultForItemDetail.recordset[0].UserID}',
                '${resultForItemDetail.recordset[0].RONO}','${resultForItemDetail.recordset[0].PartyName}',
                '${resultForItemDetail.recordset[0].BarCode}','${resultForItemDetail.recordset[0].ItemName}',
                '1','1','${resultForItemDetail.recordset[0].KG}','${resultForItemDetail.recordset[0].LBS}',
                '${resultForItemDetail.recordset[0].Location}','No')`
                const result = await sql.query(insertQuery)

                const StAdjRONO = await GetNewCodewithUserID(EntUserID,'StockAdjustmentDetail', 'RONO',10)

                const VoucherNo = await GetNewCodewithUserID(EntUserID,'StockAdjustmentMaster', 'VoucherNo',10)

                await sql.connect(sqlConfig)
                const insertStockAdjQuery = `INSERT INTO StockAdjustmentDetail(EntDate, VoucherNo, UserID, RONO, 
                BarCode, ItemName, KG, LBS, Quantity, Packing) Values('${EntDate}','${VoucherNo}','${EntUserID}',
                '${StAdjRONO}','${withoutBearer.split('-')[0]}-${withoutBearer.split('-')[1]}',
                '${resultForItemDetail.recordset[0].ItemName}','${resultForItemDetail.recordset[0].KG}',
                '${resultForItemDetail.recordset[0].LBS}','1','1')`
                const resultStockAdjQuery = await sql.query(insertStockAdjQuery)
            }
        }else{
            console.log('Reach 1')
            await sql.connect(sqlConfig)
            const findQueryForItemDetail = `Select * From ${PDRONO.slice(0,1) === "G" ? "tbl_GRN_Detail" : "tbl_Bale_Prd"} Where ${PDRONO.slice(0,1) === "G" ? `G_DID='${PDRONO}-${UserID}'` : `Bale_ID='${PDRONO}-${UserID}'`}`
            resultForItemDetail = await sql.query(findQueryForItemDetail)
        
            const findQueryForItemName = `Select * From tbl_Item Where Item_Code=${PDRONO.slice(0,1) === "G" ? `${resultForItemDetail.recordset[0].Item_Code}` : `${resultForItemDetail.recordset[0].item_code}`}`
            resultForItemName = await sql.query(findQueryForItemName)
            if(PDRONO.slice(0,1) === "G"){
                const findQueryForGRNID = `Select * From tbl_GRN_M Where GRN_ID='${resultForItemDetail.recordset[0].GRN_ID}'`
                resultForGRNID = await sql.query(findQueryForGRNID)
                const findQueryForPartyName = `Select * From tbl_Account_L_Four Where Level_Four_ID='${resultForGRNID.recordset[0].Level_Four_ID}'`
                resultForPartyName = await sql.query(findQueryForPartyName)
            }
            if(resultForItemDetail.recordset.length > 0){
            if(PDRONO.slice(0,1) === "G"){

                const NewPDRONO = await GetNewCodewithUserID(GUserID, 'PurchaseDeliveryDetail', 'RONO',10)

                await sql.connect(sqlConfig)
                const insertQuery = `Insert Into PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
                PartyName, BarCode, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) 
                Values('${date.format(resultForItemDetail.recordset[0].Item_Date, 'YYYY-MM-DD')}',
                'Adjusted','Adjusted','Adjusted','${GUserID}',
                '${NewPDRONO}','${resultForPartyName.recordset[0].Level_Four_Name.toUpperCase()}',
                '${PDRONO}-${UserID}','${resultForItemName.recordset[0].Item_Name.toUpperCase()}',
                '1','1','${Math.round(resultForItemDetail.recordset[0].Item_Weight / 2.20462)}',
                '${resultForItemDetail.recordset[0].Item_Weight}','${Floor}','No')`
                const result = await sql.query(insertQuery)

                const { EntDate, EntUserID } = req.body

                const StAdjRONO = await GetNewCodewithUserID(EntUserID,'StockAdjustmentDetail', 'RONO',10)

                const VoucherNo = await GetNewCodewithUserID(EntUserID,'StockAdjustmentMaster', 'VoucherNo',10)

                await sql.connect(sqlConfig)
                const insertStockAdjQuery = `INSERT INTO StockAdjustmentDetail(EntDate, VoucherNo, UserID, RONO, 
                BarCode, ItemName, KG, LBS, Quantity, Packing) Values('${EntDate}','${VoucherNo}','${EntUserID}',
                '${StAdjRONO}','${withoutBearer.split('-')[0]}-${withoutBearer.split('-')[1]}',
                '${resultForItemName.recordset[0].Item_Name.toUpperCase()}',
                '${Math.round(resultForItemDetail.recordset[0].Item_Weight / 2.20462)}',
                '${resultForItemDetail.recordset[0].Item_Weight}','1','1')`
                const resultStockAdjQuery = await sql.query(insertStockAdjQuery)
            }else{
                console.log('reach')
                const NewPDRONO = await GetNewCodewithUserID(GUserID, 'PurchaseDeliveryDetail', 'RONO',10)

                await sql.connect(sqlConfig)
                const insertQuery = `Insert Into PurchaseDeliveryDetail(EntDate, DCNO, DONO, MadeID, UserID, RONO, 
                PartyName, BarCode, ItemName, Packing, Quantity, KG, LBS, Location, IssueStatus) 
                Values('${date.format(resultForItemDetail.recordset[0].Bale_Date, 'YYYY-MM-DD')}',
                'Adjusted','Adjusted','Adjusted','${GUserID}',
                '${NewPDRONO}','${resultForItemDetail.recordset[0].Code}',
                '${resultForItemDetail.recordset[0].Bale_ID}',
                '${resultForItemName.recordset[0].Item_Name.toUpperCase()}',
                '1','1','${Math.round(resultForItemDetail.recordset[0].Bale_Weight / 2.20462)}',
                '${resultForItemDetail.recordset[0].Bale_Weight}',
                '${Floor}','No')`
                const result = await sql.query(insertQuery)

                const { EntDate, EntUserID } = req.body

                const StAdjRONO = await GetNewCodewithUserID(EntUserID,'StockAdjustmentDetail', 'RONO',10)

                const VoucherNo = await GetNewCodewithUserID(EntUserID,'StockAdjustmentMaster', 'VoucherNo',10)

                await sql.connect(sqlConfig)
                const insertStockAdjQuery = `INSERT INTO StockAdjustmentDetail(EntDate, VoucherNo, UserID, RONO, 
                BarCode, ItemName, KG, LBS, Quantity, Packing) Values('${EntDate}','${VoucherNo}','${EntUserID}',
                '${StAdjRONO}','${withoutBearer.split('-')[0]}-${withoutBearer.split('-')[1]}',
                '${resultForItemName.recordset[0].Item_Name.toUpperCase()}',
                '${Math.round(resultForItemDetail.recordset[0].Bale_Weight / 2.20462)}',
                '${resultForItemDetail.recordset[0].Bale_Weight}','1','1')`
                const resultStockAdjQuery = await sql.query(insertStockAdjQuery)
            }
        }
        }
        }

        const VoucherNo = await GetNewCodewithUserID(EntUserID,'StockAdjustmentMaster', 'VoucherNo',10)
        const tableData = await dataForMasterTable(GUserID, "StockAdjustmentDetail", "VoucherNo", VoucherNo, "RONO")
        res.status(200).json(tableData)
        }
    } catch (err) {

    }
}

module.exports = { getDataByBarCode, getDataForTable, addRecordNotAdded }