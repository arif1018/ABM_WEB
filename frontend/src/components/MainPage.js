import * as React from 'react';
import Navbar from './admin/Navbar'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {

  const { user } = useSelector((state)=>state.auth)

  const navigate = useNavigate()
  React.useEffect(()=>{
    if(user){
      console.log(user.message)
      if(user.message !== "User Not Found"){
        navigate('/DashBaord')
      }
    }
    },[ user, navigate ])
//     const handleSubmit = (event) => {
//     event.preventDefault();
//   };
  return (
    <>
      <Navbar />
    </>
 );
}