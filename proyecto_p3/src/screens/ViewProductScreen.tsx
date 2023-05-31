import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Product } from "../resources/Product";
import { Container, Grid, TextField, Typography } from "@mui/material";
import useForm from "../hooks/useForm";
import { getProductById } from "../resources/ProductsFirebase";

const ProductScreen = () => {
  const { id } = useParams();

  useEffect(() => {
    getProductData();
  }, []);

  const emptyProduct: Product = {
    name: "",
    pv: 0,
    pc: 0,
    stock: 0,
  };

  const [formProduct, handleChange] = useForm(emptyProduct);

  const { name, pc, pv, stock } = formProduct;

  const getProductData = async () => {
    const fbProduct = await getProductById(id);

    if (fbProduct) {
      const { name, pv, pc, stock } = fbProduct;

      handleChange({ target: { name: "name", value: name } });
      handleChange({ target: { name: "pv", value: pv } });
      handleChange({ target: { name: "pc", value: pc } });
      handleChange({ target: { name: "stock", value: stock } });
    }
  };

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Typography variant="h4">Product</Typography>
          </Grid>
        </Grid>
        <Grid container marginTop={3}>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              type="text"
              disabled
              name="name"
              value={name}
              onChange={handleChange}
              fullWidth
              label="Nombre"
              variant="outlined"
            />
            <br />
            <br />
            <TextField
              type="text"
              disabled
              name="pv"
              value={pv}
              onChange={handleChange}
              fullWidth
              label="Precio venta"
              variant="outlined"
            />
            <br />
            <br />
            <TextField
              type="text"
              disabled
              name="pc"
              value={pc}
              onChange={handleChange}
              fullWidth
              label="Precio compra"
              variant="outlined"
            />
            <br />
            <br />
            <TextField
              type="text"
              disabled
              name="stock"
              value={stock}
              onChange={handleChange}
              fullWidth
              label="Stock"
              variant="outlined"
            />
            <br />
            <br />
            <NavLink to={`/products`} className="btn btn-info mx-2">
              Return
            </NavLink>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductScreen;
