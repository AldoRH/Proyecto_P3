import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import useFormValidation from "../hooks/useFormValidation";
import {
  addProduct,
  updateProduct,
  getProductById,
} from "../resources/ProductsFirebase";
import { Product } from "../resources/Product";

const ProductScreen = () => {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getProductData();
    }
  }, []);

  const emptyProduct: Product = {
    name: "",
    pv: 0,
    pc: 0,
    stock: 0,
  };

  const validationRules = {
    name: [{ rule: (value: any) => value !== "", message: "Name is required" }],
    pv: [
      {
        rule: (value: any) => parseFloat(value) >= 1,
        message: "Sale price must be greater than 0",
      },
    ],
    pc: [
      {
        rule: (value: any) => parseFloat(value) >= 1,
        message: "Purchase price must be greater than 0",
      },
    ],
    stock: [
      {
        rule: (value: any) => parseFloat(value) >= 1,
        message: "Stock must be greater than 0",
      },
    ],
  };

  const {
    formState,
    errors,
    handleChange: handleValidationChange,
    validateForm,
    updateFieldValue,
  } = useFormValidation(emptyProduct, validationRules);

  const { name, pv, pc, stock } = formState;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getProductData = async () => {
    const fbProduct = await getProductById(id);

    if (fbProduct) {
      const { name, pv, pc, stock } = fbProduct;

      updateFieldValue("name", name);
      updateFieldValue("pv", pv);
      updateFieldValue("pc", pc);
      updateFieldValue("stock", stock);
    }
  };

  const update = async () => {
    const result = await updateProduct(id, formState);
    return result !== undefined;
  };

  const save = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (parseFloat(pv) <= parseFloat(pc)) {
      setError("El precio de venta debe ser mayor que el precio de compra");
      return;
    }

    let result;
    if (id) {
      result = await update();
      result ? setSuccess("Updated product") : setError("Product not updated");
    } else {
      result = await addProduct(formState);
      result ? setSuccess("Product added") : setError("Product not added");
    }
  };

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="h4">Add/Edit Product</Typography>
          </Grid>
        </Grid>
        <Grid container marginTop={3}>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              type="text"
              required
              name="name"
              value={name}
              onChange={handleValidationChange}
              fullWidth
              label="Nombre"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
            />
            <br />
            <br />
            <TextField
              type="number"
              required
              name="pv"
              value={pv}
              onChange={handleValidationChange}
              fullWidth
              label="Precio venta"
              variant="outlined"
              error={!!errors.pv}
              helperText={errors.pv}
            />
            <br />
            <br />
            <TextField
              type="number"
              required
              name="pc"
              value={pc}
              onChange={handleValidationChange}
              fullWidth
              label="Precio compra"
              variant="outlined"
              error={!!errors.pc}
              helperText={errors.pc}
            />
            <br />
            <br />
            <TextField
              type="number"
              required
              name="stock"
              value={stock}
              onChange={handleValidationChange}
              fullWidth
              label="Stock"
              variant="outlined"
              inputProps={{ min: 1 }}
              error={!!errors.stock}
              helperText={errors.stock}
            />
            <br />
            <br />
            <Button variant="outlined" onClick={save}>
              Save
            </Button>
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
