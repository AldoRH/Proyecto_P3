import React, { useState , useEffect} from "react";
import { NavLink, useParams } from "react-router-dom";
import { Product } from "../resources/Product";
import { Alert, Button, Container, Grid, TextField, Typography } from "@mui/material";
import useForm from '../hooks/useForm';
import { addProduct , updateProduct, getProductById} from "../resources/ProductsFirebase";
import { idText } from "typescript";
import { constants } from "fs/promises";

const emptyProduct : Product = {
  id: 0,
  name: '',
  pv: 0,
  pc: 0,
  stock: 0,
};

function ProductScreen() {

  const { id } = useParams();

  useEffect(() => {
    getProductData();
  },[]);

  const [formProduct, handleChange] = useForm(emptyProduct);

  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');

  const getProductData = async () => {
    const fbProduct = await getProductById(id);
    if (fbProduct) {
      const { name = fbProduct.name, pv = fbProduct.pv, pc = fbProduct.pc, stock = fbProduct.stock } = fbProduct;
      handleChange({ target: { name: "name", value: name } });
      handleChange({ target: { name: "pv", value: pv } });
      handleChange({ target: { name: "pc", value: pc } });
      handleChange({ target: { name: "stock", value: stock } });
    }
  }

  const update = async () => {
    const result = await updateProduct(id, formProduct);
    return result !== undefined;
  }

  const save = async () => {
    
    if (parseFloat(formProduct.pv) <= parseFloat(formProduct.pc)) {
      setError("El precio de venta debe ser mayor que el precio de compra");
      return;
    }

    let result 
    if (id !='0' ) {
      result = await update();
      result ? setSuccess("Updated product") : setError("Product not updated");
    } else {
      result = await addProduct(formProduct);
      result ? setSuccess("Product added") : setError("Product not added");
    }
  }

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            { success && <Alert severity="success">{success}</Alert>}
            { error && <Alert severity="error">{error}</Alert>}
            <Typography variant="h4">
              Add/Edit product
            </Typography>
          </Grid>
        </Grid>
        <Grid container marginTop={3}>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <TextField type="text" required name="name" value={formProduct.name} onChange={handleChange} fullWidth={true} label="Nombre" variant="outlined" />
            <br/><br/>
            <TextField type="number" required name="pv" value={formProduct.pv} onChange={handleChange} fullWidth={true} label="Precio venta" variant="outlined" />
            <br/><br/>
            <TextField type="number" required name="pc" value={formProduct.pc} onChange={handleChange} fullWidth={true} label="Precio compra" variant="outlined" />
            <br/><br/>
            <TextField type="number" required name="stock" value={formProduct.stock} onChange={handleChange} fullWidth={true} label="Stock" variant="outlined" inputProps={{ min: 1 }}/>
            <br/><br/>
            <Button variant="outlined" onClick={save} >Save</Button>
            <NavLink 
                to={`/products`} 
                className="btn btn-info mx-2"
              >Return</NavLink>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductScreen;
