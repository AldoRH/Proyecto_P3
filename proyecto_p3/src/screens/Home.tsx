import React from "react";
import { Box, Typography, Button } from "@mui/material";

function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <Typography variant="h1" component="h1" align="center">
        ¡Bienvenido(a)!
      </Typography>
    </Box>
  );
}

export default Home;
