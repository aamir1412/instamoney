
import { Route, Routes } from 'react-router-dom';

import CurrDate from "./components/CurrDate";
import './components/Borrow.css';
import Borrow from "./components/Borrow";
import BankRates from "./components/BankRates";

function App() {
  return (
    <div>
      <CurrDate/>
    <Routes>    
      <Route path='/' element = {<Borrow/> }>
           
      </Route>                                                  
      </Routes>  
      <BankRates></BankRates>
    </div>
  );
}

export default App;
