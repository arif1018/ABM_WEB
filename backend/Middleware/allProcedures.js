const sql = require('mssql')
const sqlConfig = require('../Config/dbConfig')

const GetNewCodewithUserID = async (UserID, TableName, FieldName, FieldLength)=>{
    await sql.connect(sqlConfig)
    const findQuery = `Select ${FieldName} From ${TableName} Where UserID='${UserID}' Order By ${FieldName}`
    const result = await sql.query(findQuery)
    const userData = result.recordset
    if(userData.length > 0){
        TargetField  = userData[userData.length-1][FieldName]
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        TargetField = zeroPad(+[TargetField]+1,FieldLength)
        return TargetField    
    }else{
        TargetField  = "0"
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        TargetField = zeroPad(+[TargetField]+1,FieldLength)
        return TargetField            
    }
}

const GetNewMasterCodewithUserID = async (UserID, TableName, FieldName, FieldLength)=>{

    await sql.connect(sqlConfig)
    const findQuery = `Select * From ${TableName} Where UserID='${UserID}' AND EditStatus='Yes' Order By ${FieldName}`
    const result = await sql.query(findQuery)
    const userData = result.recordset
    if(userData.length > 0){
        TargetField = userData[0].DCNO
        return TargetField
    }else{
    await sql.connect(sqlConfig)
    const findQuery = `Select ${FieldName} From ${TableName} Where UserID='${UserID}' Order By ${FieldName}`
    const result = await sql.query(findQuery)
    const userData = result.recordset
    if(userData.length > 0){
        TargetField  = userData[userData.length-1][FieldName]
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        TargetField = zeroPad(+[TargetField]+1,FieldLength)
        return TargetField    
    }else{
        TargetField  = "0"
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        TargetField = zeroPad(+[TargetField]+1,FieldLength)
        return TargetField            
    }
    }
}

const GetNewCodewithOutUserID = async (TableName, FieldName, FieldLength)=>{
    await sql.connect(sqlConfig)
    const findQuery = `Select ${FieldName} From ${TableName} Order By ${FieldName}`
    const result = await sql.query(findQuery)
    const userData = result.recordset
    if(userData.length > 0){
        TargetField  = userData[userData.length-1][FieldName]
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        TargetField = zeroPad(+[TargetField]+1,FieldLength)
        return TargetField    
    }else{
        TargetField  = "0"
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        TargetField = zeroPad(+[TargetField]+1,FieldLength)
        return TargetField            
    }
}

const dataForMasterTable = async(UserID, TableName, TargetField, TargetValue, OrderField) => {

    await sql.connect(sqlConfig)
    const findQuery = `Select * From ${TableName} Where ${TargetField}='${TargetValue}' AND UserID='${UserID}' Order By ${OrderField}`
    const result = await sql.query(findQuery)
    const userData = result.recordset
    return userData

}

module.exports = { GetNewCodewithUserID, GetNewMasterCodewithUserID, GetNewCodewithOutUserID, dataForMasterTable }
