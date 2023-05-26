import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Sale } from "../resources/Sale";
import useForm from '../hooks/useForm';
import { getProducts } from "../resources/ProductsFirebase";
import { getServices } from "../resources/ServicesFirebase";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { SelectChangeEvent } from '@mui/material/Select';

const emptySale: Sale = { 
  id: 0,
  products: [],
  services: [],
};

function SaleScreen() {
  const { id } = useParams();
  
  const [products, setProducts] = useState<QueryDocumentSnapshot<DocumentData>[] | []>([]);
  const [services, setServices] = useState<QueryDocumentSnapshot<DocumentData>[] | []>([]);

  useEffect(() => {
    getProductsData();
    getServicesData();
  }, []);

  const getProductsData = async () => {
    const fbProducts = await getProducts();
    setProducts(fbProducts.docs);
  };

  const getServicesData = async () => {
    const fbServices = await getServices();
    setServices(fbServices.docs);
  };

  const [productSale, setProductSale] = useState<string[]>([]);
  const [serviceSale, setServiceSale] = useState<string[]>([]);

  const handleChangeProductSale = (event: SelectChangeEvent<string | string[]>) => {
    const selectedProducts = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    setProductSale(selectedProducts);
  };

  const handleChangeServiceSale = (event: SelectChangeEvent<string | string[]>) => {
    const selectedServices = Array.isArray(event.target.value) ? event.target.value : [event.target.value];
    setServiceSale(selectedServices);
  };

  const handleSave = () => {
    // Lógica para guardar la venta
  };

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Typography variant="h4">Add sale</Typography>
          </Grid>
        </Grid>
        <Grid container marginTop={3}>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="products-label">Productos</InputLabel>
              <Select
                labelId="products-label"
                id="products-select"
                value={productSale}
                onChange={handleChangeProductSale}
                label="Productos"
                multiple
              >
                {products.map((product: QueryDocumentSnapshot<DocumentData>) => {
                  const { name } = product.data();
                  const { id } = product;

                  return (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <br /><br />
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="services-label">Servicios</InputLabel>
              <Select
                labelId="services-label"
                id="services-select"
                value={serviceSale}
                onChange={handleChangeServiceSale}
                label="Servicios"
                multiple
              >
                {services.map((service: QueryDocumentSnapshot<DocumentData>) => {
                  const { name } = service.data();
                  const { id } = service;

                  return (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <br /><br />
            <Button variant="contained" onClick={handleSave}>
              Guardar
            </Button>
            <br /><br />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SaleScreen;
