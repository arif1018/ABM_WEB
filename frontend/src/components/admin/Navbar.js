import React, { useEffect } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Stack, Button } from '@mui/material'
// import logo from '../../images/FinalLogo.jpg'
import logo from '../../images/FinalLogo.png'
import { useNavigate}  from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logOut, reset } from '../../features/auth/authSlice'
import '../../services/GlobalVariables'

export default function Navbar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, message } =useSelector((state)=>state.auth)
    const logOutfunc = ()=>{
        dispatch(logOut())
        dispatch(reset())
        navigate('/')
    }

    useEffect(()=>{
    },[ user ])

    return (
    <AppBar position='static' sx={{
        bgcolor: 'primary.main',
    }}>
        <Toolbar>
            <IconButton>
                <div style={{backgroundColor:'#fff', height:'70px', width:'140'}}>
                <img src={logo} height={70} width={140} alt='' onClick={()=>navigate("/")} />
                </div>
            </IconButton>
            <Typography variant='h4' component='div' sx={{ flexGrow:'1', display:{lg:'flex', xs:'none'}, ml:4 }}>
                {global.COMPANY_NAME}
            </Typography>
            <Stack direction='row' spacing={2}>
                {user !== null ? <>{message !== 'User Not Found' ? (<>
                    {user[0].Member === 'Administrator'?(<>
                {/* <Button color='inherit' onClick={()=>navigate('/AdminPanel')}>Dashboard</Button> */}
                </>):(<>
                {/* <Button color='inherit' onClick={()=>navigate('/DashBaordEng')}>Dashboard</Button> */}
                </>)}
                    <Button color='inherit' sx={{display:{lg:'flex', xs:'none'}}} >Welcome {user[0].UserName}</Button></>) : (<></>)}
                </>:(<></>)}
                {user ? (
                    <>{message !== 'User Not Found' ? (<>
                        <Button color='inherit' onClick={logOutfunc} style={{fontSize:'17px'}}>Log Out</Button>
                    </>):(<>
                        <Button color='inherit' onClick={()=>{
                            logOutfunc()
                            navigate("/LogInEng")}} style={{fontSize:'17px'}}>Login</Button>
                    </>)}
                    </>
                ): (
                    <>   
                    <Button color='inherit' onClick={()=>{
                            logOutfunc()
                            navigate("/Login")}}style={{fontSize:'17px'}}>Login</Button>             
                    </>
                )}
            </Stack>
        </Toolbar>
    </AppBar>
  )
}
