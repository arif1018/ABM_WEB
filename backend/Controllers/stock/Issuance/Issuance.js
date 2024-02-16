const sql = require('mssql')
const sqlConfig = require('../../../Config/dbConfig')
const { GetNewCodewithUserID } = require('../../../Middleware/allProcedures')

const getNewIssuanceID = async (req, res) => {

    const IssuanceID = await GetNewCodewithUserID(req.userid, 'IssuanceMaster','IssuanceID',10)
    
    try {
        await sql.connect(sqlConfig)
        const insertQuery = `Select * From  IssuanceDetail Where IssuanceID='${IssuanceID}' AND UserID='${req.userid}' Order By RONO`
        const result = await sql.query(insertQuery)
        res.status(200).json({
            DCNO:IssuanceID,
            dataForTable: result.recordset,
        })
            
    } catch (error) {}
}


// EntDate, IssuanceID, UserID, BarCode, OldBarCode, " &
// " RONO, ItemName, LBS, KG, IssuanceCategory, ProLBS, ProKG

module.exports = { getNewDCNO, }
