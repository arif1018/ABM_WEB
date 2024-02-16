import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DangerousIcon from '@mui/icons-material/Dangerous';
import Loading from '../../Loading'
import { useSelector } from 'react-redux';
import Navbar from '../admin/Navbar'
import DBMenu from '../admin/NavbarDynamic'
import { dataForBarCode, dataForDataTable, addNewRecord } from '../../features/stock/stockAdjustmentSlice'
import { deleteRecord, reset } from '../../features/stock/physicalAuditSlice'
import { useDispatch } from 'react-redux';
import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function Login() {
    const dispatch = useDispatch()
    const {user} = useSelector((state)=>state.auth)

    const { isLoading, isSuccessItemSave } = useSelector((state)=>state.physicalAudit)
    const { BarCodeDetail, isLoadingBarCodeDetail } = useSelector((state)=>state.StockAdj)
    const { dataForTable } = useSelector((state)=>state.StockAdj)

    const [errMsg, setErrorMessage] = React.useState('')
    const [ItemName, setItemName] = React.useState('')
    const [KG, setKG] = React.useState('')
    const [LBS, setLBS] = React.useState('')
    const [Quantity, setQuantity] = React.useState('')
    const [Packing, setPacking] = React.useState('')
  
    React.useEffect(()=>{
            dispatch(dataForDataTable(user[0].ID))
            if(BarCodeDetail){
                if(BarCodeDetail.length > 0){
                    if(BarCodeDetail.message === "Record already added!.."){
                        setErrorMessage(`Selected Item Already In Stock!...`)
                        setItemName("")
                        setKG("")
                        setLBS("")
                        setQuantity("")
                        setPacking("")
                    }else{
                        setItemName(BarCodeDetail[0].ItemName)
                        setKG(BarCodeDetail[0].KG)
                        setLBS(BarCodeDetail[0].LBS)
                        setQuantity(BarCodeDetail[0].Quantity)
                        setPacking(BarCodeDetail[0].Packing)
                    }
                }else{
                    if(BarCodeDetail.message === "Record already added!.."){
                        setErrorMessage(`Selected Item Already In Stock!...`)
                    }
                }
                }
            if(isSuccessItemSave){
                setItemName("")
                setKG("")
                setLBS("")
                setQuantity("")
                setBarCode("")
                setPacking("")
                dispatch(reset())
            }
    },[ dispatch, user, BarCodeDetail, isSuccessItemSave ])

    const handleSubmit = (event) => {
    event.preventDefault();
    if(BarCodeDetail.length > 0){
        if(!BarCodeDetail.message){
            const userData = {EntUserID:user[0].ID, EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), BarCode:Barcode}
            dispatch(addNewRecord(userData))
            event.target.reset()
            const interval = setInterval(() => {
                // dispatch(getDCNO(user[0].ID))
            }, 5000);
            setTimeout(()=>{clearInterval(interval)},5000)
            dispatch(reset())    
        }
    }else{
        alert('Not Found')
    }
};

  const [EntDate, setEntDate] = React.useState(new Date())
  const [Barcode, setBarCode] = React.useState('')

  return (
    <>
    <Navbar/>
    <DBMenu />
        <Container component="main" sx={{mt:5}}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'} fontSize={30} align={'center'}>Audit Procedure</Typography>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        {errMsg ? (<Typography style={{backgroundColor:'red', 
                            padding:10, 
                            margin:10, 
                            borderTopLeftRadius:10,
                            borderBottomLeftRadius:10,
                            borderTopRightRadius:20,
                            borderBottomRightRadius:20,
                            color:'white', 
                            minWidth:250, 
                            display:'flex',
                            flexWrap:'wrap',
                            textAlign:'center'}}>
                        <DangerousIcon /> <span>  {errMsg}</span>
                        </Typography>):(<></>)}
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={1.5}>
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
                            value={dataForTable ? dataForTable.length > 0 ? dataForTable[0].VoucherNo : "" : ""}
                            required
                            fullWidth
                            name="VoucherNo"
                            label="Voucher No"
                            id="VoucherNo"
                        />
                    </Grid>
                    <Grid item xs={1.5}>
                        <TextField
                            margin="normal"
                            value={Barcode}
                            required
                            fullWidth
                            name="BarCode"
                            label="Bar Code"
                            id="BarCode"
                            onChange={(e)=>{
                                setErrorMessage("")
                                setBarCode(e.target.value)
                                if(e.target.value.slice(0,1) ==="0"){
                                    if(e.target.value.length > 11){
                                        dispatch(dataForBarCode(e.target.value))
                                    }
                                }else{
                                    if(e.target.value.length > 7){
                                        dispatch(dataForBarCode(e.target.value))
                                    }
                                }

                            }}
                            onBlur={()=>{
                                let PDRONO
                                let UserID
                                    const zeroPad = (num, places) => String(num).padStart(places, '0')
                                PDRONO = Barcode.split('-')[0]
                                UserID = Barcode.split('-')[1]
                                if(Barcode !==""){
                                    if(Barcode.slice(0,1) ==="0"){
                                        PDRONO = zeroPad(+PDRONO,10)
                                    }
                                    setBarCode(PDRONO+'-'+UserID)
                                    dispatch(dataForBarCode(PDRONO+'-'+UserID))    
                                }
                            }
                        }
                        />
                    </Grid>
                    <Grid item xs={4}>
                        {isLoadingBarCodeDetail ? (<Loading />):(
                            <TextField
                            disabled
                            value={ItemName}
                            margin="normal"
                            required
                            fullWidth
                            name="ItemName"
                            label="Item Name"
                            id="ItemName"
                            />
                        )}
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled
                            value={KG}
                            margin="normal"
                            required
                            fullWidth
                            name="KG"
                            label="K.G."
                            id="KG"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled
                            value={LBS}
                            margin="normal"
                            required
                            fullWidth
                            name="LBS"
                            label="L.B.S."
                            id="LBS"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled
                            value={Quantity}
                            margin="normal"
                            required
                            fullWidth
                            name="Quantity"
                            label="Qnty"
                            id="Quantity"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled
                            value={Packing}
                            margin="normal"
                            required
                            fullWidth
                            name="Pakcking"
                            label="Pckg"
                            id="Quantity"
                        />
                    </Grid>
                    <Grid item xs={1}>
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

        <TableContainer component={Paper} sx={{mt:1}}>
            <Table sx={{ width:'100%', fontSize:50, }} aria-label="simple table">
                <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                    <TableRow>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}} >S.No.</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'15%'}} >Bar Code</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'35%'}} >Item Name</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>K.G.</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>LBS</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Action</TableCell>
                    </TableRow>
                </TableHead>
                {isLoading ? (<><Loading /></>):(<></>)}
                <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                    {dataForTable ?(dataForTable.map((item, index)=>(
                        <TableRow style={{backgroundColor:'#799CFF', color:'#fff'}}
                        sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                        >
                            <TableCell style={{textAlign:'right', fontWeight:'bolder', color:'#000'}} sx={{border:1, borderColor:'primary.main'}}>{index+1}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main'}}><Button 
                            sx={{color:'#000', fontWeight:'bolder'}}>{item.BarCode}</Button></TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'left', fontWeight:'bolder', color:'#000'}}>{item.ItemName}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.KG}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.LBS}</TableCell>
                            <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'center'}}>
                                <Button
                                    sx={{color:'#000', fontWeight:'bolder', alignSelf:'center'}}
                                    onClick={()=>{
                                        dispatch(deleteRecord(item.RONO+" "+user[0].ID+" "+item.BarCode))
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