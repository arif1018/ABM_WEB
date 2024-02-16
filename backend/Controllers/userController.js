const sql = require('mssql')
const sqlConfig = require('../Config/dbConfig')
const e = require('express')

const userLogin = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const {UserID, Password} = req.body
    let userLoginQuery = `select UserName, ID, Password, AccType, AccNo from users 
    where id = '${UserID}' AND Password='${Password}'`
    const result = await sql.query(userLoginQuery)
    if(result.recordset.length !== 0){
        res.status(200).json(result.recordset)
    }else{
        res.status(200).json({message:"User Not Found"})
    }
    }
    catch (err) {
    
    }
}

const userCreate = async (req, res) => {
    try {
       await sql.connect(sqlConfig)
       const {UserID, UserName, Password, AccType} = req.body
       let userCreateQuery = `Insert Into Users(UserName, ID, Password, AccType, Status)
       Values('${UserName}','${UserID}','${Password}','${AccType}','Active')`

       const result = await sql.query(userCreateQuery)
       res.status(200).json({
           data:result
       })
    } catch (err) {
    }
}

const userGetAllUsers = async (req, res) => {
    try {
    await sql.connect(sqlConfig)
    const result = await sql.query`select ID, UserName from users`
    res.status(200).json(result.recordset)
} catch (err) {
 }
}

module.exports = { userLogin, userCreate, userGetAllUsers }