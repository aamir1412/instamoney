import React, { Component } from "react";

import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";
function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>instaMoney</div>
      <nav>
        <ul>
          <li>{/* <Link to="/" className="nav">{" "} Borrow{" "}</Link> */}</li>
          <h2> </h2>
          <li>
            {/* <Link to='/rates' className='nav1' > BankRates </Link> */}
          </li>
          <li>{/* <Link to='/lend' className='nav1' > Lend </Link> */}</li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
