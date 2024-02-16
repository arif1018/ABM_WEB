const sql = require('mssql')
const sqlConfig = require('../../../../Config/dbConfig')

const getMasterData = async (req, res) => {

    await sql.connect(sqlConfig)
    const purchaseQuery = `Select * From PurchaseDODetail Where NOT(PartyName='Production') AND NOT(PartyName='Opening') Order By EntDate, PartyName, ItemName`
    const resultpurchaseQuery = await sql.query(purchaseQuery)
    res.status(200).json(resultpurchaseQuery.recordset)

}

module.exports = { getMasterData }
