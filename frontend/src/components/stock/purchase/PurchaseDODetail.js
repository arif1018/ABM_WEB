import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
import { getSuppliers, getItems, getUnits, getDONO, getCurrency, addNewRecord, SaveMasterRecord } from '../../../features/stock/purchase/purchaseDO/purchaseSlice'
import { useDispatch } from 'react-redux';
import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';
export default function Login() {
    // const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user} = useSelector((state)=>state.auth)

    const { Parties, isLoadingParty } =useSelector((state)=>state.purchase)
    const { Items, isLoadingItem } =useSelector((state)=>state.purchase)
    const { Units, isLoadingUnit } =useSelector((state)=>state.purchase)
    const { Currency, isLoadingCurrency } =useSelector((state)=>state.purchase)
    const { DONO, isLoadingDONO } =useSelector((state)=>state.purchase)
    const { dataForTable } =useSelector((state)=>state.purchase.DONO)

    const optionsCurrency = Currency.map((item)=>item.CurrDescription)
    const [valueCurrency, setValueCurrency] = React.useState();
    const [inputValueCurrency, setInputValueCurrency] = React.useState('');

    const optionsUnit = Units.map((item)=>item.LocDescription)
    const [valueUnit, setValueUnit] = React.useState();
    const [inputValueUnit, setInputValueUnit] = React.useState('');

    const optionsItem = Items.map((item)=>item.ItemName)
    const [valueItem, setValueItem] = React.useState();
    const [inputValueItem, setInputValueItem] = React.useState('');

    const optionsCity = Parties.map((item)=>item.PartyName)
    const [valueCity, setValueCity] = React.useState();
    const [inputValueCity, setInputValueCity] = React.useState('');

    const optionsHSCode = ['-']
    const [valueHSCode, setValueHSCode] = React.useState();
    const [inputValueHSCode, setInputValueHSCode] = React.useState('');

    React.useEffect(()=>{
            dispatch(getDONO(user[0].ID))
            if(Parties.length === 0){dispatch(getSuppliers())}            
            if(Items.length === 0){dispatch(getItems())}
            if(Units.length === 0){dispatch(getUnits())}
            if(Currency.length === 0){dispatch(getCurrency())}
    },[ dispatch, user, Parties.length, Items.length, Units.length, Currency.length ])


    const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {DONO:DONO.DONO, UserID:user[0].ID, EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), MPONO:data.get('MPONO'), PartyName:valueCity, ItemName:valueItem, 
    ZoneItem:data.get('ForZone'), ItemUnit:valueUnit, HSCode:valueHSCode, 
    Quantity:data.get('quantity'), DealCurrency:valueCurrency, RR:data.get('RR'), ZR:data.get('ZR')}
    dispatch(addNewRecord(userData))
    event.target.reset()
    const interval = setInterval(() => {dispatch(getDONO(user[0].ID))}, 3000);
    setTimeout(()=>{clearInterval(interval)},5000)
    
};

  const [EntDate, setEntDate] = React.useState(new Date())
  const [checked, setChecked] = React.useState(false)
  const [for_zone, set_for_zone] = React.useState('')
  const [for_mpono, set_for_mpono] = React.useState('')

  const handleChangeCB = ()=>{
    if(checked){
        setChecked(false)
    }else{
        setChecked(true)
    }
  }

  let totalQuantity
  dataForTable ? 
      totalQuantity = DONO.dataForTable.reduce((acc, item) => acc + item.Quantity,0)
    : (<></>)
  const handleSaveMasterRecord = (event)=>{
    event.preventDefault();
    const userData = {DONO:DONO.DONO, UserID:user[0].ID, EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), 
    MPONO:DONO ? DONO.dataForTable ? DONO.dataForTable.length > 0 ? (DONO.dataForTable[0].MPONO) : for_mpono : for_mpono : for_mpono, 
    PartyName:DONO ? DONO.dataForTable ? DONO.dataForTable.length > 0 ? (DONO.dataForTable[0].PartyName) : for_mpono : for_mpono : for_mpono, 
    NOI:DONO ? DONO.dataForTable ? DONO.dataForTable.length > 0 ? (DONO.dataForTable.length) : for_mpono : for_mpono : for_mpono, }
    dispatch(SaveMasterRecord(userData))
    const interval = setInterval(() => {dispatch(getDONO(user[0].ID))}, 3000);
    setTimeout(()=>{clearInterval(interval)},5000)

  }
  return (
    <>
    <Navbar/>
    <DBMenu />
        <Container component="main" sx={{mt:5}}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'} fontSize={30} align={'center'}>Purchase D.O.</Typography>
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
                    <Grid item xs={2}>
                        <TextField
                            disabled
                            margin="normal"
                            required
                            fullWidth
                            name="PONO"
                            id="PONO"
                            value={DONO ? DONO.DONO : "Not Found"}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="MPONO"
                            label="M P.O. NO."
                            id="MPONO"
                            value={DONO ? DONO.dataForTable ? DONO.dataForTable.length > 0 ? (DONO.dataForTable[0].MPONO) : for_mpono : for_mpono : for_mpono}
                            onChange={(e)=>set_for_mpono(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {isLoadingParty ? (<Loading loadingText="Suppeir Name"/>):(<>
                            <Autocomplete
                                value={DONO ? DONO.dataForTable ? DONO.dataForTable.length > 0 ? (DONO.dataForTable[0].PartyName) : valueCity : valueCity : valueCity}
                                onChange={(event, newValue) => {
                                    setValueCity(newValue);
                                }}
                                inputValue={inputValueCity}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueCity(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={optionsCity}
                                sx={{mt:1}}                        
                                renderInput={(params) => <TextField {...params} label="Supplier Name" />}
                            /></>)}
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            disabled
                            value={DONO ? DONO.dataForTable ? DONO.dataForTable.length : "" : ""}
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
                                value={valueItem}
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
                    <Grid item xs={2}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={checked} onChange={handleChangeCB} />} label="Same as Item Name" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                        margin="normal"
                            required
                            fullWidth
                            name="ForZone"
                            label="For Zone"
                            id="ForZone"
                            value={checked ? valueItem : for_zone}
                            onChange={(e)=>set_for_zone(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        {isLoadingUnit ? (<Loading loadingText="Items Units"/>):(<>
                            <Autocomplete
                                value={valueUnit}
                                onChange={(event, newValue) => {
                                    setValueUnit(newValue);
                                }}
                                inputValue={inputValueUnit}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueUnit(newInputValue);
                                }}
                                id="controllable-states-demo"
                                options={optionsUnit}
                                sx={{mt:1}}
                                renderInput={(params) => <TextField {...params} label="Item Units" />}
                            />
                        </>)}                
                    </Grid>
                    <Grid item xs={2}>
                        {isLoadingCurrency ? (<Loading loadingText="Currency"/>):(<>
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
                                renderInput={(params) => <TextField {...params} label="Currency" />}
                            />
                        </>)}                
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="quantity"
                            label="Quantity"
                            id="quantity"
                        />
                    </Grid>
                 <Grid item xs={1.5}>
                    <Autocomplete
                        value={valueHSCode}
                        onChange={(event, newValue) => {
                            setValueHSCode(newValue);
                        }}
                        inputValue={inputValueHSCode}
                        onInputChange={(event, newInputValue) => {
                            setInputValueHSCode(newInputValue);
                        }}
                        id="controllable-states-demo"
                        options={optionsHSCode}
                        sx={{mt:1}}
                        renderInput={(params) => <TextField {...params} label="HSCode" />}
                    />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="RR"
                            label="R R"
                            id="RR"
                        />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="ZR"
                            label="ZR"
                            id="ZR"
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
                    <Grid item xs={9}>
                    </Grid>
                    <Grid item xs={3}>
                        <Button
                            onClick={handleSaveMasterRecord}
                            fullWidth
                            variant="contained"
                            sx={{ mb: 2, p:2}}
                        >
                            SAVE D.O.
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        <TableContainer component={Paper} >
            <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
                <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                    <TableRow>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}} >S.No.</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}} >Party Name</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'60%'}} >Item Name</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Item Unit</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>HS Code</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Quantity</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Deal Currency</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>R.R.</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Z.R.</TableCell>
                    </TableRow>
                </TableHead>
                {isLoadingDONO ? (<><Loading /></>):(<></>)}
                <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                    {dataForTable ?(dataForTable.map((item, index)=>(
                        <TableRow style={{backgroundColor:'#799CFF', color:'#fff'}}
                        sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                        >
                            <TableCell style={{textAlign:'right', fontWeight:'bolder', color:'#000'}} sx={{border:1, borderColor:'primary.main'}}>{index+1}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main'}}><Button 
                            sx={{color:'#000', fontWeight:'bolder'}}>{item.PartyName}</Button></TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.ItemName}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.ItemUnit}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.HSCode}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.Quantity}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.DealCurrency}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.RR}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.ZR}</TableCell>
                        </TableRow>
                    ))) :<>Not Found</> }
                    <TableRow style={{backgroundColor:'#0029DA'}}>
                        <TableCell colSpan={5} sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'center'}}>TOTAL QUANTITY</TableCell>
                        <TableCell colSpan={4} sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'right'}}>{totalQuantity}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        </Container>
      </>
  );
}