import React, { useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Svg, Line } from '@react-pdf/renderer';
import { PDFViewer, Font } from '@react-pdf/renderer';
import TimesNewRoman from './DMSerifDisplay-Regular.ttf'
import NewTextBarCodeFont from './LibreBarcode39Text-Regular.ttf'
import { useSelector, useDispatch } from 'react-redux';
import { BarCode_GRN } from '../../../features/reports/stock/purchase/purchaseSlice'
import dayjs from 'dayjs';
import Navbar from '../Navbar'
import DBMenu from '../NavbarDynamic'


Font.register({
  family: 'BarCodeFont',
  fonts: [
    {
      src: NewTextBarCodeFont,
    },

  ],
});

Font.register({
  family: 'TimesNewRoman',
  fonts: [
    {
      src: TimesNewRoman,
      fontWeight:'500'
    },

  ],
});
// Create styles
const styles = StyleSheet.create({
  // page: {
  //   flexDirection: 'row',
  //   backgroundColor: '#E4E4E4'
  // },
  section: {
    // fontFamily:'Times New Roman',
  },
  text:{
    // marginLeft:'10px',
    marginTop:'10px',
    fontFamily:'BarCodeFont',
    fontSize:'35px',
    textAlign:'center',
  },
  ForTNR:{
    fontFamily:'TimesNewRoman',
    textAlign:'center',
  },
  ForWeight:{
    fontFamily:'TimesNewRoman',
    textAlign:'center',
    display:'flex', 
    flexDirection:'row'
  }
  
});

function ProductionSticker(){
  const dispatch = useDispatch()
  const { user } = useSelector((state)=>state.auth)
  const { DataForBarCode } = useSelector((state)=>state.PMData.BarCodeData)


  useEffect(()=>{

    dispatch(BarCode_GRN(localStorage.getItem('DCNOForSticker')+" "+user[0].ID))

  },[ dispatch, user ])
  const date = new Date()
  const formatedDate = date.toLocaleDateString('en-GB')
  console.log(formatedDate)
  return(
    <PDFViewer height={400} width={'100%'}>
  <Document>
        {DataForBarCode ? (DataForBarCode.map((item)=>(
    <Page size={{width:4*72, height:4*72}}>

      <View>
          <Text style={{textAlign:'center', marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'25px'}}>{item.PartyCode}</Text>
      <Svg height="10" width="495">
          <Line x1="5" y1="5" x2="280" y2="5" strokeWidth={2} stroke="rgb(0,0,0)" />
      </Svg>
      </View>
      <View>
          <Text style={styles.text}>*{item.RONO}-{item.UserID}*</Text>
          <Text style={styles.ForTNR}>{item.ItemName}</Text>
      </View>
      <View>
      <Svg height="10" width="495">
          <Line x1="5" y1="5" x2="280" y2="5" strokeWidth={2} stroke="rgb(0,0,0)" />
      </Svg>
      </View>
      <View style={styles.ForWeight}>
        <Text style={{marginLeft:'50px'}}>LBS : {item.LBS}</Text>
        <Text style={{marginLeft:'50px'}}>KG : {item.KG}</Text>
      </View>
      <View style={{marginTop:'20px'}}>
        <Text style={styles.ForTNR}>{item.RONO}-{item.UserID}</Text>
      </View>
      <View>
        <Text style={{marginTop:'20px', marginRight:'10px', textAlign:'right', fontFamily:'TimesNewRoman', fontSize:'12px'}}>{dayjs(item.EntDate.slice(0,10)).format('dddd, D MMMM, YYYY')}</Text>
      </View>
    </Page>
        ))):(<></>)}
  </Document>
  </PDFViewer>
  )
}

export default function ForButton(){
  return(
    <>
      <Navbar/>
      <DBMenu />
      <div style={{marginTop:'20px'}}>
      <ProductionSticker marginTop="10px" /> 
      </div>
    </>
  )
}
