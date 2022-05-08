import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import InstaMoneyContract from "./contracts/InstaMoney.json";
import getWeb3 from "./getWeb3";
import { ToastsContainer, ToastsStore } from "react-toasts";
import { Route, Routes } from "react-router-dom";
import MainNavigation from "./components/MainNavigation";
import CurrDate from "./components/CurrDate";
import "./components/Borrow.css";
import Borrow from "./components/Borrow";
import BankRates from "./components/BankRates";
import Lend from "./components/Lend";
import LoansList from "./components/loansList";
import { Tabs, Tab, AppBar, TextField } from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "./App.css";
import BorrowerLoansList from "./components/borrowerloanslist.js";
const useStyles = (theme) => ({
  formfield: {
    marginTop: 20,
    marginBottom: 20,
    display: "block",
  },
});

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    currTab: 0,
    loans: [],
    name: undefined,
    signedAgreement: false,
  };

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
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.initialSetup);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleTabChange = (e, val) => {
    this.setState({ currTab: val });
  };

  handleNameChange = (event) => {
    const formname = event.target.value;
    this.setState({ formname: formname });
  };

  handleAmtChange = (event) => {
    const formamount = event.target.value;
    this.setState({ formamount: formamount });
  };

  handleFormIdnChange = (event) => {
    const formidn = event.target.value;
    this.setState({ formidn: formidn });
  };

  handleInterestRateChange = (event) => {
    const formrate = event.target.value;
    this.setState({ formrate: formrate });
  };

  handleTermChange = (event) => {
    const formterm = event.target.value;
    this.setState({ formterm: formterm });
  };

  handleCreditScoreChange = (event) => {
    const formcredit = event.target.value;
    this.setState({ formcredit });
  };

  handleAgreementChange = (event) => {
    const signedAgreement = event.target.checked;
    this.setState({ signedAgreement });
  };

  handleFormSubmitLender = async (e) => {
    e.preventDefault();

    // console.log("Btn lender");
    const {
      accounts,
      contract,
      formname,
      formamount,
      formidn,
      formterm,
      formrate,
    } = this.state;

    //const amountInWei = this.state.web3.utils.toWei(formamount, "ether");
    // console.log(formname, amountInWei, formidn, formterm, formrate);

    // https://web3js.readthedocs.io/en/v1.2.11/web3-utils.html#fromwei
    // ^use this while receiving and sending ethers
    const response = await contract.methods
      .offerLoan(formname, formidn, formterm, formrate, formamount)
      .call()
      .then(function (res) {
        ToastsStore.success("Loan Posted On The Marketplace!");
      })
      .then(this.getAllLoans)
      .catch((err) => console.log(err));
  };

  handleFormSubmitBorrower = async (e) => {};

  initialSetup = async () => {
    const { accounts, contract } = this.state;
    const response = await contract.methods.getAllLoans().call();
    this.setState({ loans: response });
    console.log(accounts[0]);
    const userdetails = await contract.methods
      .getUserDetails(accounts[0])
      .call();
    console.log("userdetails", userdetails);

    this.setState({
      formname: userdetails.name,
      formidn: userdetails.identification,
    });
  };

  getAllLoans = async () => {
    console.log("UUU");
    // console.log("Success", res);
    const { accounts, contract } = this.state;

    console.log("UUUU");

    const response = await contract.methods.getAllLoans().call();
    // console.log("WWW Got ->", response);

    console.log("UUUUU");
    this.setState({ loans: response });

    console.log("UUUUUU");
  };

  render() {
    const { classes } = this.props;
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <ToastsContainer store={ToastsStore} />
        <div>
          <MainNavigation />
          <AppBar position="static">
            <Tabs value={this.state.currTab} onChange={this.handleTabChange}>
              <Tab label="Lend" />
              <Tab label="Borrow" />
            </Tabs>
          </AppBar>
          <Box m={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <form
                      noValidate
                      autoComplete="off"
                      onSubmit={
                        this.state.currTab === 0
                          ? this.handleFormSubmitLender
                          : this.handleFormSubmitBorrower
                      }
                    >
                      <TextField
                        onChange={this.handleNameChange}
                        value={this.state.formname || ""}
                        className={classes.formfield}
                        label="Name"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        required
                      />

                      {this.state.currTab === 0 && (
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
                      )}
                      <TextField
                        onChange={this.handleFormIdnChange}
                        value={this.state.formidn || ""}
                        className={classes.formfield}
                        label="Identification (SSN/PAN)"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        required
                      />

                      {this.state.currTab === 0 && (
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
                      )}
                      {this.state.currTab === 0 && (
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
                      )}
                      {this.state.currTab === 1 && (
                        <TextField
                          onChange={this.handleCreditScoreChange}
                          type="number"
                          value={this.state.formcredit}
                          className={classes.formfield}
                          label="Credit Score"
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          required
                        />
                      )}
                      {this.state.currTab === 1 && (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={this.state.signedAgreement}
                              onChange={this.handleAgreementChange}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          }
                          label="Signed Agreement"
                        />
                      )}

                      {this.state.currTab === 0 ? (
                        <Button
                          type="submit"
                          color="secondary"
                          variant="outlined"
                          endIcon={<KeyboardArrowRight />}
                        >
                          {this.state.currTab === 0 ? "Lend Money" : "Register"}
                        </Button>
                      ) : null}
                    </form>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={9}>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom component="div">
                      {this.state.currTab === 0 ? "" : ""}
                    </Typography>{" "}
                    <LoansList
                      data={this.state}
                      refreshcallback={this.getAllLoans}
                    />
                  </CardContent>
                  {this.state.currTab === 1 ? (
                    <CardContent>
                      <Typography variant="h6" gutterBottom component="div">
                        {this.state.currTab === 0 ? "" : ""}
                      </Typography>{" "}
                      <BorrowerLoansList
                        data={this.state}
                        refreshcallback={this.getAllLoans}
                      />
                    </CardContent>
                  ) : null}
                </Card>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(App);
