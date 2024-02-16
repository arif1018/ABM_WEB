const sql = require('mssql')
const sqlConfig = require('../Config/dbConfig')
const { GetNewCodewithUserID } = require('../Middleware/allProcedures')


const getAllAccountType = async (req, res) => {
    try {

    await sql.connect(sqlConfig)
    let allTransactionsQuery = `Select * From AccType Order By AccType`
    const result = await sql.query(allTransactionsQuery)
    res.status(200).json(result.recordset)

    } catch (err) {
    
    }
}

const getAddNewAccountType = async (req, res) => {
    try {
    const { AccCode, AccType } = req.body
    await sql.connect(sqlConfig)
    let allTransactionsQuery = `INSERT INTO AccType(AccCode, AccType, AccStatus) 
    Values('${AccCode}','${AccType}','True')`
    const result = await sql.query(allTransactionsQuery)
    res.status(200).json(result.recordset)

    } catch (err) {
    
    }
}

const getDeleteAccountType = async (req, res) => {
    try {
    const { AccCode, AccType } = req.body
    await sql.connect(sqlConfig)
    let allTransactionsQuery = `Delete From  AccType Where AccCode='${AccCode}'`
    const result = await sql.query(allTransactionsQuery)
    res.status(200).json(result.recordset)

    } catch (err) {
    
    }
}

module.exports = { getAllAccountType, getAddNewAccountType, getDeleteAccountType }
