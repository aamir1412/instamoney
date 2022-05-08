import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";
import React from "react";
import { ToastsContainer, ToastsStore } from "react-toasts";
import LoanLineItem from "./loan";
import "./loans.css";
import { Component } from "react";
//import { DataGrid } from "@mui/x-data-grid";
class BorrowerLoansList extends Component {
  constructor(props) {
    super(props);
    var filteredLoans = props.data.loans.filter(function (l) {
      return l.borrower === props.data.accounts[0] && l.status === "1";
    });
    this.state = {
      Loans: filteredLoans,
    };
  }

  componentWillReceiveProps(nextProps) {
    var filteredLoans = nextProps.data.loans.filter(function (l) {
      return l.borrower === nextProps.data.accounts[0] && l.status === "1";
    });

    this.setState({ Loans: filteredLoans });
  }

  render() {
    // console.log(this.props.data.loans, "This is the Loans Lended by Lender");
    const columns = [
      { field: "id", headerName: "ID", width: 70 },
      { field: "lender", headerName: "Lender", width: 200 },
      { field: "borrower", headerName: "Borrower", width: 200 },
      { field: "amount", headerName: "Amount", width: 150 },
      { field: "term", headerName: "Term", width: 130 },

      { field: "interest", headerName: "Interest", width: 100 },

      //aamir
      {
        field: "action",
        headerName: "Action",
        sortable: false,
        renderCell: (params) => {
          const onClick = async (row, e) => {
            // let amount = parseInt(prompt("Please enter your repayment amount"));
            const { accounts, contract } = this.props.data;

            const remainingAmount = await contract.methods
              .calculateRepaymentAmount(row.row.id)
              .call();
            console.log("remainingAmount", remainingAmount);
            const response = await contract.methods
              .payOffLoan(row.row.id, remainingAmount)
              .send({ from: accounts[0] })
              .then(function (res) {
                ToastsStore.success(
                  "Loan Paid Off! Amount transferred to lender"
                );
              })
              .then(this.props.refreshcallback)
              .catch(function (err) {
                console.log("WWW->", err);
                ToastsStore.error(err.message, 8000);
              });
            e.stopPropagation(); // don't select this row after clicking
          };

          return (
            <Button
              color="secondary"
              variant="outlined"
              onClick={onClick.bind(this, params)}
            >
              Pay Off
            </Button>
          );
        },
      },
      {
        field: "partialpay",
        headerName: "Pay Partial",
        sortable: false,
        width: 150,
        renderCell: (params) => {
          const onClick = async (row, e) => {
            let amount = parseInt(prompt("Please enter your repayment amount"));
            if (!amount) {
              amount = 0;
            }
            const { accounts, contract, web3 } = this.props.data;

            //const amountInWei = web3.utils.toWei("" + amount, "ether");
            const response = await contract.methods
              .payOffLoan(row.row.id, amount)
              .send({ from: accounts[0] })
              .then(function (res) {
                ToastsStore.success(
                  "Partilly Paid! Amount transferred to lender"
                );
              })
              .then(this.props.refreshcallback)
              .catch(function (err) {
                console.log("WWW->", err);
                ToastsStore.error(err.message, 8000);
              });

            const remainingAmount = await contract.methods
              .calculateRepaymentAmount(row.row.id)
              .call();
            ToastsStore.success(
              "Remaining Amount is : " + remainingAmount + " Wei",
              8000
            );
            e.stopPropagation(); // don't select this row after clicking
          };

          return (
            <Button
              color="secondary"
              variant="outlined"
              onClick={onClick.bind(this, params)}
            >
              Pay Partial
            </Button>
          );
        },
      },
    ];

    const rows = [];
    for (var elem in this.state.Loans) {
      const lenderDetail = this.state.Loans[elem];
      // console.log("QQQ", lenderDetail);

      if (
        lenderDetail[6] === this.props.data.accounts[0]
        // lenderDetail[6] is Borrower Account
      ) {
        rows.push({
          id: lenderDetail[0],
          lender: lenderDetail[5],
          borrower: lenderDetail[6],
          amount: this.props.data.web3.utils.fromWei(lenderDetail[1], "ether"),
          term: lenderDetail.term,
          interest: lenderDetail[4],
        });
      }
    }

    return (
      <div className="BorrowerLoansList">
        <div>
          <h1>My Loans</h1>

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              key={rows.length}
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}

              // checkboxSelection
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BorrowerLoansList;
