import React from 'react'

const LoanLineItem = ({
                    id,
                    lender,
                    borrower,
                    amount,
                    rate,
                    term,
                    status,
                    repaid_amt
                }) => 
                    (
                        <tr>
                            <td>{id}</td>
                            <td>{lender}</td>
                            <td>{borrower}</td>
                            <td>{amount}</td>
                            <td>{rate}</td>
                            <td>{term}</td>
                            <td>{status}</td>
                            <td>{repaid_amt}</td>
                        </tr>
                    )

export default LoanLineItem;