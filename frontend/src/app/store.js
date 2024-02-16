import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import stockReducer from '../features/reports/stockSlice'
import menuReducer from '../features/menu/menuSlice'
import purchaseReducer from '../features/stock/purchase/purchaseDO/purchaseSlice'
import purchaseDeliveryGRNReducer from '../features/stock/purchase/purchaseDeliveryGRN/purchaseDeliveryGRNSlice'
import SalesDeliveryGDNReducer from '../features/stock/sales/salesDeliveryGDNSlice'
import ProductionReducer from '../features/reports/production/productionSlice'
import physicalAuditReducer from '../features/stock/physicalAuditSlice'
import purchaseMasterReducer from '../features/reports/stock/purchase/purchaseSlice'
import reusableReducer from '../features/resuable/reusableSlice';
import stockAdjustmentReducer from '../features/stock/stockAdjustmentSlice'
import partyLedger from '../features/reports/partyLedger/partyLedgerSlice'
import purchaseHistoryMasterDataReducer from '../features/reports/stock/purchase/purchaseHistorySlice'
import salesHistoryMasterDataReducer from '../features/reports/stock/sales/salesHistorySlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    stock: stockReducer,
    menu: menuReducer,
    purchase: purchaseReducer,
    purDeliGRN: purchaseDeliveryGRNReducer,
    saleDeliGDN: SalesDeliveryGDNReducer,
    physicalAudit: physicalAuditReducer,
    PMData:purchaseMasterReducer,
    Prod:ProductionReducer,
    reuse: reusableReducer,
    StockAdj: stockAdjustmentReducer,
    PL: partyLedger,
    PHMD: purchaseHistoryMasterDataReducer,
    SHMD: salesHistoryMasterDataReducer,
  },
});
