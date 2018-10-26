import React from "react";
import '../../assets/style.css';
import './navhead.css';
// import '../../../src/assets/images/'

const Navbar = () =>
  <nav>
    <div className="row text-center">
      <div className="col-md-2">
        <img className="img-fluid img-cross" src="assets/images/cross.svg" />
      </div>
      <div className="col-md-8">
        <span className="box-head"> <h1>SpotBot</h1> </span>
      </div>
      <div className="col-md-2">
        <img className="img-fluid img-cross" src="assets/images/cross.svg" />
      </div>
    </div>
  </nav>;

export default Navbar;