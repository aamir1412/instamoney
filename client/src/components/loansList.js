import React from 'react'
import LoanLineItem from './loan';
import './loans.css'
import { Component } from 'react'

class LoansList extends Component{

    componentDidMount(){
        // fetch('/loans')
        // .then(results => { return results.json();})
        // .then(Loans => {this.setState({Loans})});
    }

    constructor(props){
        super(props)
        this.state = {
            Loans: []
        }
    }

render() { 
    return (
            <div className="LoansList">
                <div>
                <h1>Loans</h1>
                <table>
                    <thead>
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
                    </thead>
                    <tbody>
                        {this.state.Loans.map((loan, i) =>
                            <LoanLineItem key={i}
                                    {...loan}/>
                        )}
                    </tbody>
                </table>
                </div>
            </div>
        )
    }
}

export default LoansList;