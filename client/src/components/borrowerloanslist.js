import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";
import React from "react";
import LoanLineItem from "./loan";
import "./loans.css";
import { Component } from "react";
//import { DataGrid } from "@mui/x-data-grid";
class BorrowerLoansList extends Component {
  constructor(props) {
    super(props);
    var filteredLoans = props.data.loans.filter(function(l) {
      return l.borrower === props.data.accounts[0];
    });
    this.state = {
      Loans: filteredLoans,
    };
  }

  componentWillReceiveProps(nextProps) {
    var filteredLoans = nextProps.data.loans.filter(function(l) {
      return l.borrower === nextProps.data.accounts[0];
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

      { field: "interest", headerName: "Interest", width: 130 },

      //aamir
      {
        field: "action",
        headerName: "Action",
        sortable: false,
        renderCell: (params) => {
          const onClick = async (row, e) => {
            let amount = parseInt(prompt("Please enter your repayment amount"));
            // const amountInWei = this.state.web3.utils.toWei(
            //   formamount,
            //   "ether"
            // );
            if (1 === 1) {
              // console.log("cancel offer");
              // console.log(row);
              const {
                accounts,
                contract,
                formname,
                formidn,
                formcredit,
                signedAgreement,
              } = this.props.data;

              const response = await contract.methods
                .findRemainingAmt(
                  // formname,
                  // formidn,
                  row.row.id
                  // formcredit,
                  // signedAgreement
                )
                .send({ from: accounts[0] }) //, amount: amount
                .then((res) => console.log("Amount Repaid"))
                .catch((err) => console.log(err));
            }
            //console.log("Outstanding", this.response);
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
    ];

    const rows = [];
    for (var elem in this.props.data.loans) {
      const lenderDetail = this.props.data.loans[elem];
      
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
