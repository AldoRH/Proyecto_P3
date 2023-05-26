import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import "bootstrap/dist/css/bootstrap.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./screens/Home";
import ProductsScreen from "./screens/ProductsScreen";
import Product from "./screens/ProductScreen";
import ViewProductScreen from "./screens/ViewProductScreen";
import ServicesScreen from "./screens/ServicesScreen";
import Service from "./screens/ServiceScreen";
import ViewServiceScreen from "./screens/ViewServiceScreen";
import SalesScreen from "./screens/SalesScreen";
import SaleScreen from "./screens/SaleScreen";
import { ViewSale } from "./screens/ViewSale";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
