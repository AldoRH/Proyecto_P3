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
import { getServices, deleteService } from "../resources/ServicesFirebase";
import useForm from "../hooks/useForm";
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

function ServicesScreen() {
  const [services, setServices] = useState<
    QueryDocumentSnapshot<DocumentData>[] | []
  >([]);

  useEffect(() => {
    getServicesData();
  }, []);

  const getServicesData = async () => {
    const fbServices = await getServices();
    setServices(fbServices.docs);
  };

  const removeService = async (serviceId: any) => {
    await deleteService(serviceId);
    getServicesData();
  };
  const navigate = useNavigate();
  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={1} sm={1} xs={0}></Grid>
          <Grid item md={10} sm={10} xs={12}>
            <Typography variant="h4">Service list</Typography>
            <NavLink to={`/services/0`} className="btn btn-info mx-2">Add new service</NavLink>
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
                    <TableCell align="right">Costo del servicio</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map(
                    (service: QueryDocumentSnapshot<DocumentData>) => {
                      const { name, pv, cs } = service.data();
                      const { id } = service;
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
                          <TableCell align="right">{cs}</TableCell>
                          <TableCell>
                            <NavLink
                              to={`/services/${id}`}
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
                                  "Are you sure you want to delete this service?"
                                );
                                if (shouldDelete) {
                                  removeService(id);
                                }
                              }}
                            >
                              Delete
                            </Button>
                            <NavLink
                              to={`/view-service/${id}`}
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
export default ServicesScreen;
