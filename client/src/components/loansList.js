import { Button } from "@mui/material";
import { DataGrid, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";
import React from "react";
import LoanLineItem from "./loan";
import "./loans.css";
import { Component } from "react";
//import { DataGrid } from "@mui/x-data-grid";
class LoansList extends Component {
  constructor(props) {
    super(props);
    var filteredLoans = props.data.loans.filter(function(l) {
      return l.status === "3";  //only open loans can be taken
    });
    // console.log("ZZZ -> ", props.data.loans);
    this.state = {
      Loans: filteredLoans,
    };
  }

  componentWillReceiveProps(nextProps) {
    var filteredLoans = nextProps.data.loans.filter(function(l) {
      return l.status === "3";  //only open loans can be taken
    });

    // console.log("QQQ -> ", nextProps.data.loans);
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
            // if (!window.confirm("Are you sure? Confirm")) {
            //   return false;
            // }

            if (this.props.data.currTab === 1) {
              const {
                accounts,
                contract,
                formname,
                formidn,
                formcredit,
                signedAgreement,
              } = this.props.data;

              const response = await contract.methods
                .takeLoan(
                  formname,
                  formidn,
                  row.row.id,
                  formcredit,
                  signedAgreement
                )
                .send({ from: accounts[0] })
                .then(this.props.refreshcallback)
                .catch((err) => console.log(err));
            }
            if (this.props.data.currTab === 0) {
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
                .cancelOffer(
                  // formname,
                  // formidn,
                  row.row.id
                  // formcredit,
                  // signedAgreement
                )
                .send({ from: accounts[0] })
                .then(this.props.refreshcallback)
                .catch((err) => console.log(err));
            }

            e.stopPropagation(); // don't select this row after clicking
          };

          return this.props.data.currTab === 1 ? (
            <Button
              color="secondary"
              variant="outlined"
              onClick={onClick.bind(this, params)}
            >
              Confirm
            </Button>
          ) : (
            <Button
              color="secondary"
              variant="outlined"
              onClick={onClick.bind(this, params)}
            >
              Cancel
            </Button>
          );
        },
      },
    ];

    const rows = [];
    for (var elem in this.state.Loans) {
      const lenderDetail = this.state.Loans[elem];
      rows.push({
        id: lenderDetail[0],
        lender: lenderDetail[5],
        borrower: lenderDetail[6],
        amount: this.props.data.web3.utils.fromWei(lenderDetail[1], "ether"),
        term: lenderDetail.term,
        interest: lenderDetail[4],
      });
    }
    
    return (
      <div className="LoansList">
        <div>
          {<h1>{this.props.data.currTab === 0 && "Your Open Offers"}</h1>}
          {<h1>{this.props.data.currTab === 1 && "Available Loans"}</h1>}

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

export default LoansList;
