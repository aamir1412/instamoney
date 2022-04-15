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
import LoansList from "./components/loansList";
import {Tabs, Tab, AppBar, TextField} from '@material-ui/core';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@mui/material/Typography';

import "./App.css";

const useStyles = theme => ({
  formfield:{
    marginTop: 20,
    marginBottom: 20,
    display: 'block'
  },
});

class App extends Component {
  
  state = { storageValue: 0, web3: null, accounts: null, contract: null, currTab: 0, currFormData: {}};

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

  handleTabChange = (e, val) => {
    this.setState({currTab : val});
    console.log(val);
  }

  handleNameChange = (event) => {
    const formname = event.target.value;
    this.setState({ formname: formname });
  }

  handleAmtChange = (event) => {
    const formamount = event.target.value;
    this.setState({ formamount: formamount });
  }

  handleFormIdnChange = (event) => {
    const formidn = event.target.value;
    this.setState({ formidn: formidn });
  }

  handleInterestRateChange = (event) => {
    const formrate = event.target.value;
    this.setState({ formrate: formrate });
  }

  handleTermChange = (event) => {
    const formterm = event.target.value;
    this.setState({ formterm: formterm });
  }

  handleFormSubmit = async (e) => {
    e.preventDefault();
    const { accounts, contract, formname, formamount, formidn, formterm, formrate } = this.state;

    const amountInWei = this.state.web3.utils.toWei(formamount, 'ether');
    console.log(formname, amountInWei, formidn, formterm, formrate);

    // https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html#fromwei
    // ^use this while receiving and sending ethers
    const response = await contract.methods.offerLoan(formname, formidn, formterm, formrate).send({from: accounts[0], value: amountInWei})
                                                      .then(res => 
                                                        console.log('Success', res))
                                                      .catch(err => console.log(err));
  }

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
    const { classes } = this.props;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div>
          <MainNavigation/>
          <AppBar position="static">
            <Tabs value = {this.state.currTab} onChange={this.handleTabChange}>
              <Tab label="Lend"/>
              <Tab label="Borrow"/>
            </Tabs>
          </AppBar>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <form noValidate autoComplete="off" onSubmit={this.handleFormSubmit}>
                    <TextField
                      onChange={this.handleNameChange}
                      value={this.state.formname}
                      className={classes.formfield}
                      label="Name"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      required
                    />
                    <TextField
                      type="number"
                      onChange={this.handleAmtChange}
                      value={this.state.formamount}
                      className={classes.formfield}
                      label="Amount"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      required
                    />
                    <TextField
                      onChange={this.handleFormIdnChange}
                      value={this.state.formidn}
                      className={classes.formfield}
                      label="Identification (SSN/PAN)"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      required
                    />
                    <TextField
                      onChange={this.handleTermChange}
                      type="number"
                      value={this.state.formterm}
                      className={classes.formfield}
                      label="Term"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      required
                    />
                    <TextField
                      onChange={this.handleInterestRateChange}
                      value={this.state.formrate}
                      className={classes.formfield}
                      label="Interest Rate"
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      required
                    />
                    <Button
                    type="submit" color="secondary" variant="outlined"
                    endIcon={<KeyboardArrowRight/>}>
                      {(this.state.currTab === 0) ? "Lend Money" : "Find Best Rates"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={9}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom component="div">
                    {this.state.currTab === 0 ? 'Loans you have offered' : 'Loans you have taken'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {(this.state.currTab === 1) ? 
            <Grid item xs={12} md={12}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                <Typography variant="h5" gutterBottom component="div">
                  Open Offers
                </Typography>
                </CardContent>
              </Card>
            </Grid> : null
            }
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
