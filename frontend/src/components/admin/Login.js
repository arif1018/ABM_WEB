import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import logo from '../../images/FinalLogo.png'
import Loading from '../../Loading'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../../features/auth/authSlice'

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, isLoading, isError, isSuccess, message} =useSelector((state)=>state.auth)
    const [errMsg, setErrorMessage] = React.useState('')
    React.useEffect( ()=>{
          if(isSuccess){
            if(user.message !== 'User Not Found'){
            if(user[0].Member === "Administrator"){
              navigate('/DashBaord')
              return  
            }else{
              navigate('/')
              return  
            }}else{
              if(!isLoading){
                setErrorMessage('Invailid Credentials!...')
              }
            }
        }
    },[user, isError, isLoading, isSuccess, message, navigate ])

    const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {UserID:data.get('UserID'), Password:data.get('Password')}
    dispatch(login(userData))
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={logo} height={70} width={70} alt='' onClick={()=>navigate("/")} />
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {isLoading ? (<Loading />):(<></>)}
          {errMsg ? (<Typography style={{backgroundColor:'red', 
                                          padding:10, 
                                          margin:10, 
                                          borderRadius:20, 
                                          color:'white', 
                                          minWidth:250, 
                                          textAlign:'center'}}>
                        {errMsg}
                      </Typography>):(<></>)}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="UserID"
              label="Enter User ID"
              name="UserID"
              autoComplete="UserID"
              autoFocus
              onFocus={()=>setErrorMessage('')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="Password"
              label="Password"
              type="Password"
              id="Password"
              autoComplete="current-password"
              onFocus={()=>setErrorMessage('')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/SignUpEng" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/SignUpEng" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}