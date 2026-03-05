import React from "react";
import Dashboard from "./Dashboard";
import Product from "./Product";
import Company from "./Company";
import Customer from "./Customer";
import TotalOrders from "./TotalOrders";
import Returns from "../pages/Returns";



function MainContent({ activeTab }) {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard/>
      case "total-orders":
        return <TotalOrders/>
      case "products":
        return <Product/>
        case "company":
        return <Company/>
        case "customer":
          return <Customer/>
          case "return":
            return <Returns/>
      default:
        return <Dashboard/>
  };
}

export default MainContent;