import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Button, Container, Typography, Box } from '@mui/material';
import { stockGetAll, getAllItemName, getstockPartyWise } from '../../features/reports/stockSlice'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../../Loading'
import useMediaQuery from '@mui/material/useMediaQuery';
import GeneratePDF from '../../services/GeneratePDF';
import Logo from '../../images/FinalLogo.png'



export default function StockTable() {
  const dispatch = useDispatch()

  const { stock, isLoading } = useSelector((state)=>state.stock)
  const { ItemList } = useSelector((state)=>state.stock)
  const { user } =useSelector((state)=>state.auth)

  React.useEffect(()=>{
      dispatch(stockGetAll())
      dispatch(getAllItemName())
      localStorage.removeItem('ItemName')  
  },[ dispatch ])

  const optionsCity = ItemList.map((item)=>item.ItemName)
  const [valueCity, setValueCity] = React.useState();
  const [inputValueCity, setInputValueCity] = React.useState('');

  const totalQuantity = stock.reduce(
    (acc, item) => acc + item.Quantity,
    0
  );
  const totalLBS = stock.reduce(
    (acc, item) => acc + item.LBS,
    0
  );
  const totalKG = stock.reduce(
    (acc, item) => acc + item.KG,
    0
  );

  const matches = useMediaQuery('(min-width:768px)');

  return (
    <>
    <img src={Logo} style={{display:'none'}} alt=''/>
    <div>
      <h5 style={{textAlign:'center'}}>{!matches ? (<><h2>Silver Rags</h2></>):(<></>)}</h5>

      <h5 style={{textAlign:'center'}}>{!matches ? (<><h4>Welcome {user[0].UserName}</h4></>):(<></>)}</h5>
    </div>

      <Container spacing={2} style={{"paddingTop":"20px"}}>
        <Box sx={{display:'flex', flexDirection:{lg:'row', xs:'column'}, justifyContent:{lg:'space-between', xs:'center'}}}>
          <Typography variant='h4' sx={{width:{lg:'20%', xs:'100%'}, backgroundColor:'#0029DA', 
          marginBottom:1, borderTopRightRadius:40, borderBottomLeftRadius:{lg:40, xs:0}, 
          borderTopLeftRadius:{lg:0, xs:40}, color:'#000', 
          textAlign:'center', p:1, boxShadow: '3px 3px 3px 3px #898989'}}>Stock List</Typography>
        {/* <Typography variant='h4' style={{backgroundColor:'#0029DA', marginBottom:10,
          borderTopRightRadius:40, borderBottomLeftRadius:40, color:'#000', textAlign:'center', padding:10, 
          boxShadow: '3px 3px 3px 3px #898989'}}>Stock List</Typography> */}
        <Autocomplete sx={{width:{lg:'40%', xs:'100%'}, marginLeft:{lg:2, xs:0}, mt:{lg:0, xs:2}}}
          value={valueCity}
          onChange={(event, newValue) => {
            setValueCity(newValue);
          }}
          inputValue={inputValueCity}
          onInputChange={(event, newInputValue) => {
            setInputValueCity(newInputValue);
            localStorage.setItem('ItemName',newInputValue)
            dispatch(getstockPartyWise())
          }}
          id="controllable-states-demo"
          options={optionsCity}
          renderInput={(params) => <TextField {...params} label="Item Name" />}
        />
        <Button variant='contained' sx={{width:{lg:'20%', xs:'100%'}, marginLeft:{lg:1, xs:0}, 
          marginTop:{lg:0, xs:2}, borderRadius:'20px', marginBottom:1}}  onClick={()=>{
                  dispatch(stockGetAll())
                  localStorage.removeItem('ItemName')
                }}><Typography variant='h6'>Get All Stock</Typography></Button>
        <Button variant='contained' sx={{width:{lg:'20%', xs:'100%'}, marginLeft:{lg:1, xs:0}, 
          marginTop:{lg:0, xs:2}, borderRadius:'20px', marginBottom:1}}  onClick={() => GeneratePDF(stock, localStorage.getItem('ItemName'))}>
          <Typography variant='h6'>Download PDF</Typography></Button>
        </Box>
        <TableContainer component={Paper} >
            <Table sx={{ width:'100%', fontSize:50}} aria-label="simple table">
              <TableHead sx={{bgcolor:'primary.main', fontFamily:'Arial'}}>
                <TableRow>
                  <TableCell colSpan={5} sx={{ color:'custom.main', border:1, borderColor:'#fff'}} style={{textAlign:'center'}}>
                    <Typography variant='h4'>{localStorage.getItem('ItemName')?(<>{localStorage.getItem('ItemName')}</>):(<>Total Stock</>)}</Typography></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}} >S.No.</TableCell>
                  <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'60%'}} >{localStorage.getItem('ItemName')?(<>Party Name</>):(<>Item Name</>)}</TableCell>
                  <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>Quantity</TableCell>
                  <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>LBS</TableCell>
                  <TableCell sx={{ color:'custom.main', border:1, borderColor:'#fff', width:'10%'}}>KG</TableCell>
                </TableRow>
              </TableHead>
              {isLoading ? (<><Loading /></>):(<></>)}
              <TableBody sx={{fontFamily:'Times New Roman', color:'#000'}}>
                {stock ?(stock.map((item, index)=>(
                  <TableRow style={{backgroundColor:'#799CFF', color:'#fff',}}
                      // key={ad.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                    >
                    <TableCell style={{textAlign:'right', fontWeight:'bolder', color:'#000'}} sx={{border:1, borderColor:'primary.main'}}>{index+1}</TableCell>
                    <TableCell sx={{border:1, borderColor:'primary.main'}}><Button onClick={()=>{
                      localStorage.setItem('ItemName',item.ItemName)
                      dispatch(getstockPartyWise())
                      }} sx={{color:'#000', fontWeight:'bolder'}}>{item.ItemName}</Button></TableCell>
                    <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{item.Quantity}</TableCell>
                    <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{Math.round(item.LBS).toLocaleString("en-US")}</TableCell>
                    <TableCell sx={{border:1, borderColor:'primary.main', textAlign:'right', fontWeight:'bolder', color:'#000'}}>{Math.round(item.KG).toLocaleString("en-US")}</TableCell>
                  </TableRow>
        ))) :<>Not Found</> }
        <TableRow style={{backgroundColor:'#0029DA'}}>
          {/* <TableCell sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'center'}}></TableCell> */}
          <TableCell colSpan={2} sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'center'}}>TOTAL QUANTITY</TableCell>
          <TableCell sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'right'}}>{totalQuantity.toLocaleString("en-US")}</TableCell>
          <TableCell sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'right'}}>{Math.round(totalLBS).toLocaleString("en-US")}</TableCell>
          <TableCell sx={{ border:1, borderColor:'#fff'}} style={{fontSize:25, fontWeight:'bolder', color:'#fff', textAlign:'right'}}>{Math.round(totalKG).toLocaleString("en-US")}</TableCell>
        </TableRow>
        </TableBody>
        </Table>
    </TableContainer>
    </Container>
</>
  );
}
