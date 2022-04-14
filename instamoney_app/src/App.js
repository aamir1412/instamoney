
import { Route, Routes } from 'react-router-dom'
import MainNavigation from './components/MainNavigation';
import CurrDate from "./components/CurrDate";
import './components/Borrow.css';
import Borrow from "./components/Borrow";
import BankRates from "./components/BankRates";
import Lend from './components/Lend'


function App() {
  return (
    <div>
      <MainNavigation/>
        <h2> </h2>
        <CurrDate/>
        <Routes>           
                    
          <Route path="/" element = {<Borrow/>} />      
          <Route path='/lend' element = {<Lend/> }/>                                                           
          <Route path='/rates' element = {<BankRates/> }/>                                                
        </Routes> 
         
    </div>
  );
}

export default App;
