import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Container, Typography, Box } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getMasterData, updateEditStatus } from '../../../../../features/reports/stock/purchase/purchaseSlice'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../../../../Loading'
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import PrintIcon from '@mui/icons-material/Print';
import dayjs from 'dayjs';
import Navbar from '../../../Navbar'
import DBMenu from '../../../NavbarDynamic'
import { useNavigate } from 'react-router-dom';
import { GeneratePWTL, GenerateIWDL, GeneratePIWDL } from '../../../../../services/PurchaseMasterReport'
export default function StockTable() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { MasterData, PartyWise, ItemWise, Party_Item_Wise, TotalTruck, TotalItem, isLoading } = useSelector((state)=>state.PMData.PM)
    const { user } =useSelector((state)=>state.auth)

    React.useEffect(()=>{
        const userData = {userID:user[0].ID, EntDate:dayjs(new Date().$d).format('YYYY-MM-DD')}
        dispatch(getMasterData(userData))
    },[ dispatch, user ])
    
    return (
      <>
      <Navbar/>
      <DBMenu />  
        <Container spacing={2} style={{"paddingTop":"20px"}}>
          <Box sx={{display:'flex', flexDirection:{lg:'row', xs:'column'}, justifyContent:{lg:'space-between', xs:'center'}}}>
            <Grid container spacing={2} direction="row" alignItems="center">
              <Grid item xs={4}>
              </Grid>
              <Grid item xs={4} sx={{mb:2}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker sx={{mt:1}}
                  defaultValue={dayjs(new Date())}
                  onChange={
                    (newValue)=>{
                      const userData = {userID:user[0].ID, EntDate:dayjs(newValue.$d).format('YYYY-MM-DD')}
                      dispatch(getMasterData(userData))
                  }}/>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper} sx={{mb:5, height:400}}>
                  <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
                    <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                      <TableRow>
                        <TableCell colSpan={8} sx={{ color:'custom.main', border:1, borderColor:'#fff'}} style={{textAlign:'center'}}>
                          <Typography variant='h4'>Purchase Details</Typography></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}} >S.No.</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}} >D.C.No</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'40%'}} >Party Name</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Total Qnty</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Vehicle No</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Slip Weight</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Edit</TableCell>
                        <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Print Stickers</TableCell>
                      </TableRow>
                    </TableHead>
                  {isLoading ? (<><Loading /></>):(<></>)}
                    <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                      {MasterData ?(MasterData.map((item, index)=>(
                        <TableRow style={{backgroundColor:'#799CFF', color:'#fff',}} sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                          <TableCell style={{textAlign:'right', fontWeight:'bolder', color:'#000'}} sx={{border:1, borderColor:'primary.main'}}>{index+1}</TableCell>
                          <TableCell sx={{border:1, borderColor:'primary.main', fontWeight:'bolder', color:'#000'}}>{item.DCNO}</TableCell>
                          <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'left', fontWeight:'bolder', color:'#000'}}>{item.PartyName}</TableCell>
                          <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'center', fontWeight:'bolder', color:'#000'}}>{item.NOI}</TableCell>
                          <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'left', fontWeight:'bolder', color:'#000'}}>{item.VehicleNo}</TableCell>
                          <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.WeightSlip}</TableCell>
                          <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>
                            <Button
                            onClick={()=>{
                              dispatch(updateEditStatus(item.DCNO + " " + user[0].ID))
                              navigate("/PurchaseDeliveryGRN")
                            }}
                            ><EditCalendarIcon /></Button></TableCell>
                          <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>
                            <Button
                            onClick={()=>{
                              localStorage.setItem('DCNOForSticker',item.DCNO)
                              navigate("/Sticker")
                            }}
                            ><PrintIcon /></Button></TableCell>
                          </TableRow>
                  ))) :<>Not Found</> }
                          <TableRow style={{backgroundColor:'#0029DA'}}>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={5}></Grid>
                  <Grid item xs={1} sx={{display:'flex', justifyContent:'right'}} >
                    <Button variant='contained' fullWidth sx={{borderRadius:'10px'}}
                    onClick={()=>{
                      GeneratePWTL(PartyWise)
                    }}><FileDownloadIcon fontSize='large' /></Button>
                  </Grid>
                  <Grid item xs={5}></Grid>
                  <Grid item xs={1}sx={{display:'flex', justifyContent:'right'}}>
                    <Button variant='contained' fullWidth sx={{borderRadius:'10px'}}
                    onClick={()=>{
                      GenerateIWDL(ItemWise)
                    }}><FileDownloadIcon fontSize='large' /></Button>
                  </Grid>
                  <Grid item xs={6}>
                  <TableContainer component={Paper} sx={{mb:5, height:400}}>
                    <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
                <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ color:'custom.main', border:1, borderColor:'#fff'}} style={{textAlign:'center'}}>
                      <Typography variant='h5'>{TotalTruck ? (<>Party Wise Detail | Total Truck - {TotalTruck}</>):""}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'15%'}} >S.No.</TableCell>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'70%'}} >Party Name</TableCell>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'15%'}} >No of Truck</TableCell>
                  </TableRow>
                </TableHead>
                {isLoading ? (<><Loading /></>):(<></>)}
                <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                  {PartyWise ?(PartyWise.map((item, index)=>(
                    <TableRow style={{backgroundColor:'#799CFF', color:'#fff',}}
                        // key={ad.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                      >
                      <TableCell style={{textAlign:'right', fontWeight:'bolder', color:'#000'}} sx={{border:1, borderColor:'primary.main'}}>{index+1}</TableCell>
                      <TableCell sx={{border:1, borderColor:'primary.main', fontWeight:'bolder', color:'#000'}}>{item.PartyName}</TableCell>
                      <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'left', fontWeight:'bolder', color:'#000'}}>{item.TotalTruck}</TableCell>
                    </TableRow>
          ))) :<>Not Found</> }
          <TableRow style={{backgroundColor:'#0029DA'}}>
          </TableRow>
          </TableBody>
          </Table>
      </TableContainer>
                    </Grid>
                    <Grid item xs={6}>
                    <TableContainer component={Paper} sx={{mb:5, height:400}}>
              <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
                <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                  <TableRow>
                    <TableCell colSpan={7} sx={{ color:'custom.main', border:1, borderColor:'#fff'}} style={{textAlign:'center'}}>
                      <Typography variant='h4'>{TotalItem ? (<>Item Wise Detail | Total Items - {TotalItem}</>):""}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'15%'}} >S.No.</TableCell>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'70%'}} >Item Name</TableCell>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'15%'}} >No of Item</TableCell>
                  </TableRow>
                </TableHead>
                {isLoading ? (<><Loading /></>):(<></>)}
                <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                  {ItemWise ?(ItemWise.map((item, index)=>(
                    <TableRow style={{backgroundColor:'#799CFF', color:'#fff',}}
                        // key={ad.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                      >
                      <TableCell style={{textAlign:'right', fontWeight:'bolder', color:'#000'}} sx={{border:1, borderColor:'primary.main'}}>{index+1}</TableCell>
                      <TableCell sx={{border:1, borderColor:'primary.main', fontWeight:'bolder', color:'#000'}}>{item.ItemName}</TableCell>
                      <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'left', fontWeight:'bolder', color:'#000'}}>{item.TotalItem}</TableCell>
                    </TableRow>
          ))) :<>Not Found</> }
          <TableRow style={{backgroundColor:'#0029DA'}}>
          </TableRow>
          </TableBody>
          </Table>
      </TableContainer>
                    </Grid>
                    <Grid item xs={11}></Grid>
                  <Grid item xs={1} sx={{display:'flex', justifyContent:'right'}} >
                    <Button variant='contained' fullWidth sx={{borderRadius:'10px'}}
                    onClick={()=>{
                      GeneratePIWDL(Party_Item_Wise)
                    }}><FileDownloadIcon fontSize='large' /></Button>
                  </Grid>

                    <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{mb:5, height:400}}>
              <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
                <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ color:'custom.main', border:1, borderColor:'#fff'}} style={{textAlign:'center'}}>
                      <Typography variant='h4'>{TotalItem ? (<>Item Wise Detail | Total Items - {TotalItem}</>):""}</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'15%'}} >S.No.</TableCell>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'35%'}} >Party Name</TableCell>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'35%'}} >Item Name</TableCell>
                    <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'15%'}} >No of Item</TableCell>
                  </TableRow>
                </TableHead>
                {isLoading ? (<><Loading /></>):(<></>)}
                <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                  {Party_Item_Wise ?(Party_Item_Wise.map((item, index)=>(
                    <TableRow style={{backgroundColor:'#799CFF', color:'#fff',}}
                        // key={ad.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                      >
                      <TableCell style={{textAlign:'right', fontWeight:'bolder', color:'#000'}} sx={{border:1, borderColor:'primary.main'}}>{index+1}</TableCell>
                      <TableCell sx={{border:1, borderColor:'primary.main', fontWeight:'bolder', color:'#000'}}>{item.PartyName}</TableCell>
                      <TableCell sx={{border:1, borderColor:'primary.main', fontWeight:'bolder', color:'#000'}}>{item.ItemName}</TableCell>
                      <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'left', fontWeight:'bolder', color:'#000'}}>{item.TotalItem}</TableCell>
                    </TableRow>
          ))) :<>Not Found</> }
          <TableRow style={{backgroundColor:'#0029DA'}}>
          </TableRow>
          </TableBody>
          </Table>
      </TableContainer>
                    </Grid>
                  </Grid>
          </Box>
      </Container>
  </>
    );
  }
  