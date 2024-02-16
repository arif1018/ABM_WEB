import React from 'react'
import Navbar from './Navbar'
import StockTable from './StockTable'
import DBMenu from './NavbarDynamic'
export default function StockReport() {
  return (
    <div>
      <Navbar/>
      <DBMenu />
      <StockTable/>
    </div>
  )
}
