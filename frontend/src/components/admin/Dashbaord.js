import React, { useEffect } from 'react'
import Navbar from './Navbar'
import DBMenu from './NavbarDynamic'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Grid, Button } from '@mui/material'

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import ShareIcon from '@mui/icons-material/Share';
import QRCode from "react-qr-code";

function Dashbaord() {
  const navigate = useNavigate()
  const {user} = useSelector((state)=>state.auth)
  useEffect(()=>{
    if(!user){
        navigate('/')
    }
  },[ user, navigate ])

  const accBalance = 1234.34

  return (
      <>
        <Navbar />
        <Grid container spacing={2}>
          <Grid item xs={2} sx={{mt:3}}>
          <DBMenu />
          </Grid>

          <Grid item xs={2}>
          </Grid>
          
          <Grid item xs={4}>
          <Card sx={{ maxWidth: 345, mt:3 }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {user ? user[0].UserName.charAt(0) : "Not Found"}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="share">
                  <ShareIcon onClick={()=>alert('Done')}/>
                </IconButton>
                }
                title={user ? user[0].UserName : "Not Found"}
                subheader={user ? user[0].AccNo : "Not Found"}
              />
              <CardContent>
                <Typography variant="subtitle" color="text.secondary" sx={{fontWeight:'bold'}}>
                  {"Rs-"+accBalance.toLocaleString("en-US")+"/-"}
                </Typography>
              </CardContent>      
            </Card>
          </Grid>
          <Grid item xs={4}>
          <Card sx={{ maxWidth: 345, mt:3 }}>
            <CardHeader
              title="Last Transaction"
              subheader="Rs.1234.56/-"
            />
                  <Button style={{border:'solid 1px', padding:'5px', marginLeft:'50px', marginBottom:'5px', width:'100px'}}>CLOSE</Button>
                  <Button style={{border:'solid 1px', padding:'5px', marginLeft:'50px', marginBottom:'5px', width:'100px'}}>DETAIL</Button>
          </Card>
          </Grid>
          <Grid item xs={4}>

          </Grid>
          {/* <Grid item xs={4} style={{marginBottom:'50px'}}>
          <QRCode value="021-0001-000001-001"/>
          </Grid> */}
          <Grid item xs={4}>
            
          </Grid>
      </Grid>
      </>
  )
}

export default Dashbaord
