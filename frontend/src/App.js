import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import Mainpage from './components/MainPage'
import Dashbaord from './components/admin/Dashbaord'
import StockReport from "./components/admin/StockReport";
import PurchaseDODetail from './components/stock/purchase/PurchaseDODetail'
import PurchaseDeliveryGRN from './components/stock/purchase/PurchaseDeliveryGRN'
import Login from "./components/admin/Login";
import SalesDODetail from './components/stock/sales/SalesDoDetail'
import SalesDeliveryGDN from './components/stock/sales/SalesDeliveryGDN'
import StockTransfer from './components/stock/Transfer/Transfer'
import PhysicalAudit from './components/stock/PhysicalAudit'
import PhysicalAuditNew from './components/stock/PhysicalNew'
import ProductionSticker from "./components/admin/reports/ProductionSticker";
import ResAppBar from './components/ResponsiveAppBar'
import ReportPurchaseMaster from './components/admin/reports/stock/purchase/PurchaseGRN'
import ReportPurchaseHistory from './components/admin/reports/stock/purchase/PurchaseHistory'
import ReportSalesHistory from './components/admin/reports/stock/sales/SalesHistory'
import ReportSalesMaster from './components/admin/reports/stock/sales/SalesGDN'
import ProductionForm from "./components/admin/reports/production/Production";
import ReportPartyLedger from "./components/admin/reports/accounts/PartyLedger";
import StockAdjustment from "./components/stock/StockAdjustment";


const theme = createTheme({
  palette: {
    primary: {
      main: '#1D4988'
    },
    secondary: {
      main: '#ffffff',
    },
    custom:{
      main: "#ffffff"
    }
  },
  typography: {
    fontFamily: [
        'Noto Nastaliq Urdu',
        // 'Arial',
        'Times New Roman'
    ].join(','),
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}> 
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Mainpage />}/>
      
      <Route path="/ResAppbar" element={<ResAppBar />}/>
      <Route path="/Login" element={<Login />}/>
      <Route path="/DashBaord" element={<Dashbaord />}/>
      <Route path="/StockReport" element={<StockReport />}/>
      <Route path="/PurchaseDO" element={<PurchaseDODetail />}/>
      <Route path="/PurchaseDeliveryGRN" element={<PurchaseDeliveryGRN />}/>
      <Route path="/SalesDO" element={<SalesDODetail />}/>
      <Route path="/SalesDeliveryGDN" element={<SalesDeliveryGDN />}/>
      <Route path="/Production" element={<ProductionForm />}/>
      <Route path="/StockTransfer" element={<StockTransfer />}/>
      <Route path="/PhysicalAudit" element={<PhysicalAudit />}/>
      <Route path="/PhysicalAuditNew" element={<PhysicalAuditNew />}/>
      <Route path="/Sticker" element={<ProductionSticker />}/>
      <Route path="/Reports/Purchase" element={<ReportPurchaseMaster />}/>
      <Route path="/Reports/PurchaseHistory" element={<ReportPurchaseHistory />}/>
      <Route path="/Reports/Sales" element={<ReportSalesMaster />}/>
      <Route path="/Reports/SalesHistory" element={<ReportSalesHistory />}/>
      <Route path="/Reports/PartyLedger" element={<ReportPartyLedger />}/>
      <Route path="/StockAdjustment" element={<StockAdjustment />}/>

    </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
