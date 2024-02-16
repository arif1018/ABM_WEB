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
import DangerousIcon from '@mui/icons-material/Dangerous';
import Loading from '../../Loading'
import { useSelector } from 'react-redux';
import Navbar from '../../admin/Navbar'
import DBMenu from '../../admin/NavbarDynamic'
import { getDCNO, getSDDONO, getDODetail, addNewRecord, deleteRecord, SaveMasterRecord, reset } from '../../../features/stock/sales/salesDeliveryGDNSlice'
import { dataForBarCode } from '../../../features/resuable/reusableSlice'

import { useDispatch } from 'react-redux';
import { Divider, IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';

const columns = [
    // { field: 'RONO', headerName: 'S.No.', width: 100 },
    { field: 'ItemName', headerName: 'Item Name', width: 400, headerClassName: 'custom-header' },
    { field: 'Quantity', headerName: 'Quantity', width: 166, headerClassName: 'custom-header' },
  ];

const ItemWiseColumns = [
    { field: 'ItemName', headerName: 'Item Name', width: 220, headerClassName: 'custom-header' },
    { field: 'TotalBales', headerName: 'T.B', width: 40, headerClassName: 'custom-header' },
    { field: 'LBS', headerName: 'L.B.S.', width: 100, headerClassName: 'custom-header' },
    { field: 'KG', headerName: 'K.G.', width: 100, headerClassName: 'custom-header' },
  ];
  
export default function Login() {
    const dispatch = useDispatch()

    const {user} = useSelector((state)=>state.auth)
        
    const isLoadingParty = false

    const { DCNO } = useSelector((state)=>state.saleDeliGDN)
    const { SDDONO, isSuccessItemSave } = useSelector((state)=>state.saleDeliGDN)
    const { SDDODetail, isLoadingDODetail, isLoadingBarCodeDetail } = useSelector((state)=>state.saleDeliGDN)
    const { BarCodeDetail } = useSelector((state)=>state.saleDeliGDN)
    const { dataForTable, itemWiseDetail, TotalQuanttiy, TotalLBS } = useSelector((state)=>state.saleDeliGDN.DCNO)

    const optionsCity = SDDONO.map((item)=>item.DONO)
    const [valueCity, setValueCity] = React.useState();
    const [inputValueCity, setInputValueCity] = React.useState('');

    const [errMsg, setErrorMessage] = React.useState('')
    const [ItemName, setItemName] = React.useState('')
    const [KG, setKG] = React.useState('')
    const [LBS, setLBS] = React.useState('')
    const [Quantity, setQuantity] = React.useState('')
    React.useEffect(()=>{
            dispatch(getDCNO(user[0].ID))
            dispatch(getSDDONO())
            if(BarCodeDetail){
                if(BarCodeDetail.length > 0){
                    if(BarCodeDetail[0].IssueStatus === "Yes"){
                        setErrorMessage(`Selected Item Already Issued!...`)
                        setItemName("")
                        setKG("")
                        setLBS("")
                        setQuantity("")
                        // setBarCode("")
                    }else{
                        setErrorMessage("")
                        setItemName(BarCodeDetail[0].ItemName)
                        setKG(BarCodeDetail[0].KG)
                        setLBS(BarCodeDetail[0].LBS)
                        setQuantity(BarCodeDetail[0].Quantity)
                    }
                }
            }
            if(isSuccessItemSave){
                setItemName("")
                setKG("")
                setLBS("")
                setQuantity("")
                setBarCode("")
                dispatch(reset())
            }
    },[ dispatch, user, BarCodeDetail, isSuccessItemSave ])

    React.useEffect(()=>{
        if(dataForTable){
            if(dataForTable.length > 0){
                dispatch(getDODetail(dataForTable[0].DONO))
            }
        }
    },[dispatch, dataForTable])

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

    const userData = {DCNO:DCNO.DCNO, UserID:user[0].ID, DONO:valueCity, EntDate:dayjs(EntDate.$d).format('YYYY-MM-DD'), 
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
                <Typography fontWeight={'bolder'} fontSize={30} align={'center'}>Dispatch G.D.N.</Typography>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={1.6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{mt:1}}
                            defaultValue={dayjs(new Date())}
                            onChange={(newValue)=>setEntDate(newValue)}/>
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={1.3}>
                        <TextField
                            disabled
                            value={DCNO ? DCNO.DCNO> 0 ? DCNO.DCNO.length > 0 ? DCNO.DCNO : "" : "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="DCNO"
                            label="D.C. No."
                            id="DCNO"
                        />
                    </Grid>
                    <Grid item xs={1.3} style={{display:'none'}}>
                        <TextField
                            disabled
                            value={dataForTable ? dataForTable.length > 0 ? dataForTable[0].DONO : "" : "" }
                            margin="normal"
                            required
                            fullWidth
                            name="ADONO"
                            label="ADONO"
                            id="ADONO"
                        />
                    </Grid>
                    <Grid item xs={1.3} style={{display:'none'}}>
                        <TextField
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].PartyName : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="PartyName"
                            label="PartyName"
                            id="PartyName"
                        />
                    </Grid>
                    <Grid item xs={2}>
                        {isLoadingParty ? (<Loading loadingText="D.O. No."/>):(<>
                            <Autocomplete
                                value={DCNO ? DCNO.dataForTable ? DCNO.dataForTable.length > 0 ? (DCNO.dataForTable[0].DONO) : valueCity : valueCity : valueCity}
                                onChange={(event, newValue) => {
                                    setValueCity(newValue);
                                }}
                                inputValue={inputValueCity}
                                onInputChange={(event, newInputValue) => {
                                    setInputValueCity(newInputValue);
                                    dispatch(getDODetail(newInputValue))
                                }}
                                id="DONO"
                                options={optionsCity}
                                sx={{mt:1}}                        
                                renderInput={(params) => <TextField {...params} label="D.O. No." />}
                            /></>)}
                    </Grid>
                    <Grid item xs={1.3}>
                        <TextField
                            disabled
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].TruckNo : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="TruckNo"
                            label="Truck No."
                            id="TruckNo"
                        />
                    </Grid>
                    <Grid item xs={1.8}>
                        <TextField
                            disabled
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].ContainerNo : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="ContainerNo"
                            label="Container No."
                            id="ContainerNo"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled
                            value={SDDODetail ?  SDDODetail.PortCode ? SDDODetail.PortCode.length > 0 ? SDDODetail.PortCode[0].LocShort : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="Code"
                            label="Code"
                            id="Code"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].TotalWeight : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="Weight"
                            label="Weight"
                            id="Weight"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled
                            value={TotalLBS ? TotalLBS :""}
                            margin="normal"
                            required
                            fullWidth
                            name="Dispatched"
                            label="Dispatched"
                            id="Dispatched"
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                            disabled
                            margin="normal"
                            required
                            fullWidth
                            name="Balance"
                            label="Balance"
                            id="Balance"
                        />
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
                                // checkboxSelection
                            />

                                    </Box>
                        </div>
                        </>)}
                        
                    </Grid>
                    <Grid xs={6} direction={'column'}>
                    <Grid item xs={6}>
                        <Typography textAlign={'center'} fontWeight={'bolder'} fontSize={20}>Detail Section</Typography>
                        <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                        <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                        <Divider variant="middle" sx={{bgcolor:'#0029DA'}}/>
                    </Grid>
                        <Grid container direction={'row'} spacing={2} ml={1}>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={6}>
                        {errMsg ? (<Typography style={{backgroundColor:'red', 
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
                            <DangerousIcon /> <span>  {errMsg}</span>
                      </Typography>):(<></>)}
                      </Grid>
                      <Grid item xs={3}></Grid>

                            <Grid item xs={3}>
                            <TextField
                                margin="normal"
                                value={Barcode}
                                required
                                fullWidth
                                name="BarCode"
                                label="Bar Code"
                                id="BarCode"
                                onChange={(e)=>{
                                    setBarCode(e.target.value)
                                    if(e.target.value.length > 11){
                                        dispatch(dataForBarCode(e.target.value))
                                    }
                                }}
                                onBlur={()=>{
                                    let PDRONO
                                    let UserID
                                    const zeroPad = (num, places) => String(num).padStart(places, '0')
                                    PDRONO = Barcode.split('-')[0]
                                    UserID = Barcode.split('-')[1]

                                    PDRONO = zeroPad(+PDRONO,10)
                                    setBarCode(PDRONO+'-'+UserID)
                                    dispatch(dataForBarCode(PDRONO+'-'+UserID))
                                }
                            }
                            />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="OldBarCode"
                                    label="Old Bar Code"
                                    id="OldBarCode"
                                />
                            </Grid>
                            <Grid item xs={6}>
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
                            <Grid item xs={3}>
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
                            <Grid item xs={3}>
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
                            <Grid item xs={3}>
                                <TextField
                                    disabled
                                    value={Quantity}
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="Quantity"
                                    label="Quantity"
                                    id="Quantity"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 2, mb: 2, p:2}}
                                >
                                    ADD
                                </Button>
                            </Grid>
                            <Grid item xs={12}>

                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography sx={{fontSize:20, textAlign:'center', fontWeight:'bolder', textDecoration:'underline', marginBottom:'3px'}}>Item Wise Detial ({TotalQuanttiy ? TotalQuanttiy :""})</Typography>
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
                                rows={itemWiseDetail ? itemWiseDetail : []}
                                columns={ItemWiseColumns}
                                initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                                }}
                                rowHeight={20}
                                columnHeaderHeight={30}
                                pageSizeOptions={[10, 20]}
                                // checkboxSelection
                            />

                                    </Box>
                        </div>
                        </>)}
                        
                    </Grid>
                    <Grid item={7}>
                    <Typography sx={{fontSize:20, textAlign:'center', fontWeight:'bolder', textDecoration:'underline', marginBottom:'3px'}}>Bale Wise Detail</Typography>
                    <TableContainer sx={{height:400}} component={Paper}>
                        <Table sx={{width:'100%'}} size="small" aria-label="a dense table">
                            <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial', color:'custom.main'}}>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell align="left" >Code</TableCell>
                                <TableCell align="left">Item Name</TableCell>
                                <TableCell align="center">LBS</TableCell>
                                <TableCell align="center">KG</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {dataForTable ? (dataForTable.map((row, index) => (
                                <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row">
                                    {index+1}
                                </TableCell>
                                <TableCell align="left">{row.BarCode}</TableCell>
                                <TableCell align="left">{row.ItemName}</TableCell>
                                <TableCell align="right">{row.LBS}</TableCell>
                                <TableCell align="right">{row.KG}</TableCell>
                                <TableCell align="center"><IconButton onClick={()=>{
                                    dispatch(deleteRecord(row.RONO+" "+user[0].ID+" "+row.BarCode))
                                }}><DeleteForeverIcon style={{fontSize:'15px'}} /></IconButton></TableCell>
                                </TableRow>
                            ))):(<></>)}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Box>

            <Box component="form" onSubmit={handleSubmitMaster} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2} direction="row" alignItems="center">
                    <Grid item xs={2.25} style={{display:'none'}}>
                        <TextField
                            value={SDDODetail ?  SDDODetail.DODetail ? SDDODetail.DODetail.length > 0 ? SDDODetail.DODetail[0].PartyName : "": "" : ""}
                            margin="normal"
                            required
                            fullWidth
                            name="MasterPartyName"
                            label="Weight Slip"
                            id="MasterPartyName"
                        />
                    </Grid>
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
       </Container>
      </>
  );
}