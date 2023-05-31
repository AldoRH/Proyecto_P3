import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
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
import { getProducts, deleteProduct } from "../resources/ProductsFirebase";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const ProductsScreen = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<
    QueryDocumentSnapshot<DocumentData>[] | []
  >([]);

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

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={1} sm={1} xs={0}></Grid>
          <Grid item md={10} sm={10} xs={12}>
            <Typography variant="h4">Products List</Typography>
            <NavLink to={`/products/add`} className="btn btn-info mx-2">
              Add new product
            </NavLink>
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
                    <TableCell align="center">Nombre</TableCell>
                    <TableCell align="center">Precio de venta</TableCell>
                    <TableCell align="center">Precio de compra</TableCell>
                    <TableCell align="center">Stock</TableCell>
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
                          <TableCell align="center">{name}</TableCell>
                          <TableCell align="center">${pv}</TableCell>
                          <TableCell align="center">${pc}</TableCell>
                          <TableCell align="center">{stock}</TableCell>
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                navigate(`/products/${id}`);
                              }}
                            >
                              Edit
                            </Button>
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
                            <Button
                              variant="contained"
                              color="info"
                              startIcon={<VisibilityIcon />}
                              onClick={() => {
                                navigate(`/view-product/${id}`);
                              }}
                            >
                              View
                            </Button>
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
};

export default ProductsScreen;
