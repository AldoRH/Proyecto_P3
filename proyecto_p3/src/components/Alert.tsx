import React from "react";
import { Stack } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";

export const AlertsError: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Stack>
  );
};

export const AlertInformation: React.FC<{ title: string; message: string }> = ({
  title,
  message,
}) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="warning">
        <AlertTitle>{title}</AlertTitle>

        {message}
      </Alert>
    </Stack>
  );
};
