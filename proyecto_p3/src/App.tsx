import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import 'bootstrap/dist/css/bootstrap.css';
import {  Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Login } from './screens/Login';
import { SignUp } from './screens/SignUp';
import Home from "./screens/Home";
import ProductsScreen from './screens/ProductsScreen';
import Product from './screens/ProductScreen';
import ViewProductScreen from './screens/ViewProductScreen';
import ServicesScreen from './screens/ServicesScreen';
import Service from './screens/ServiceScreen';
import ViewServiceScreen from './screens/ViewServiceScreen';
import SalesScreen from './screens/SalesScreen';
import SaleScreen from './screens/SaleScreen';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null> (null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {    
        setIsAuthenticated(true);
      } else {    
        setIsAuthenticated(false);
      }
    });    
    return () => unsubscribe();
  }, []);

  return (    
    <Router>
      {
        isAuthenticated ? <ResponsiveAppBar/>: <></>
      }
    
      {
        isAuthenticated === null ? 
        <>
        </> : isAuthenticated ? 
        (
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/products" element={<ProductsScreen/>}/>
            <Route path="/products/:id" element={<Product/>}/>
            <Route path="/view-product/:id" element={<ViewProductScreen/>}/>
            <Route path="/services" element={<ServicesScreen/>}/>
            <Route path="/services/:id" element={<Service/>}/>
            <Route path="/view-service/:id" element={<ViewServiceScreen/>}/>
            <Route path="/sales" element={<SalesScreen/>}/>
            <Route path="/sales/:id" element={<SaleScreen/>}/>
          </Routes>
        ):(
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
          </Routes>
        )
      }
    </Router>
  );
}

export default App;
