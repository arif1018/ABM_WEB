import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
// import PrintIcon from '@mui/icons-material/Print';
import Loading from '../../../Loading'
import { useSelector } from 'react-redux';
import Navbar from '../../../admin/Navbar'
import DBMenu from '../../../admin/NavbarDynamic'
import { getData } from '../../../../features/reports/partyLedger/partyLedgerSlice'
import { getParties, getCurrency } from '../../../../features/resuable/reusableSlice'
import { useDispatch } from 'react-redux';
import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { PDFViewer, Font } from '@react-pdf/renderer';
import TimesNewRoman from '../DMSerifDisplay-Regular.ttf'
import logo from '../../../../images/FinalLogo.png'

Font.register({
    family: 'TimesNewRoman',
    fonts: [
      {
        src: TimesNewRoman,
        fontWeight:'500'
      },
  
    ],
});

export default function PartyLedger() {
    const dispatch = useDispatch()

    const {user} = useSelector((state)=>state.auth)

    const { Parties, isLoadingItem } = useSelector((state)=>state.reuse)
    const { Currency } = useSelector((state)=>state.reuse)
    const { ledgerData, isLoading } = useSelector((state)=>state.PL)

    const optionsParties = Parties.map((item)=>item.PartyName)
    const [valueParties, setValueParties] = React.useState('');
    const [inputValueParties, setInputValueParties] = React.useState('');

    const optionsCurrency = Currency.map((item)=>item.CurrDescription)
    const [valueCurrency, setValueCurrency] = React.useState('');
    const [inputValueCurrency, setInputValueCurrency] = React.useState('');

    const [fromDate, setFromDate] = React.useState(new Date())
    const [toDate, setToDate] = React.useState(new Date())

    React.useEffect(()=>{
      dispatch(getParties())
      dispatch(getCurrency())
        const interval = setInterval(() => {setErrorMessage("")}, 5000);
        setTimeout(()=>{clearInterval(interval)},10000)
    },[ dispatch, user, Parties.length, Currency.length ])

    const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {PartyName:valueParties, FromDate:dayjs(fromDate.$d).format('YYYY-MM-DD'), 
    ToDate:dayjs(toDate.$d).format('YYYY-MM-DD'), Currency:valueCurrency, CBDetail:detail_Checked }
    dispatch(getData(userData))
    event.target.reset()    
};

  const [errMsg, setErrorMessage] = React.useState('')

  const [detail_Checked, set_detail_Checked] = React.useState(false)

  const handleChangeCB = ()=>{
    if(detail_Checked){
        set_detail_Checked(false)
    }else{
        set_detail_Checked(true)
    }
  }





//   Table Head
  const borderColor = 'white'
  const stylesTH = StyleSheet.create({
      container: {
          flexDirection: 'row',
          borderBottomColor: 'white',
          backgroundColor: 'grey',
          borderBottomWidth: 1,
          alignItems: 'center',
          height: 15,
          textAlign: 'center',
          flexGrow: 1,
          fontSize:'10px',
          fontFamily:'TimesNewRoman'
      },
      thentdate: {
          width: '10%',
          borderRightColor: borderColor,
          borderRightWidth: 1,
      },
      thremarks: {
          width: '50%',
          borderRightColor: borderColor,
          borderRightWidth: 1,
      },
      thdebit: {
          width: '10%',
          borderRightColor: borderColor,
          borderRightWidth: 1,
      },
      thcredit: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    thbalance: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    thstatus: {
        width: '10%',
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
        borderTopColor:'black'
    },
    trentdate: {
        width: '10%',
        textAlign: 'left',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    trremarks: {
        width: '50%',
        textAlign: 'left',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    trdebit: {
        width: '10%',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    trcredit: {
        width: '10%',
        borderRightColor: borderColorRow,
        borderRightWidth: 1,
        textAlign: 'right',
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
        borderColor: 'black',
        fontSize:'7px'
    },
});
  return (
    <>
    <Navbar/>
    <DBMenu />
        <Container component="main" sx={{mt:5}}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'} fontSize={30} align={'center'}>Party Ledger</Typography>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Grid container spacing={2} direction="row" alignItems="center">
                <Grid item xs={4}>
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
                    </Grid>
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
                    <PDFViewer height={880} width={'100%'}>
                    <Document>
                        <Page size={{width:11*72, height:8*72}}>
                            <View style={{flexDirection:'row', marginTop:'10px', marginLeft:10}}>
                            <Image style={{height:'50px', width:'80px'}} src={logo}/>
                            <View style={{marginLeft:'10px'}}>
                            <Text style={{fontSize:'15px'}}>Lifcon Steel Industry</Text>
                            <Text style={{fontSize:'9px'}}>Plot #A-59 & A-59(A) Lasbela Industrial Estate Development Athority H.I.T.E. Hub Balochistan.</Text>
                            <Text style={{fontSize:'9px'}}>0853310096</Text>
 
                            </View>
                            </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:'20px', marginRight:'20px'}}>
                            <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'15px', textAlign:'left'}}>{valueParties}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}>Ledger From </Text>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}>{dayjs(fromDate).format('DD-MMM-YYYY')}</Text>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}> To </Text>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}>{dayjs(toDate).format('DD-MMM-YYYY')}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}>Currency : </Text>
                                <Text style={{marginTop:'10px', fontFamily:'TimesNewRoman', fontSize:'10px', textAlign:'left'}}>{valueCurrency}</Text>
                            </View>
                        </View>
                        <View style={stylesTC.tableContainer}>
                        <View style={stylesTH.container}>
                        <Text style={stylesTH.thentdate}>Date</Text>
                        <Text style={stylesTH.thremarks}>Remarks</Text>
                        <Text style={stylesTH.thdebit}>Debit</Text>
                        <Text style={stylesTH.thcredit}>Credit</Text>
                        <Text style={stylesTH.thbalance}>Balance</Text>
                        <Text style={stylesTH.thstatus}>Status</Text>
                        </View>
                        {isLoading ? (<View><Text style={{fontSize:'30px', fontWeight:'bold', fontFamily:'TimesNewRoman'}}>Please Wait Data Loading</Text></View>) : (
                            
                            ledgerData.map( item =>(
                                <View style={stylesTR.row} key={Math.random.toString()}>
                                    <Text style={stylesTR.trentdate}>{dayjs(item.EntDate).format('DD-MMM-YYYY')}</Text>
                                    <Text style={stylesTR.trremarks}>{item.Remarks}</Text>
                                    <Text style={stylesTR.trdebit}>{Math.round(item.Debit).toLocaleString("en-US")}</Text>
                                    <Text style={stylesTR.trcredit}>{Math.round(item.Credit).toLocaleString("en-US")}</Text>
                                    <Text style={{                                            
                                                width: '10%',
                                                borderRightColor: borderColorRow,
                                                borderRightWidth: 1,
                                                textAlign: 'right',
                                                paddingRight: 8,
                                                color:`${item.Balance > 0 ? "green" : "red"}`
                                    }}>{item.Balance < 0 ? Math.round(item.Balance - item.Balance - item.Balance).toLocaleString("en-US") : Math.round(item.Balance).toLocaleString("en-US")}</Text>
                                    <Text style={{
                                                width: '10%',
                                                textAlign: 'left',
                                                borderRightColor: borderColor,
                                                borderRightWidth: 1,
                                                paddingLeft: 8,
                                                color:`${item.Balance > 0 ? "green" : "red"}`
                                        
                                    }}>{item.Balance > 0 ? "Debit" : "Credit"}</Text>
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