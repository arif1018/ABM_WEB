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
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import Loading from '../../Loading'
import { useSelector } from 'react-redux';
import Navbar from '../../admin/Navbar'
import DBMenu from '../../admin/NavbarDynamic'
import { getDCNO, getSDDONO, getDODetail, addNewRecord, deleteRecord, SaveMasterRecord, reset } from '../../../features/stock/sales/salesDeliveryGDNSlice'
import { useDispatch } from 'react-redux';
import { Divider, Typography } from '@mui/material';
import dayjs from 'dayjs';

const columns = [
    // { field: 'RONO', headerName: 'S.No.', width: 100 },
    { field: 'ItemName', headerName: 'Item Name', width: 400, headerClassName: 'custom-header' },
    { field: 'Quantity', headerName: 'Quantity', width: 166, headerClassName: 'custom-header' },
  ];
  
export default function Login() {
    const dispatch = useDispatch()

    const {user} = useSelector((state)=>state.auth)
    
    
    
    const isLoadingParty = false


    const { DCNO, isLoadingDONO } = useSelector((state)=>state.saleDeliGDN)
    const { SDDONO, isSuccessItemSave } = useSelector((state)=>state.saleDeliGDN)
    const { SDDODetail, isLoadingDODetail } = useSelector((state)=>state.saleDeliGDN)
    const { BarCodeDetail } = useSelector((state)=>state.saleDeliGDN)
    const { dataForTable } = useSelector((state)=>state.saleDeliGDN.DCNO)

    const optionsCity = SDDONO.map((item)=>item.DONO)
    const [valueCity, setValueCity] = React.useState();
    const [inputValueCity, setInputValueCity] = React.useState('');

    const [ItemName, setItemName] = React.useState('')
    const [KG, setKG] = React.useState('')
    const [LBS, setLBS] = React.useState('')
    React.useEffect(()=>{
            dispatch(getDCNO(user[0].ID))
            dispatch(getSDDONO())
            if(BarCodeDetail){
                if(BarCodeDetail.length > 0){
                    if(BarCodeDetail[0].IssueStatus === "Yes"){
                        setItemName("")
                        setKG("")
                        setLBS("")
                        // setBarCode("")
                    }else{
                        setItemName(BarCodeDetail[0].ItemName)
                        setKG(BarCodeDetail[0].KG)
                        setLBS(BarCodeDetail[0].LBS)
                    }
                }
            }
            if(isSuccessItemSave){
                setItemName("")
                setKG("")
                setLBS("")
                setBarCode("")
                dispatch(reset())
            }
    },[ dispatch, user, BarCodeDetail, isSuccessItemSave ])

    const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {DCNO:DCNO.DCNO, UserID:user[0].ID, DONO:valueCity, MadeID:'waqas', 
    EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), BarCode:Barcode, PartyName:data.get('PartyName'), 
    ItemName:ItemName, KG:KG, LBS:LBS,}
    dispatch(addNewRecord(userData))
    event.target.reset()
    const interval = setInterval(() => {dispatch(getDCNO(user[0].ID))}, 3000);
    setTimeout(()=>{clearInterval(interval)},5000)
    
};

  const [EntDate, setEntDate] = React.useState(new Date())
  const [Barcode, setBarCode] = React.useState('')

  const handleSubmitMaster = (event)=>{
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const userData = {DCNO:DCNO.DCNO, UserID:user[0].ID, EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), 
    PartyName:data.get('MasterPartyName'), VehicleNo:SDDODetail.DODetail[0].TruckNo, 
    ContainerNo:SDDODetail.DODetail[0].ContainerNo,
    NOI:DCNO ? DCNO.dataForTable ? DCNO.dataForTable.length > 0 ? (DCNO.dataForTable.length) : "" : "for_mpono" : "for_mpono"}
    dispatch(SaveMasterRecord(userData))
    const interval = setInterval(() => {dispatch(getDCNO(user[0].ID))}, 3000);
    setTimeout(()=>{clearInterval(interval)},5000)
  }

  return (
    <>
    <Navbar/>
    <DBMenu />
        <Container component="main" sx={{mt:5}}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <Typography fontWeight={'bolder'} fontSize={30} align={'center'}>Stock Transfer</Typography>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={1.6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{mt:1}}
                            defaultValue={dayjs(new Date())}
                            onChange={(newValue)=>setEntDate(newValue)}
                            slotProps={{ textField: { size: 'small' } }}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={1.5} style={{display:'none'}}>
                        <TextField
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].PartyName : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="TRANSID"
                            label="TRANSID"
                            id="TRANSID"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={1.5} >
                        <TextField
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].PartyName : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="BARCODE"
                            label="Bar Code"
                            id="BARCODE"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={1} >
                        <TextField
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].PartyName : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="OLDBARCODE"
                            label="Old Bar Code"
                            id="OLDBARCODE"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={3} >
                        <TextField
                            disabled
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].PartyName : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="ITEMNAME"
                            label="Item Name"
                            id="ITEMNAME"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={1.4} >
                        <TextField
                            disabled
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].PartyName : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="LBS"
                            label="L.B.S."
                            id="LBS"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={1.2} >
                        <TextField
                            disabled
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].PartyName : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="C_LOCATION"
                            label="C. Location"
                            id="C_LOCATION"
                            size='small'
                        />
                    </Grid>
                    <Grid item xs={2.2}>
                        {isLoadingParty ? (<Loading loadingText="D.O. No."/>):(<>
                            <Autocomplete
                                value={DCNO ? DCNO.dataForTable ? DCNO.dataForTable.length > 0 ? (DCNO.dataForTable[0].PDPartyName) : valueCity : valueCity : valueCity}
                                onChange={(event, newValue) => {
                                    setValueCity(newValue);
                                }}
                                inputValue={inputValueCity}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueCity(newInputValue);
                                    dispatch(getDODetail(newInputValue))
                                }}
                                id="Location"
                                options={optionsCity}
                                sx={{mt:1}}
                                renderInput={(params) => <TextField {...params} label="Location" size='small' />}
                            /></>)}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography sx={{fontSize:20, textAlign:'center', fontWeight:'bolder', textDecoration:'underline', marginBottom:'3px'}}>Order Detail</Typography>
                        {isLoadingDODetail ? (<><Loading/></>):(<>
                            <div style={{ height:400, width: '100%', boxShadow: '2px 2px 2px 2px #717171',
                                borderRadius: '5px' }}>
                                    <Box sx={{
                                        height: '100%',
                                        width: '100%',
                                        '& .custom-header': {
                                        backgroundColor: '#0029DA', color:'#fff', height:'10px', border: 'solid 1px #fff'
                                        },
                                    }}>
                            <DataGrid getRowId={(row) => Math.random()}
                                // rows={rows}
                                rows={SDDODetail ? SDDODetail.ItemDetail ? SDDODetail.ItemDetail.length > 0 ? SDDODetail.ItemDetail : []: [] : []}
                                columns={columns}
                                initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                                }}
                                rowHeight={20}
                                columnHeaderHeight={30}
                                pageSizeOptions={[10, 20]}
                            />
                                    </Box>
                        </div>
                        </>)}
                    </Grid>
                </Grid>
            </Box>
            <Box component="form" onSubmit={handleSubmitMaster} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={7}></Grid>
                    <Grid item xs={5}>
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

        <TableContainer component={Paper} sx={{mt:1}}>
            <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
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
                {isLoadingDONO ? (<><Loading /></>):(<></>)}
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