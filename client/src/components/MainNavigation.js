import React, { Component } from "react";

import { Link } from "react-router-dom";
import classes from "./MainNavigation.module.css";
function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>instaMoney</div>
    </header>
  );
}

export default MainNavigation;
