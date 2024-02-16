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
import Loading from '../../Loading'
import { useSelector } from 'react-redux';
import Navbar from '../../admin/Navbar'
import DBMenu from '../../admin/NavbarDynamic'
import { getSuppliers, getPDDONO, getItems, getDCNO, addNewRecord, deleteRecord, SaveMasterRecord } from '../../../features/stock/purchase/purchaseDeliveryGRN/purchaseDeliveryGRNSlice'
import { useDispatch } from 'react-redux';
import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
export default function Login() {
    // const navigate = useNavigate()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {user} = useSelector((state)=>state.auth)

    const { GRNParties, isLoadingParty } = useSelector((state)=>state.purDeliGRN)
    const { deleteMessage } = useSelector((state)=>state.purDeliGRN.dataForDelete)
    const { Items, isLoadingItem } = useSelector((state)=>state.purDeliGRN)
    const { DCNO, isLoadingDONO } = useSelector((state)=>state.purDeliGRN)
    const { dataForTable } = useSelector((state)=>state.purDeliGRN.DCNO)
    const { PDDONO } = useSelector((state)=>state.purDeliGRN)

    const optionsItem = Items.map((item)=>item.ItemName)
    const [valueItem, setValueItem] = React.useState();
    const [inputValueItem, setInputValueItem] = React.useState('');

    const optionsCity = GRNParties.map((item)=>item.PDPartyName)
    const [valueCity, setValueCity] = React.useState();
    const [inputValueCity, setInputValueCity] = React.useState('');

    const optionsPDONO = PDDONO.map((item)=>`${item.DONO}-${item.UserID}`)
    const [valuePDONO, setValuePDONO] = React.useState();
    const [inputValuePDONO, setInputValuePDONO] = React.useState('');

    React.useEffect(()=>{
        if(deleteMessage){
            setErrorMessage(deleteMessage)
        }
        const interval = setInterval(() => {setErrorMessage("")}, 5000);
        setTimeout(()=>{clearInterval(interval)},10000)
        dispatch(getDCNO(user[0].ID))
        if(GRNParties.length === 0){dispatch(getSuppliers())}            
        if(Items.length === 0){dispatch(getItems())}
    },[ dispatch, user, GRNParties.length, Items.length, deleteMessage ])


    const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {DCNO:DCNO.DCNO, DONO:valuePDONO.split('-')[0], MadeID:valuePDONO.split('-')[1],
    UserID:user[0].ID, EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), PartyName:valueCity,
    ItemName:valueItem, KG:data.get('KG'), LBS:data.get('LBS'),}
    dispatch(addNewRecord(userData))
    event.target.reset()
    const interval = setInterval(() => {dispatch(getDCNO(user[0].ID))}, 3000);
    setTimeout(()=>{clearInterval(interval)},5000)
    
};

  const [EntDate, setEntDate] = React.useState(new Date())
  const [KG, setKG] = React.useState('')
  const [LBS, setLBS] = React.useState('')

  const [errMsg, setErrorMessage] = React.useState('')

    const handleSubmitMaster = (event)=>{
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {DCNO:DCNO.DCNO, UserID:user[0].ID, EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), 
    PartyName:valueCity, WeightSlip:data.get('WeightSlip'), 
    VehicleNo:data.get('VehicleNo'), CaseNo:data.get('CaseNo'), TruckWeight:data.get('TruckWeight'),
    NOI:DCNO ? DCNO.dataForTable ? DCNO.dataForTable.length > 0 ? (DCNO.dataForTable.length) : "" : "for_mpono" : "for_mpono",}
    dispatch(SaveMasterRecord(userData))
    const interval = setInterval(() => {dispatch(getDCNO(user[0].ID))}, 3000);
    setTimeout(()=>{clearInterval(interval)},5000)
    navigate("/Reports/Purchase")
  }
  return (
    <>
    <Navbar/>
    <DBMenu />
        <Container component="main" sx={{mt:5}}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'} fontSize={30} align={'center'}>Purchase Delivery G.R.N.({DCNO.dataForTable ? DCNO.dataForTable.length : ""})</Typography>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{mt:1}}
                            defaultValue={dayjs(new Date())}
                            onChange={(newValue)=>setEntDate(newValue)}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            disabled
                            margin="normal"
                            required
                            fullWidth
                            name="DCNO"
                            id="DCNO"
                            value={DCNO ? DCNO.DCNO : "Not Found"}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {isLoadingParty ? (<Loading loadingText="Suppeir Name"/>):(<>
                            <Autocomplete
                                value={DCNO ? DCNO.dataForTable ? DCNO.dataForTable.length > 0 ? (DCNO.dataForTable[0].PDPartyName) : valueCity : valueCity : valueCity}
                                onChange={(event, newValue) => {
                                    setValueCity(newValue);
                                }}
                                inputValue={inputValueCity}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueCity(newInputValue);
                                    dispatch(getPDDONO(newInputValue))
                                }}
                                id="controllable-states-demo"
                                options={optionsCity}
                                sx={{mt:1}}                        
                                renderInput={(params) => <TextField {...params} label="Supplier Name" />}
                            /></>)}
                    </Grid>
                    <Grid item xs={3}>
                        {isLoadingParty ? (<Loading loadingText="D.O. NO"/>):(<>
                            <Autocomplete
                                value={valuePDONO}
                                onChange={(event, newValue) => {
                                    setValuePDONO(newValue);
                                }}
                                inputValue={inputValuePDONO}
                                onInputChange={(event, newInputValue) => {
                                    setInputValuePDONO(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={optionsPDONO}
                                sx={{mt:1}}                        
                                renderInput={(params) => <TextField {...params} label="D.O. NO." />}
                            /></>)}
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            disabled
                            value={DCNO ? DCNO.dataForTable ? DCNO.dataForTable.length : "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="NOI"
                            label="NOI"
                            id="NOI"
                        />
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <Typography textAlign={'center'} fontWeight={'bolder'} fontSize={20}>Detail Section</Typography>
                        <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                        <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                        <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                    </Grid>
                    <Grid item xs={4}></Grid>                
                    <Grid item xs={5}>
                        {isLoadingItem ? (<Loading loadingText="Items Name"/>):(<>
                            <Autocomplete
                                value={dataForTable ? dataForTable.length > 0 ? dataForTable[dataForTable.length - 1 ].ItemName : valueItem : valueItem}
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
                                renderInput={(params) => <TextField {...params} label="Items Name" />}
                            />
                        </>)}                
                    </Grid>
                    <Grid item xs={2.5}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="KG"
                            label="K G"
                            id="KG"
                            value={KG}
                            onChange={(e)=>{
                                setKG(e.target.value)
                                setLBS(Math.round(e.target.value * 2.20462))
                            }}
                        />
                    </Grid>
                    <Grid item xs={2.5}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="LBS"
                            label="L.B.S."
                            id="LBS"
                            value={LBS}
                            onChange={(e)=>{
                                setLBS(e.target.value)
                                setKG((e.target.value / 2.20462).toFixed(2))
                            }}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, p:2}}
                        >
                            ADD
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <Box component="form" onSubmit={handleSubmitMaster} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2} direction="row" alignItems="center">
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                    <Typography textAlign={'center'} fontWeight={'bolder'} fontSize={24}>MASTER SECTION</Typography>
                    <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                    <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                    <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                </Grid>
                <Grid item xs={3}></Grid>                

                    <Grid item xs={2.25}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="WeightSlip"
                            label="Weight Slip"
                            id="WeightSlip"
                        />
                    </Grid>
                    <Grid item xs={2.25}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="VehicleNo"
                            label="Vehicle No"
                            id="VehicleNo"
                        />
                    </Grid>
                    <Grid item xs={2.25}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="CaseNo"
                            label="Case No"
                            id="CaseNo"
                        />
                    </Grid>
                    <Grid item xs={2.25}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="TruckWeight"
                            label="Truck Weight"
                            id="TruckWeight"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, p:2}}
                        >
                            SAVE D.C.
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
            </Grid>
        <TableContainer component={Paper} >
            <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
                <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                    <TableRow>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}} >S.No.</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'35%'}} >Party Name</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'35%'}} >Item Name</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>K.G.</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>LBS</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Delete</TableCell>
                    </TableRow>
                </TableHead>
                {isLoadingDONO ? (<><Loading /></>):(<></>)}
                <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                    {dataForTable ?(dataForTable.map((item, index)=>(
                        <TableRow style={{backgroundColor:'#799CFF', color:'#fff'}}
                        sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                        >
                            <TableCell style={{textAlign:'right', fontWeight:'bolder', color:'#000'}} sx={{border:1, borderColor:'primary.main'}}>{index+1}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', fontWeight:'bolder', color:'#000'}}>{item.PartyName}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'left', fontWeight:'bolder', color:'#000'}}>{item.ItemName}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.KG}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.LBS}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>
                            <Button
                                    sx={{color:'#000', fontWeight:'bolder', alignSelf:'center'}}
                                    onClick={()=>{
                                        dispatch(deleteRecord(item.RONO+" "+item.UserID))
                                    }}
                                    ><DeleteForeverIcon /></Button></TableCell>
                        </TableRow>
                    ))) :<>Not Found</> }
                    <TableRow style={{backgroundColor:'#0029DA'}}>
                        <TableCell colSpan={6} sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'center'}}>TOTAL QUANTITY</TableCell>
                        {/* <TableCell colSpan={4} sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'right'}}>{totalQuantity}</TableCell> */}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        </Container>
      </>
  );
}