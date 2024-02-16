const sql = require('mssql')
const sqlConfig = require('../Config/dbConfig')
const { GetNewCodewithUserID } = require('../Middleware/allProcedures')


const getAllCities = async (req, res) => {
    try {

    await sql.connect(sqlConfig)
    let allTransactionsQuery = `Select * From Cities Order By CityName`
    const result = await sql.query(allTransactionsQuery)
    res.status(200).json(result.recordset)

    } catch (err) {
    
    }
}

const getAddNewCity = async (req, res) => {
    try {
    const { CityName, CityCode } = req.body
    await sql.connect(sqlConfig)
    let allTransactionsQuery = `INSERT INTO Cities(CityName, CityCode) 
    Values('${CityName}','${CityCode}')`
    const result = await sql.query(allTransactionsQuery)
    res.status(200).json(result.recordset)

    } catch (err) {
    
    }
}

const getDeleteCity = async (req, res) => {
    try {
    const { CityCode } = req.body
    await sql.connect(sqlConfig)
    let allTransactionsQuery = `Delete From  Cities Where CityCode='${CityCode}'`
    const result = await sql.query(allTransactionsQuery)
    res.status(200).json(result.recordset)

    } catch (err) {
    
    }
}

module.exports = { getAllCities, getAddNewCity, getDeleteCity }
