import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getSales, deleteSale } from "../resources/SalesFirebase";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

const SalesScreen = () => {
  const navigate = useNavigate();

  const [sales, setSales] = useState<
    QueryDocumentSnapshot<DocumentData>[] | []
  >([]);

  useEffect(() => {
    getSalesData();
  }, []);

  const getSalesData = async () => {
    try {
      const sales = await getSales();
      setSales(sales || []);
    } catch (error) {
      console.log(error);
    }
  };

  const removeSale = async (productId: any) => {
    await deleteSale(productId);
    getSalesData();
  };

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={1} sm={1} xs={0}></Grid>
          <Grid item md={10} sm={10} xs={12}>
            <Typography variant="h4">Sales List</Typography>
            <NavLink to={`/sales/0`} className="btn btn-info mx-2">
              Add new sale
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
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Products/Services</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">Sale Date</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sales.map((sale: QueryDocumentSnapshot<DocumentData>) => {
                    const { total, createdAt, products, services } =
                      sale.data();
                    const { id } = sale;

                    let productDetails = "";
                    if (products && products.length > 0) {
                      productDetails = products
                        .map(
                          (product: any) =>
                            `${product.name} (${product.quantity} x $${product.price})`
                        )
                        .join(", ");
                    }

                    let serviceDetails = "";
                    if (services && services.length > 0) {
                      serviceDetails = services
                        .map(
                          (service: any) =>
                            `${service.name} (${service.quantity} x $${service.price})`
                        )
                        .join(", ");
                    }

                    const combinedDetails =
                      productDetails && serviceDetails
                        ? `${productDetails} & ${serviceDetails}`
                        : productDetails || serviceDetails;

                    return (
                      <TableRow
                        key={id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{id}</TableCell>
                        <TableCell align="center">{combinedDetails}</TableCell>
                        <TableCell align="center">${total}</TableCell>
                        <TableCell align="center">
                          {format(
                            new Date(createdAt),
                            "d 'de' MMMM 'de' yyyy, HH:mm",
                            { locale: es }
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="info"
                            startIcon={<VisibilityIcon />}
                            onClick={() => {
                              navigate(`/view-sale/${id}`);
                            }}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => {
                              const shouldDelete = window.confirm(
                                "Are you sure you want to delete this sale?"
                              );
                              if (shouldDelete) {
                                removeSale(id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SalesScreen;
