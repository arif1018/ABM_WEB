const dotenv = require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const {errorHandler} = require('./Middleware/errorHandlerMiddleware')


app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/users/', require('./Routes/userRoute'))
app.use('/stock/', require('./Routes/stock/stockRoute'))
app.use('/menu/', require('./Routes/menuRoute'))
app.use('/accType/', require('./Routes/accTypeRoute'))
app.use('/cities/', require('./Routes/citiesRoute'))
app.use('/transactions/', require('./Routes/transactionsRoute'))
app.use('/purchaseGRN/', require('./Routes/stock/purchase/purchaseDeliveryGRNRoute'))
app.use('/salesGDN/', require('./Routes/stock/sales/salesDeliveryGDNRoute'))
app.use('/production/', require('./Routes/Reports/Production/productionRoute'))
app.use('/reUsable', require('./Routes/reusableRoute'))
app.use('/physical/', require('./Routes/stock/physicalRoute'))
app.use('/report/purchase/', require('./Routes/Reports/Stock/Purchase/PurchaseGRNRoute'))
app.use('/report/purchaseHistory/', require('./Routes/Reports/Stock/Purchase/PurchaseHistoryRoute'))
app.use('/report/salesHistory/', require('./Routes/Reports/Stock/Sales/SalesHistoryRoute'))
app.use('/report/sales/', require('./Routes/Reports/Stock/Sales/SalesGDN'))
app.use('/report/Accounts/', require('./Routes/Reports/Accounts/partyLedgerRoute'))


app.use(errorHandler)

app.listen(process.env.PORT, ()=>{console.log(`Server is running on port ${process.env.PORT}`)})