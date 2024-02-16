const sql = require('mssql')
const sqlConfig = require('../../../../Config/dbConfig')
const { dataForMasterTable } = require('../../../../Middleware/allProcedures')

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

module.exports = { getMasterData }
