import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Service } from "../resources/Service";
import { Alert, Button, Container, Grid, TextField, Typography } from "@mui/material";
import useForm from '../hooks/useForm';
import useFormValidation from '../hooks/useFormValidation';
import { addService, updateService, getServiceById } from "../resources/ServicesFirebase";

const emptyService: Service = {
  id: 0,
  name: '',
  pv: 0,
  cs: 0,
};

function ServiceScreen() {
  const { id } = useParams();

  useEffect(() => {
    getServiceData();
  }, []);

  const [formService, handleChange] = useForm(emptyService);

  const validationRules = {
    name: [
      { rule: (value: any) => value !== '', message: "Name is required" },
    ],
    pv: [
      { rule: (value: any) => parseFloat(value) > 1, message: "PV must be greater than 1" },
    ],
    cs: [
      { rule: (value: any) => parseFloat(value) > 1, message: "CS must be greater than 1" },
    ],
  };

  const { formState, errors, handleChange: handleValidationChange, validateForm } = useFormValidation(formService, validationRules);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getServiceData = async () => {
    const fbService = await getServiceById(id);
    if (fbService) {
      const { name = fbService.name, pv = fbService.pv, cs = fbService.cs } = fbService;
      handleChange({ target: { name: "name", value: name } });
      handleChange({ target: { name: "pv", value: pv } });
      handleChange({ target: { name: "cs", value: cs } });
    }
  }

  const update = async () => {
    const result = await updateService(id, formService);
    return result !== undefined;
  }

  const save = async () => {
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (parseFloat(formState.pv) <= parseFloat(formState.cs)) {
      setError("El precio de venta debe ser mayor que el costo del servicio");
      return;
    }

    let result;
    if (id !== '0') {
      result = await update();
      result ? setSuccess("Updated service") : setError("Service not updated");
    } else {
      result = await addService(formState);
      result ? setSuccess("Service added") : setError("Service not added");
    }
  }

  return (
    <Container>
      <Grid container spacing={2} marginTop={3}>
        <Grid container>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="h4">Add/Edit service</Typography>
          </Grid>
        </Grid>
        <Grid container marginTop={3}>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              type="text"
              required
              name="name"
              value={formState.name}
              onChange={handleValidationChange}
              fullWidth={true}
              label="Nombre"
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
            />
            <br /><br />
            <TextField
              type="number"
              required
              name="pv"
              value={formState.pv}
              onChange={handleValidationChange}
              fullWidth={true}
              label="Precio venta"
              variant="outlined"
              error={!!errors.pv}
              helperText={errors.pv}
            />
            <br /><br />
            <TextField
              type="number"
              required
              name="cs"
              value={formState.cs}
              onChange={handleValidationChange}
              fullWidth={true}
              label="Costo de servicio"
              variant="outlined"
              error={!!errors.cs}
              helperText={errors.cs}
            />
            <br /><br />
            <Button variant="outlined" onClick={save}>Save</Button>
            <NavLink to={`/services`} className="btn btn-info mx-2">Return</NavLink>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ServiceScreen;
