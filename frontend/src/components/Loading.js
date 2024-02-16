import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';

const outerTheme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
  },
});
export default function CircularColor({loadingText}) {
  return (
       <ThemeProvider theme={outerTheme}>
    <div style={{marginTop:'100px'}}>
    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row" justifyContent={'center'}>
      <Typography color='primary' style={{fontSize:'20px', fontWeight:'bolder', fontFamily:'Times New Roman'}}>Loading {loadingText}</Typography>
      <CircularProgress color="primary" />
    </Stack>
    </div>
    </ThemeProvider>
  );
}
