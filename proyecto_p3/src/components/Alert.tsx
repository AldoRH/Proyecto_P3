import React, { FC } from "react";
import { Stack } from "@mui/material";
import { Alert, AlertTitle } from "@mui/material";
import { AlertProps } from "../resources/AlertProps";

export const AlertsError: FC<AlertProps> = ({ title, message }) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Stack>
  );
};

export const AlertInformation: FC<AlertProps> = ({ title, message }) => {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert severity="warning">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Stack>
  );
};
