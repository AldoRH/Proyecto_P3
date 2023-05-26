import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Container,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { getProducts, deleteProduct } from "../resources/ProductsFirebase";
import useForm from "../hooks/useForm";
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

function SalesScreen() {
    const [products, setProducts] = useState< QueryDocumentSnapshot<DocumentData>[] | [] >([]);


  useEffect(() => {
    getProductsData();
  }, []);

  const getProductsData = async () => {
    const fbProducts = await getProducts();
    setProducts(fbProducts.docs);
  };

  const removeProduct = async (productId: any) => {
    await deleteProduct(productId);
    getProductsData();
  };
  
  const navigate = useNavigate();
  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={1} sm={1} xs={0}></Grid>
          <Grid item md={10} sm={10} xs={12}>
            <Typography variant="h4">Product list</Typography>
            <NavLink to={`/sales/0`} className="btn btn-info mx-2">Add new sale</NavLink>
            <Divider color="black" />
          </Grid>
        </Grid>
        <Grid container marginTop={2}>
          <Grid item md={1} sm={1} xs={0}></Grid>
          <Grid item md={10} sm={10} xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Nombre</TableCell>
                    <TableCell align="right">Precio de venta</TableCell>
                    <TableCell align="right">Precio de compra</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map(
                    (product: QueryDocumentSnapshot<DocumentData>) => {
                      const { name, pv, pc, stock } = product.data();
                      const { id } = product;
                      return (
                        <TableRow
                          key={id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>{id}</TableCell>
                          <TableCell align="right"> {name}</TableCell>
                          <TableCell align="right">{pv}</TableCell>
                          <TableCell align="right">{pc}</TableCell>
                          <TableCell align="right">{stock}</TableCell>
                          <TableCell>
                            <NavLink
                              to={`/products/${id}`}
                              className="btn btn-info mx-2"
                            >
                              Edit
                            </NavLink>

                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                const shouldDelete = window.confirm(
                                  "Are you sure you want to delete this product?"
                                );
                                if (shouldDelete) {
                                  removeProduct(id);
                                }
                              }}
                            >
                              Delete
                            </Button>
                            <NavLink
                              to={`/view-product/${id}`}
                              className="btn btn-info mx-2"
                            >
                              View
                            </NavLink>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
export default SalesScreen;
