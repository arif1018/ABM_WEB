const sql = require('mssql')
const sqlConfig = require('../Config/dbConfig')
const { GetNewCodewithUserID } = require('../Middleware/allProcedures')

const getTransID = async (req, res) => {

    const TransID = await GetNewCodewithUserID(req.userid, 'Transactions','TransID',10)

}

const getAllTransactions = async (req, res) => {
    try {

        await sql.connect(sqlConfig)
    let allTransactionsQuery = `Select Top 1 * From Transactions Order By EntDate`
    const result = await sql.query(allTransactionsQuery)
    res.status(200).json(result.recordset)

    } catch (err) {
    
    }
}

const getTransactionsAddressWise = async (req, res) => {
    try {
        
        await sql.connect(sqlConfig)
        let allTransactionsQuery = `Select * From Transactions Where ReceiverAddress='${req.query.ReceiverAddress}' AND ReceiverStatus='No'`        
        const result = await sql.query(allTransactionsQuery)
        res.status(200).json(result.recordset)

    }
    catch (err) {

    }
}

const updatedReceiverStatus = async (req, res) => {
    try {
        await sql.connect(sqlConfig)
        const { ReceiverAddress, TransID } = req.body
        let updatedReceiverStatusQuery = `Update Transactions Set ReceiverStatus='Yes' Where 
        ReceiverAddress='${ReceiverAddress}' AND TransID='${TransID}'`
    
        const updatedReceiverStatusResult = await sql.query(updatedReceiverStatusQuery)
        res.status(200).json(updatedReceiverStatusResult.recordset)
    } 
    catch (err) {

    }
}

const AddNewRecord = async (req, res) => {
    let UserID
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            UserID = req.headers.authorization.split(' ')[1]
        } catch (error) {
            res.status(401)
            throw new Error('Not Authorized!...')
        }
    }

    const TransID = await GetNewCodewithUserID(UserID, 'Transactions', 'TransID', 10)

    try {
        const { EntDate, Sender, Receiver, ReceiverAddress, Amount } = req.body
    await sql.connect(sqlConfig)
    const insertQuery = `INSERT INTO Transactions(EntDate, UserID, TransID, Sender, Receiver, ReceiverAddress, 
        Amount, ReceiverStatus) Values('${EntDate}','arif','${TransID}','${Sender}','${Receiver}','${ReceiverAddress}',
        '${Amount}','No')`
    const result = await sql.query(insertQuery)
    res.status(200).json(result)
} catch (err) {
 }
}


module.exports = { getAllTransactions, getTransactionsAddressWise, updatedReceiverStatus, getTransID, AddNewRecord }

