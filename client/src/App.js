import React, { Component } from "react";
import InstaMoneyContract from "./contracts/InstaMoney.json";
import getWeb3 from "./getWeb3";

import { Route, Routes } from 'react-router-dom';
import MainNavigation from './components/MainNavigation';
import CurrDate from "./components/CurrDate";
import './components/Borrow.css';
import Borrow from "./components/Borrow";
import BankRates from "./components/BankRates";
import Lend from './components/Lend';

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = InstaMoneyContract.networks[networkId];
      const instance = new web3.eth.Contract(
        InstaMoneyContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // // Testing our contract. Works
    // const response1 = await contract.methods.getLateFine().call();
    // console.log('QQQ Got ->', response1);
    // await contract.methods.changeLateFine(5000).send({ from: accounts[0] });
    // const response2 = await contract.methods.getLateFine().call();
    // console.log('QQQ Got ->', response2);

    this.setState({ storageValue: 0 });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
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
      </div>
    );
  }
}

export default App;
