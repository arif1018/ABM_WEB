const sql = require('mssql')
const sqlConfig = require('../../../Config/dbConfig')

let dtActual = []

const getData = async (req, res) => {
    dtActual = []
    let PartyName
    let FromDate
    let ToDate
    let Currency
    let CBDetail
    let Remarks
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            PartyName = req.headers.authorization.split('/')[1]
            FromDate = req.headers.authorization.split('/')[2]
            ToDate = req.headers.authorization.split('/')[3]
            Currency = req.headers.authorization.split('/')[4]
            CBDetail = req.headers.authorization.split('/')[5]

        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    await sql.connect(sqlConfig)
    let masterData = `Select * From GenralJournal Where Remarks='${PartyName}' AND 
    Currency='${Currency}' AND EntDate < '${FromDate}'`
    let resultmasterData = await sql.query(masterData)
    if(resultmasterData.recordset.length > 0){
        await sql.connect(sqlConfig)
        masterData = `Select SUM(Dr) as [Debit], SUM(Cr)  as [Credit] From GenralJournal 
        Where Remarks='${PartyName}' AND 
        Currency='${Currency}' AND EntDate < '${FromDate}'`
        resultmasterData = await sql.query(masterData)

        const myObj = {"EntDate":FromDate, "Remarks":'Opening Balance', "RefNo":'OP', "Debit":0, "Credit":0, "Balance":resultmasterData.recordset[0].Debit - resultmasterData.recordset[0].Credit}
        dtActual.push(myObj)
    }

    await sql.connect(sqlConfig)
    masterData = `Select * From GenralJournal Where Remarks='${PartyName}' AND 
    Currency='${Currency}' AND EntDate Between '${FromDate}' AND '${ToDate}' Order By EntDate`
    resultmasterData = await sql.query(masterData)
    if(resultmasterData.recordset.length > 0){
        const OpeningStatus = resultmasterData.recordset[0].RefNo.substr(0, 15) === 'Opening Balance' ? 'Opening' : 'Not Opening'
        console.log(OpeningStatus)
    }else{
        console.log('Record Not Found')
    }
    for (let index = 0; index < resultmasterData.recordset.length; index++) {
        
        // For Opening
        if(resultmasterData.recordset[index].RefNo.substr(0, 15) === 'Opening Balance'){
            if(dtActual.length > 0){
                const myObj = {"EntDate":resultmasterData.recordset[index].EntDate, "Remarks":'Opening Balance', "RefNo":'Opening Ref', "Debit":resultmasterData.recordset[index].Dr, 
                "Credit":resultmasterData.recordset[index].Cr, "Balance":dtActual[dtActual.length - 1].Balance + resultmasterData.recordset[index].Cr - resultmasterData.recordset[index].Cr}
                dtActual.push(myObj)
            }else{
                const myObj = {"EntDate":resultmasterData.recordset[index].EntDate, "Remarks":'Opening Balance', "RefNo":'Opening Ref', "Debit":resultmasterData.recordset[index].Dr, 
                "Credit":resultmasterData.recordset[index].Cr, "Balance":resultmasterData.recordset[index].Dr - resultmasterData.recordset[index].Cr}
                dtActual.push(myObj)
            }
        }

        // For Purchase
        if(resultmasterData.recordset[index].RefNo.substr(0, 8) === "Purchase"){
            if(resultmasterData.recordset[index].RefNo.substr(0, 14) === "Purchase Local"){
                await sql.connect(sqlConfig)
                const purchaseData = `Select * From PurchaseDODetail Where 
                DONO='${resultmasterData.recordset[index].RefNo.substring(0,36).substr(-10)}' AND 
                UserID='${resultmasterData.recordset[index].RefNo.substring(0, 
                resultmasterData.recordset[index].RefNo.length).
                substr(-(resultmasterData.recordset[index].RefNo.length-47))}'`
                const resultpurchaseData = await sql.query(purchaseData)
                Remarks = `Local Purchase Bill NO : ${resultmasterData.recordset[index].RefNo.substring(0,36).substr(-10)}`
                if(CBDetail){
                    for (let purchaseDataindex = 0; purchaseDataindex < resultpurchaseData.recordset.length; purchaseDataindex++) {
                        const PDOData = `Select * From PurchaseDODetail Where 
                        RONO='${resultpurchaseData.recordset[purchaseDataindex].RONO}' AND UserID='${resultpurchaseData.recordset[purchaseDataindex].UserID}'`
                        const resultPDOData = await sql.query(PDOData)
                        Remarks = `${Remarks} ${purchaseDataindex+1}/${resultPDOData.recordset.length} (Item : ${resultPDOData.recordset[purchaseDataindex].ItemName} Qnty : ${resultPDOData.recordset[purchaseDataindex].Quantity} Rate : ${resultPDOData.recordset[purchaseDataindex].RR})`
                    }
                }
                if(dtActual.length > 0){
                    const myObj = {"EntDate":resultmasterData.recordset[index].EntDate, "Remarks":Remarks, "RefNo":`PIL ${resultmasterData.recordset[index].RefNo.substring(0,36).substr(-10)}`, "Debit":resultmasterData.recordset[index].Dr, 
                    "Credit":resultmasterData.recordset[index].Cr, "Balance":dtActual[dtActual.length - 1].Balance + resultmasterData.recordset[index].Dr - resultmasterData.recordset[index].Cr}
                    dtActual.push(myObj)
                }else{
                    console.log('Record Not Found')
                    const myObj = {"EntDate":resultmasterData.recordset[index].EntDate, "Remarks":Remarks, "RefNo":`PIL ${resultmasterData.recordset[index].RefNo.substring(0,36).substr(-10)}`, "Debit":resultmasterData.recordset[index].Dr, 
                    "Credit":resultmasterData.recordset[index].Cr, "Balance":resultmasterData.recordset[index].Dr - resultmasterData.recordset[index].Cr}
                    dtActual.push(myObj)
                }
    
        }
        // ElseIf Microsoft.VisualBasic.Left(dt.Rows(i).Item("RefNo"), 15) = "Purchase Return" Then
        //     Dim daDispatch As New SqlDataAdapter("Select * From PurchaseReturnDetail Where RInvoiceNo='" &
        //     Microsoft.VisualBasic.Right(Microsoft.VisualBasic.Left(dt.Rows(i).Item("RefNo"), 37), 10) & "' " &
        //     " AND UserID='" & Microsoft.VisualBasic.Right(dt.Rows(i).Item("RefNo"), Len(dt.Rows(i).Item("RefNo")) - 48) & "'", con)
        //     Dim dtDispatch As New DataTable
        //     daDispatch.Fill(dtDispatch)
        //     Remarks = "Purchase Return On Invoice No : " +
        //     Microsoft.VisualBasic.Right(Microsoft.VisualBasic.Left(dt.Rows(i).Item("RefNo"), 37), 10) +
        //     " User ID : " +
        //     Microsoft.VisualBasic.Right(dt.Rows(i).Item("RefNo"), Len(dt.Rows(i).Item("RefNo")) - 48)
        //     If CBDetail.Checked = True Then
        //         For a = 0 To dtDispatch.Rows.Count - 1
        //             Dim daPDO As New SqlDataAdapter("Select * From PurchaseReturnDetail Where RONO='" &
        //             dtDispatch.Rows(a).Item("RONO") & "' AND UserID='" & dtDispatch.Rows(a).Item("UserID") & "'", con)
        //             Dim dtPDO As New DataTable
        //             daPDO.Fill(dtPDO)
        //             Remarks = Remarks + " " + (a + 1).ToString + "/" + dtDispatch.Rows.Count.ToString + "(Item : " + dtDispatch.Rows(a).Item("ItemName") +
        //             " Qnty : " + dtDispatch.Rows(a).Item(dtDispatch.Rows(a).Item("ItemUnit") + "Quantity").ToString +
        //             " Rate : " + dtPDO.Rows(0).Item("ItemRate").ToString + ")"
        //         Next
        //     End If
        //     If dtActual.Rows.Count > 0 Then
        //         dtActual.Rows.Add(dt.Rows(i).Item("EntDate"), Remarks, "PIR - " + Microsoft.VisualBasic.Right(Microsoft.VisualBasic.Left(dt.Rows(i).Item("RefNo"), 37), 10), dt.Rows(i).Item("Dr"), 0, dtActual.Rows(dtActual.Rows.Count - 1).Item("Balance") + dt.Rows(i).Item("Dr") - dt.Rows(i).Item("Cr"))
        //     Else
        //         dtActual.Rows.Add(dt.Rows(i).Item("EntDate"), Remarks, "PIR - " + Microsoft.VisualBasic.Right(Microsoft.VisualBasic.Left(dt.Rows(i).Item("RefNo"), 37), 10), dt.Rows(i).Item("Dr"), 0, dt.Rows(i).Item("Dr") - dt.Rows(i).Item("Cr"))
        //     End If
        if(resultmasterData.recordset[index].RefNo.substr(0, 19) === "Purchase On Gate In"){

                await sql.connect(sqlConfig)
                const purchaseData = `Select * From GateInDetail Where GateInRef=
                '${resultmasterData.recordset[index].RefNo.substring(0,33).substr(-10)}' AND UserID='${resultmasterData.recordset[index].RefNo.substring(0, 
                resultmasterData.recordset[index].RefNo.length).substr(-(resultmasterData.recordset[index].RefNo.length-44))}'`
                const resultpurchaseData = await sql.query(purchaseData)
               
                Remarks = `Purchase On Gate In : ${resultmasterData.recordset[index].RefNo.substring(0,33).substr(-10)} User ID : ${resultmasterData.recordset[index].RefNo.substring(0, resultmasterData.recordset[index].RefNo.length).substr(-(resultmasterData.recordset[index].RefNo.length-44))}`

                if(CBDetail){
                    for (let purchaseDataindex = 0; purchaseDataindex < resultpurchaseData.recordset.length; purchaseDataindex++) {
                        const PDOData = `Select * From GateInDetail Where RONO='${resultpurchaseData.recordset[purchaseDataindex].RONO}' AND 
                        UserID='${resultpurchaseData.recordset[purchaseDataindex].UserID}'`
                        const resultPDOData = await sql.query(PDOData)
                        Remarks = `${Remarks} ${purchaseDataindex+1}/${resultPDOData.recordset.length} (Item : ${resultPDOData.recordset[purchaseDataindex].ItemName} Qnty : ${resultPDOData.recordset[purchaseDataindex].ItemQuantity} Rate : ${resultPDOData.recordset[purchaseDataindex].ItemRate})`
                    }
                }
                if(dtActual.length > 0){
                    const myObj = {"EntDate":resultmasterData.recordset[index].EntDate, "Remarks":Remarks, "RefNo":`PIR ${resultmasterData.recordset[index].RefNo.substring(0,36).substr(-10)}`, "Debit":resultmasterData.recordset[index].Dr, 
                    "Credit":resultmasterData.recordset[index].Cr, "Balance":dtActual[dtActual.length - 1].Balance + resultmasterData.recordset[index].Dr - resultmasterData.recordset[index].Cr}
                    dtActual.push(myObj)
                }else{
                    console.log('Record Not Found')
                    const myObj = {"EntDate":resultmasterData.recordset[index].EntDate, "Remarks":Remarks, "RefNo":`PIR ${resultmasterData.recordset[index].RefNo.substring(0,36).substr(-10)}`, "Debit":resultmasterData.recordset[index].Dr, 
                    "Credit":resultmasterData.recordset[index].Cr, "Balance":resultmasterData.recordset[index].Dr - resultmasterData.recordset[index].Cr}
                    dtActual.push(myObj)
                }
            }
        }
    }
    res.status(200).json(
        dtActual
    )
}

module.exports = { getData }