const sql = require('mssql')

const sqlConfig = {
    user: 'sa',
    password: 'arifamir',
    database: 'ABM',
    server: '52.6.86.60',
    // database: 'SilverRagsNew',
    // server: '52.6.86.60',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: false // change to true for local dev / self-signed certs
    }
  }
  
  module.exports = sqlConfig