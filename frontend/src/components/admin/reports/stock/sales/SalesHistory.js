import * as React from 'react';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DangerousIcon from '@mui/icons-material/Dangerous';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import Autocomplete from '@mui/material/Autocomplete';
// import PrintIcon from '@mui/icons-material/Print';
// import Loading from '../../../../Loading'
import { useSelector } from 'react-redux';
import Navbar from '../../../Navbar'
import DBMenu from '../../../NavbarDynamic'
import { getData } from '../../../../../features/reports/stock/sales/salesHistorySlice'
// import { getParties, getCurrency } from '../../../../../features/resuable/reusableSlice'
import { useDispatch } from 'react-redux';
import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { PDFViewer, Font } from '@react-pdf/renderer';
import TimesNewRoman from '../../DMSerifDisplay-Regular.ttf'
import logo from '../../../../../images/FinalLogo.png'

Font.register({
    family: 'TimesNewRoman',
    fonts: [
      {
        src: TimesNewRoman,
      },
  
    ],
});


export default function SalesHistory() {
    const dispatch = useDispatch()

    const {user} = useSelector((state)=>state.auth)

    const { Parties } = useSelector((state)=>state.reuse)
    const { Currency } = useSelector((state)=>state.reuse)
    const { shmData, isLoading } = useSelector((state)=>state.SHMD)

    // const optionsParties = Parties.map((item)=>item.PartyName)
    // const [valueParties, setValueParties] = React.useState('');
    // const [inputValueParties, setInputValueParties] = React.useState('');

    // const optionsCurrency = Currency.map((item)=>item.CurrDescription)
    // const [valueCurrency, setValueCurrency] = React.useState('');
    // const [inputValueCurrency, setInputValueCurrency] = React.useState('');

    // const [fromDate, setFromDate] = React.useState(new Date())
    // const [toDate, setToDate] = React.useState(new Date())

    React.useEffect(()=>{
        dispatch(getData())
    //   dispatch(getParties())
    //   dispatch(getCurrency())
        const interval = setInterval(() => {setErrorMessage("")}, 5000);
        setTimeout(()=>{clearInterval(interval)},10000)
    },[ dispatch, user, Parties.length, Currency.length ])

    const handleSubmit = (event) => {
    event.preventDefault();
    // const userData = {PartyName:valueParties, FromDate:dayjs(fromDate.$d).format('YYYY-MM-DD'), 
    // ToDate:dayjs(toDate.$d).format('YYYY-MM-DD'), Currency:valueCurrency, CBDetail:detail_Checked }
    // dispatch(getData(userData))
    event.target.reset()    
};

  const [errMsg, setErrorMessage] = React.useState('')

//   const [detail_Checked, set_detail_Checked] = React.useState(false)

//   const handleChangeCB = ()=>{
//     if(detail_Checked){
//         set_detail_Checked(false)
//     }else{
//         set_detail_Checked(true)
//     }
//   }





//   Table Head
  const borderColor = '#90e5fc'
  const stylesTH = StyleSheet.create({
      container: {
          flexDirection: 'row',
          borderBottomColor: '#bff0fd',
          backgroundColor: 'grey',
          borderBottomWidth: 1,
          alignItems: 'center',
          height: 24,
          textAlign: 'center',
          flexGrow: 1,
          fontSize:'10px',
          fontFamily:'TimesNewRoman',
      },
      thentdate: {
          width: '10%',
          borderRightColor: borderColor,
          borderRightWidth: 1,
      },
      thpartyname: {
          width: '30%',
          borderRightColor: borderColor,
          borderRightWidth: 1,
      },
      thitemname: {
          width: '30%',
          borderRightColor: borderColor,
          borderRightWidth: 1,
      },
      thquantity: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    thrate: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    thamount: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
});
  

    // Table Row

    const borderColorRow = 'black'
const stylesTR = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 12,
        borderTopColor:'black',
        fontFamily:'TimesNewRoman',
    },
    trentdate: {
        width: '10%',
        textAlign: 'left',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    trpartyname: {
        width: '30%',
        textAlign: 'left',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    tritemname: {
        width: '30%',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        textAlign: 'left',
        paddingLeft: 8,
    },
    trquantity: {
        width: '10%',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    trrate: {
        width: '10%',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    tramount: {
        width: '10%',
        textAlign: 'right',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        paddingRight: 8,
    },
  });

//   Table Container 

const stylesTC = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        marginLeft:10,
        marginRight:10,
        borderWidth: 1,
        borderColor: '#bff0fd',
        fontSize:'7px'
    },
});
  return (
    <>
    <Navbar/>
    <DBMenu />
        <Container component="main" sx={{mt:5}}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'} fontSize={30} align={'center'}>Sales History</Typography>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Grid container spacing={2} direction="row" alignItems="center">
                {/* <Grid item xs={4}>
                        {isLoadingItem ? (<Loading loadingText="Party Name"/>):(<>
                            <Autocomplete
                                value={valueParties}
                                onChange={(event, newValue) => {
                                    setValueParties(newValue);
                                }}
                                inputValue={inputValueParties}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueParties(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={optionsParties}
                                sx={{mt:1}}                        
                                renderInput={(params) => <TextField {...params} label="Party Name" size='small'/>}
                            /></>)}
                    </Grid>
                    <Grid item xs={1.6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{mt:1}}
                            defaultValue={dayjs(new Date())}
                            onChange={(newValue)=>{                                
                                setFromDate(newValue)
                            }}
                            slotProps={{ textField: { size: 'small' } }}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={1.6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{mt:1}}
                            defaultValue={dayjs(new Date())}
                            onChange={(newValue)=>{                                
                                setToDate(newValue)
                            }}
                            slotProps={{ textField: { size: 'small' } }}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={2}>
                        {isLoadingItem ? (<Loading loadingText="Currency"/>):(<>
                            <Autocomplete
                                value={valueCurrency}
                                onChange={(event, newValue) => {
                                    setValueCurrency(newValue);
                                }}
                                inputValue={inputValueCurrency}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueCurrency(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={optionsCurrency}
                                sx={{mt:1}}                        
                                renderInput={(params) => <TextField {...params} label="Currency" size='small'/>}
                            /></>)}
                    </Grid>
                    <Grid item xs={1}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={detail_Checked} onChange={handleChangeCB} />} label="Detail" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, p:1}}
                            size='small'
                        >
                            ADD
                        </Button>
                    </Grid> */}
                </Grid>
            </Box>
            <Grid container spacing={2} direction="row" alignItems="center">
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                {errMsg ? (<Typography style={{backgroundColor: errMsg === "Record Deleted!..."?"green":"red", 
                                          padding:10, 
                                          margin:10, 
                                        //   borderRadius:20,
                                          borderTopLeftRadius:10,
                                          borderBottomLeftRadius:10,
                                          borderTopRightRadius:20,
                                          borderBottomRightRadius:20,
                                          color:'white', 
                                          minWidth:250, 
                                          display:'flex',
                                          flexWrap:'wrap',
                                          textAlign:'center'}}>
                            <DangerousIcon /> <span>  {errMsg}</span></Typography>):(<></>)}

                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={12}>
                    <PDFViewer height={880} width={'100%'} style={{marginTop:10}}>
                    <Document title={`Sales_History_${dayjs(Date.now()).format('DDMMYYYY_hh:mmA')}`}>
                        <Page size={{width:11*72, height:8*72}}>
                        <View style={{flexDirection:'row', marginTop:'10px', marginLeft:10}}>
                            <Image style={{height:'50px', width:'80px'}} src={logo}/>
                            <View style={{marginLeft:'10px'}}>
                            <Text style={{fontSize:'15px'}}>Lifcon Steel Industry</Text>
                            <Text style={{fontSize:'9px'}}>Plot #A-59 & A-59(A) Lasbela Industrial Estate Development Athority H.I.T.E. Hub Balochistan.</Text>
                            <Text style={{fontSize:'9px'}}>0853310096</Text>
 
                            </View>
                            </View>
                        <View fixed style={{marginLeft:'20px', marginRight:'20px'}}>
                            <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'15px', textAlign:'center'}}>Sales History</Text>
                            {/* <View style={{flexDirection:'row'}}>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}>Ledger From </Text>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}>{dayjs(fromDate).format('DD-MMM-YYYY')}</Text>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}> To </Text>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}>{dayjs(toDate).format('DD-MMM-YYYY')}</Text>
                            </View> */}
                        </View>
                        <View style={stylesTC.tableContainer} >
                        <View fixed style={stylesTH.container}>
                        <Text style={stylesTH.thentdate}>Date</Text>
                        <Text style={stylesTH.thpartyname}>Party Name</Text>
                        <Text style={stylesTH.thitemname}>Itme Name</Text>
                        <Text style={stylesTH.thquantity}>Quantity</Text>
                        <Text style={stylesTH.thrate}>Rate</Text>
                        <Text style={stylesTH.thamount}>Amount</Text>
                        </View>
                        {isLoading ? (<View><Text style={{fontSize:'30px', fontWeight:'bold', fontFamily:'TimesNewRoman'}}>Please Wait Data Loading</Text></View>) : (
                            shmData.map( item =>(
                                <View style={stylesTR.row} key={Math.random.toString()}>
                                    <Text style={stylesTR.trentdate}>{dayjs(item.EntDate).format('DD-MMM-YYYY')}</Text>
                                    <Text style={stylesTR.trpartyname}>{item.PartyName}</Text>
                                    <Text style={stylesTR.tritemname}>{item.ItemName}</Text>
                                    <Text style={stylesTR.trquantity}>{Math.round(item.Quantity).toLocaleString("en-US")}</Text>
                                    <Text style={stylesTR.trrate}>{Math.round(item.ItemRate)}</Text>
                                    <Text style={stylesTR.tramount}>{Math.round(item.ItemRate * item.Quantity).toLocaleString("en-US")}</Text>
                                    {/* <Text style={stylesTH.rate}>{item.rate}</Text>
                                    <Text style={stylesTH.amount}>{(item.qty * item.rate).toFixed(2)}</Text> */}
                                </View>))
                        )}


                        </View>
                        </Page>
                    </Document>
                    </PDFViewer>
                </Grid>
            </Grid>
        </Container>
      </>
  );
}