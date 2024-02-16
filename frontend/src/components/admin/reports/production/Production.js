import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PrintIcon from '@mui/icons-material/Print';
import Loading from '../../../Loading'
import { useSelector } from 'react-redux';
import Navbar from '../../../admin/Navbar'
import DBMenu from '../../../admin/NavbarDynamic'
// import { getSuppliers, getPDDONO, getItems, getDCNO, addNewRecord, deleteRecord } from '../../../../features/stock/purchase/purchaseDeliveryGRN/purchaseDeliveryGRNSlice'
import { getTableData, BarCode_Production, deleteRecord, addNewRecord, getMachines } from '../../../../features/reports/production/productionSlice'
import { getItems } from '../../../../features/resuable/reusableSlice'
import { useDispatch } from 'react-redux';
import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { Page, Text, View, Document, StyleSheet, Svg, Line } from '@react-pdf/renderer';
import { PDFViewer, Font } from '@react-pdf/renderer';
import TimesNewRoman from '../DMSerifDisplay-Regular.ttf'
import NewTextBarCodeFont from '../LibreBarcode39Text-Regular.ttf'

// PRODUCTION STICKER FONT & STYLES

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


export default function Login() {
    const dispatch = useDispatch()

    const {user} = useSelector((state)=>state.auth)

    const { deleteMessage } = useSelector((state)=>state.purDeliGRN.dataForDelete)
    const { Items, isLoadingItem } = useSelector((state)=>state.reuse)
    const { DCNO, isLoadingDONO } = useSelector((state)=>state.purDeliGRN)
    const { TableData, isLoading } = useSelector((state)=>state.Prod.Prod)
    const { Machines } = useSelector((state)=>state.Prod)
    const { DataForBarCode } = useSelector((state)=>state.Prod.BarCodeData)

    // const Machines = []
    const optionsItem = Items.map((item)=>item.ItemName)
    const [valueItem, setValueItem] = React.useState();
    const [inputValueItem, setInputValueItem] = React.useState('');

    const optionsMachine = Machines.map((item)=>item.LocDescription)
    const [valueMachine, setValueMachine] = React.useState();
    const [inputValueMachine, setInputValueMachine] = React.useState('');

    const [mainUserData, setmainUserData] = React.useState({PDRONO:'', UserID:'', PartyCode:''})
    const [EntDate, setEntDate] = React.useState(new Date())
    const [CBMulti, setCBMulti] = React.useState(false)

    React.useEffect(()=>{

        dispatch(BarCode_Production(mainUserData))
        dispatch(getMachines())
        dispatch(getTableData(EntDate !== '' ? dayjs(EntDate.$d).format('YYYY-MM-DD') : dayjs(new Date().$d).format('YYYY-MM-DD')))

        if(deleteMessage){
            setErrorMessage(deleteMessage)
        }
        console.log("Done")
        const interval = setInterval(() => {setErrorMessage("")}, 5000);
        setTimeout(()=>{clearInterval(interval)},10000)
        if(Items.length === 0){dispatch(getItems())}
    },[ dispatch, user, Items.length, deleteMessage, mainUserData, EntDate ])


    const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {UserID:user[0].ID, MultiStick:CBMulti, EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), Code:data.get('Code'), ItemName:valueItem, 
    Packing:Packing, Quantity:Quantity, KG:KG, LBS:LBS, MachineNo:valueMachine, StQnty:StQnty,
    }
    console.log(userData)
    dispatch(addNewRecord(userData))
    event.target.reset()
    const interval = setInterval(() => {
        dispatch(getTableData(EntDate !== '' ? dayjs(EntDate.$d).format('YYYY-MM-DD') : dayjs(new Date().$d).format('YYYY-MM-DD')))
    }, 3000);
    setTimeout(()=>{clearInterval(interval)},5000)
    
};

  const [KG, setKG] = React.useState('')
  const [LBS, setLBS] = React.useState('')

  const [errMsg, setErrorMessage] = React.useState('')

  const [bl_Checked, set_bl_Checked] = React.useState(false)
  const [Packing, setPacking] = React.useState('1')
  const [Quantity, setQuantiy] = React.useState('1')
  const [StQnty, setStQnty] = React.useState('')

  const handleChangeCB = ()=>{
    if(bl_Checked){
        set_bl_Checked(false)
        setPacking("1")
        setQuantiy("1")
    }else{
        set_bl_Checked(true)
    }
  }

  const handleChangeCB_MS = ()=>{
    if(CBMulti){
        setCBMulti(false)
    }else{
        setCBMulti(true)
    }
  }

  return (
    <>
    <Navbar/>
    <DBMenu />
        <Container component="main" sx={{mt:5}}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'} fontSize={30} align={'center'}>Production ({TableData ? TableData.length : ""})</Typography>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={1.6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{mt:1}}
                            defaultValue={dayjs(new Date())}
                            onChange={(newValue)=>{                                
                                setEntDate(newValue)
                                dispatch(getTableData(dayjs(newValue.$d).format('YYYY-MM-DD')))
                            }}
                            slotProps={{ textField: { size: 'small' } }}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={1.4}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="Code"
                            label="Code"
                            id="Code"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {isLoadingItem ? (<Loading loadingText="Item Name"/>):(<>
                            <Autocomplete
                                value={DCNO ? DCNO.dataForTable ? DCNO.dataForTable.length > 0 ? (DCNO.dataForTable[0].PDPartyName) : valueItem : valueItem : valueItem}
                                onChange={(event, newValue) => {
                                    setValueItem(newValue);
                                }}
                                inputValue={inputValueItem}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueItem(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={optionsItem}
                                sx={{mt:1}}                        
                                renderInput={(params) => <TextField {...params} label="Item Name" size='small'/>}
                            /></>)}
                    </Grid>
                    <Grid item xs={1}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={bl_Checked} onChange={handleChangeCB} />} label="Block" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={2}>
                        {isLoading ? (<Loading loadingText="Machines"/>):(<>
                            <Autocomplete
                                value={DCNO ? DCNO.dataForTable ? DCNO.dataForTable.length > 0 ? (DCNO.dataForTable[0].PDPartyName) : valueMachine : valueMachine : valueMachine}
                                onChange={(event, newValue) => {
                                    setValueMachine(newValue);
                                }}
                                inputValue={inputValueMachine}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueMachine(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={optionsMachine}
                                sx={{mt:1}}                        
                                renderInput={(params) => <TextField {...params} label="Select Machine" size='small'/>}
                            /></>)}
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled = {!bl_Checked}
                            value={bl_Checked ? Packing : "1"}
                            onChange={(e)=>{setPacking(e.target.value)}}
                            margin="normal"
                            required
                            fullWidth
                            name="Packing"
                            label="Packing"
                            id="Packing"
                            size='small'                            
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled = {!bl_Checked}
                            value={bl_Checked ? Quantity : "1"}
                            onChange={(e)=>{setQuantiy(e.target.value)}}
                            margin="normal"
                            required
                            fullWidth
                            name="Quantity"
                            label="Quantity"
                            id="Quantity"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={6.4}></Grid>
                    <Grid item xs={1}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="KG"
                            label="K G"
                            id="KG"
                            size='small'
                            value={KG}
                            onChange={(e)=>{
                                setKG(e.target.value)
                                setLBS(Math.round(e.target.value * 2.20462))
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="LBS"
                            label="L.B.S."
                            id="LBS"
                            size='small'
                            value={LBS}
                            onChange={(e)=>{
                                setLBS(e.target.value)
                                setKG((e.target.value / 2.20462).toFixed(2))
                            }}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled = {!CBMulti}
                            value={CBMulti ? StQnty : ""}
                            onChange={(e)=>{setStQnty(e.target.value)}}
                            margin="normal"
                            required
                            fullWidth
                            name="StickerQuantity"
                            label="Sticker Quantity"
                            id="StickerQuantity"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={1.6}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={CBMulti} onChange={handleChangeCB_MS} />} label="Multi Sticker" />
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
                <Grid item xs={8}>
        <TableContainer component={Paper} sx={{height:420}}>
            <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
                <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                    <TableRow>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}} >PD RONO</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'50%'}} >Item Name</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'5%'}}>K.G.</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'5%'}}>LBS</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'12%'}}>Machine</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'4%'}}>Delete</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'4%'}}>Print</TableCell>
                    </TableRow>
                </TableHead>
                {isLoadingDONO ? (<><Loading /></>):(<></>)}
                <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                    {TableData ?(TableData.map((item, index)=>(
                        <TableRow style={{backgroundColor:'#799CFF', color:'#fff'}}
                        sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                        >
                            <TableCell sx={{border:1, borderColor:'primary.main', color:'#000', textAlign:'center', fontSize:'12px', p:0}}>{item.PDRONO}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'left', color:'#000', fontSize:'12px', p:0}}>{item.ItemName}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'center', color:'#000', fontSize:'12px', p:0}}>{item.KG}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'center', color:'#000', fontSize:'12px', p:0}}>{item.LBS}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'center', color:'#000', fontSize:'12px', p:0}}>{item.MachineNo}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'center', color:'#000', p:0}}>
                            <Button
                                    sx={{color:'#000', alignSelf:'center', p:0}}
                                    onClick={()=>{
                                        const userData = {RONO:item.RONO, PDRONO:item.PDRONO, UserID:user[0].ID}
                                        dispatch(deleteRecord(userData))
                                        const interval = setInterval(() => {
                                            dispatch(getTableData(EntDate !== '' ? dayjs(EntDate.$d).format('YYYY-MM-DD') : dayjs(new Date().$d).format('YYYY-MM-DD')))
                                        }, 3000);
                                        setTimeout(()=>{clearInterval(interval)},5000)
                                    
                                    }}
                                    size='small'
                                    ><DeleteForeverIcon fontSize='small' /></Button></TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right',color:'#000', p:0}}>
                            <Button
                                    sx={{color:'#000', alignSelf:'center', p:0}}
                                    onClick={()=>{
                                        setmainUserData({PDRONO:item.PDRONO, UserID:item.UserID, PartyCode:item.Code})
                                    }}
                                    size='small'
                                    ><PrintIcon fontSize='small' /></Button></TableCell>
                        </TableRow>
                    ))) :<>Not Found</> }
                </TableBody>
            </Table>
        </TableContainer>
                </Grid>
                <Grid item xs={4}>

                <PDFViewer height={420} width={'100%'}>
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

                </Grid>
            </Grid>
        </Container>
      </>
  );
}