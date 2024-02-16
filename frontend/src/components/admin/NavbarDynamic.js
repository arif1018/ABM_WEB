// import * as React from 'react';
// import { Dropdown } from '@mui/base/Dropdown';
// import { Menu } from '@mui/base/Menu';
// import { MenuButton } from '@mui/base/MenuButton';
// import { MenuItem } from '@mui/base/MenuItem';
// import { getParentMenu } from '../../features/menu/menuSlice'
// import { useDispatch, useSelector } from 'react-redux';
// import Loading from '../Loading'
// import { useNavigate } from 'react-router-dom';
// export default function BasicMenu() {
  
//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const {user} = useSelector((state)=>state.auth)

//   const {parentMenu, isLoading } = useSelector((state)=>state.menu)

//   React.useEffect(()=>{
//     if(!localStorage.getItem('olduser')){
//       localStorage.setItem('olduser', JSON.stringify(user))
//     if(user){
//       if(!parentMenu.length > 0){
//         dispatch(getParentMenu(user[0].ID))
//       }  
//     }}else{
//       if(JSON.parse(localStorage.getItem('user'))[0].ID !== JSON.parse(localStorage.getItem('olduser'))[0].ID){
//         localStorage.removeItem('olduser')
//         localStorage.setItem('olduser', JSON.stringify(user))
//         dispatch(getParentMenu(user[0].ID))
//       }else{
//         if(user){
//           if(!parentMenu.length > 0){
//             dispatch(getParentMenu(user[0].ID))
//           }  
//         }
//       }
//     }
//   },[ dispatch , user, parentMenu.length ])

//   return (
//     <div style={{backgroundColor:`${isLoading ? 'white': '#1D4950'}`, display:'flex', justifyContent:'center', 
//       padding:'5px', marginTop:'5px'}}>
//               {isLoading ? <>
//         <Loading/>
//       </> : <>

//       {parentMenu ? parentMenu.map((menu, index)=>(<>
//     <Dropdown>
//         <MenuButton style={{color:'#0029DA', backgroundColor:'white', borderRadius:'10px', padding:'15px', cursor:'pointer'}}>{menu.menu_name}</MenuButton>
//         <Menu >
//         {parentMenu[index].subMenus ? parentMenu[index].subMenus.map((smenu, sindex)=>(<>
//         <MenuItem key={sindex} style={{listStyleType:'none', backgroundColor:'#0029DA', color:'white', padding:'5px', hover:'yellow', cursor: 'pointer'}} onClick={()=> navigate(`${smenu.webURL}`)}>{smenu.menu_name}</MenuItem>
//         </>)):(<Loading />)}
//         </Menu>
//       </Dropdown>
//       </>)):(<Loading />)}</>}
//       </div>
//   );
// }


import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// import InboxIcon from '@mui/icons-material/Inbox';
import { getParentMenu } from '../../features/menu/menuSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

export default function BasicAccordion() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {user} = useSelector((state)=>state.auth)
    const { parentMenu } = useSelector((state)=>state.menu)
  
    React.useEffect(()=>{
      dispatch(getParentMenu(user[0].ID))
    },[ dispatch, user ])
  
  return (
    <div>
      {parentMenu ? (parentMenu.map((menu, index)=>(<>
            <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{menu.menu_name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {menu.subMenus.length > 0 ? (menu.subMenus.map((smenu, index)=><>
                <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem sx={{p:1}}>
            <ListItemButton onClick={()=>navigate(smenu.webURL)}>
              {/* <ListItemIcon>
                <InboxIcon />
              </ListItemIcon> */}
              <ListItemText primary={smenu.menu_name} />
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
      </nav>
    </Box>
            </>)) : (<></>) }
        </AccordionDetails>
      </Accordion>
        </>))):(<></>)}
    </div>
  );
}
