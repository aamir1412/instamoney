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
    this.state = {
      Loans: this.props.data.loans,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ Loans: nextProps.data.loans });
  }

  render() {
    console.log(this.props.data.loans, "This is the Loans Lended by Lender");
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
          console.log(params);
          const onClick = (id, e) => {
            e.stopPropagation(); // don't select this row after clicking
            console.log(e, id);
            // const api = params.api;
            // const thisRow = {};

            // api
            //   .getAllColumns()
            //   .filter((c) => c.field !== "__check__" && !!c)
            //   .forEach(
            //     (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            //   );

            // return alert(JSON.stringify(thisRow, null, 4));
          };

          return this.props.data.currTab === 1 ? (
            <Button
              //   type="submit"
              color="secondary"
              variant="outlined"
              //   endIcon={<KeyboardArrowRight />}
              onClick={onClick.bind(this, params.id)}
            >
              Confirm
            </Button>
          ) : (
            <div></div>
          );
        },
      },
      //   {
      //     field: "age",
      //     headerName: "Age",
      //     type: "number",
      //     width: 90,
      //   },
      //   {
      //     field: "fullName",
      //     headerName: "Full name",
      //     description: "This column has a value getter and is not sortable.",
      //     sortable: false,
      //     width: 160,
      //     valueGetter: (params) =>
      //       `${params.row.firstName || ""} ${params.row.lastName || ""}`,
      //   },
    ];

    const rows = [];
    for (var elem in this.props.data.loans) {
      const lenderDetail = this.props.data.loans[elem];
      rows.push({
        id: lenderDetail[0],
        lender: lenderDetail[5],
        borrower: lenderDetail[6],
        amount: this.props.data.web3.utils.fromWei(lenderDetail[1], "ether"),
        term: lenderDetail.term,
        interest: lenderDetail[4],
      });
      //   console.log({
      //     id: elem[0],
      //     lender: elem[0],
      //     borrower: elem[0],
      //     amount: elem[0],
      //   });
    }

    // const rows = Object.map(this.props.data.loans, (elem) => {
    //   return {
    //     id: elem[0],
    //     lender: elem[0],
    //     borrower: elem[0],
    //     amount: elem[0],
    //   };
    // });

    return (
      <div className="LoansList">
        <div>
          <h1>Loans</h1>
          {/* <table>
            <thead>
              {
                <tr>
                  <th>ID</th>
                  <th>Lender</th>
                  <th>Borrower</th>
                  <th>Amount</th>
                  <th>Rate</th>
                  <th>Term</th>
                  <th>Status</th>
                  <th>Repaid Amount</th>
                </tr>
              }
            </thead>
            <tbody>
              {this.state.Loans.map((loan, i) => (
                <LoanLineItem key={i} {...loan} />
              ))}
            </tbody>
          </table> */}

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
