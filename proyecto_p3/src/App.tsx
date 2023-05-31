import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.css";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { Login } from "./screens/Login";
import { SignUp } from "./screens/SignUp";
import ProductsScreen from "./screens/ProductsScreen";
import Product from "./screens/ProductScreen";
import ViewProductScreen from "./screens/ViewProductScreen";
import ServicesScreen from "./screens/ServicesScreen";
import Service from "./screens/ServiceScreen";
import ViewServiceScreen from "./screens/ViewServiceScreen";
import SalesScreen from "./screens/SalesScreen";
import SaleScreen from "./screens/SaleScreen";
import { ViewSale } from "./screens/ViewSale";
import { NotFoundPage } from "./screens/NotFoundPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      {isAuthenticated && <ResponsiveAppBar />}

      {isAuthenticated === null ? null : isAuthenticated ? (
        <Routes>
          <Route path="/products" element={<ProductsScreen />} />
          <Route path="/products/add" element={<Product />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/view-product/:id" element={<ViewProductScreen />} />
          <Route path="/services" element={<ServicesScreen />} />
          <Route path="/services/add" element={<Service />} />
          <Route path="/services/:id" element={<Service />} />
          <Route path="/view-service/:id" element={<ViewServiceScreen />} />
          <Route path="/" element={<SalesScreen />} />
          <Route path="/sales/:id" element={<SaleScreen />} />
          <Route path="/view-sale/:id" element={<ViewSale />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
