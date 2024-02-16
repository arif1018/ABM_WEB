const sql = require('mssql')
const sqlConfig = require('../Config/dbConfig')
const e = require('express')

const getSuppliers = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`Select * From PartiesInformation Where PartyCategory='Suppliers'`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}

module.exports = { getSuppliers }
