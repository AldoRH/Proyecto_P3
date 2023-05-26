import React from "react";
import { Box, Typography } from "@mui/material";

export const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <Typography variant="h1" component="h1" align="center">
        404 Not Found
      </Typography>
    </Box>
  );
};
