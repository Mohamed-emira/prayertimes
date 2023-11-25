import React from 'react'
import './App.css';
import MainContent from './Component/MainContent';
import Container from '@mui/material/Container';

 function App() {
  return (
    <>
    <div >
       <Container maxWidth="xl">
      <MainContent/>
      </Container>
          </div>
    </>
  )
}
export default App;