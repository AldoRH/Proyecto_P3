import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Service } from "../resources/Service";
import { Container, Grid, TextField, Typography } from "@mui/material";
import useForm from "../hooks/useForm";
import { getServiceById } from "../resources/ServicesFirebase";

const ServiceScreen = () => {
  const { id } = useParams();

  useEffect(() => {
    getServiceData();
  }, []);

  const emptyService: Service = {
    name: "",
    pv: 0,
    cs: 0,
  };

  const [formService, handleChange] = useForm(emptyService);

  const { name, pv, cs } = formService;

  const getServiceData = async () => {
    const fbService = await getServiceById(id);

    if (fbService) {
      const { name, pv, cs } = fbService;

      handleChange({ target: { name: "name", value: name } });
      handleChange({ target: { name: "pv", value: pv } });
      handleChange({ target: { name: "cs", value: cs } });
    }
  };

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <Typography variant="h4">Service</Typography>
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
              name="cs"
              value={cs}
              onChange={handleChange}
              fullWidth
              label="Costo de servicio"
              variant="outlined"
            />
            <br />
            <br />
            <NavLink to={`/services`} className="btn btn-info mx-2">
              Return
            </NavLink>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ServiceScreen;
