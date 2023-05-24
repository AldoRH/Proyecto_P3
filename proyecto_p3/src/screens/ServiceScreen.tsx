import React, { useState , useEffect} from "react";
import { NavLink, useParams } from "react-router-dom";
import { Service } from "../resources/Service";
import { Alert, Button, Container, Grid, TextField, Typography } from "@mui/material";
import useForm from '../hooks/useForm';
import { addService , updateService, getServiceById} from "../resources/ServicesFirebase";
import { idText } from "typescript";
import { constants } from "fs/promises";

const emptyService : Service = {
  id: 0,
  name: '',
  pv: 0,
  cs: 0,
};

function ServiceScreen() {

  const { id } = useParams();

  useEffect(() => {
    getServiceData();
  },[]);

  const [formService, handleChange] = useForm(emptyService);

  const [ error, setError ] = useState('');
  const [ success, setSuccess ] = useState('');

  const getServiceData = async () => {
    const fbService = await getServiceById(id);
    if (fbService) {
      const { name = fbService.name, pv = fbService.pv, cs = fbService.cs} = fbService;
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

    if (formService.pv <= formService.cs) {
      setError("El precio de venta debe ser mayor que el costo del servicio");
      return;
    }

    let result 
    if (id !='0' ) {
      result = await update();
      result ? setSuccess("Updated service") : setError("Service not updated");
    } else {
      result = await addService(formService);
      result ? setSuccess("Service added") : setError("Service not added");
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
              Add/Edit service
            </Typography>
          </Grid>
        </Grid>
        <Grid container marginTop={3}>
          <Grid item md={4} sm={3} xs={0}></Grid>
          <Grid item md={4} sm={6} xs={12}>
            <TextField type="text" name="name" value={formService.name} onChange={handleChange} fullWidth={true} label="Nombre" variant="outlined" />
            <br/><br/>
            <TextField type="number" name="pv" value={formService.pv} onChange={handleChange} fullWidth={true} label="Precio venta" variant="outlined" />
            <br/><br/>
            <TextField type="number" name="cs" value={formService.cs} onChange={handleChange} fullWidth={true} label="Costo de servicio" variant="outlined" />
            <br/><br/>
            <Button variant="outlined" onClick={save} >Save</Button>
            <NavLink 
                to={`/services`} 
                className="btn btn-info mx-2"
              >Return</NavLink>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ServiceScreen;
