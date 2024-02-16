import React from 'react'
import { Watermark } from '@hirohe/react-watermark';
import StockReport from './admin/StockReport';
export default function Water() {
  return (
    <Watermark text="Mark">
        <StockReport />
  </Watermark>
  )
}
