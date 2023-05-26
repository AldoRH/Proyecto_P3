import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AlertsError } from "../components/Alert";

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [getError, SetError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const authError = error;
      console.log(authError.message);
      if (authError.message === "Firebase: Error (auth/user-not-found).") {
        SetError("user");
      } else {
        SetError("password");
      }
    }
  };

  return (
    <div style={{ maxHeight: "100vh", boxShadow: "initial" }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        p={2}
      >
        <Box
          p={3}
          bgcolor="white"
          boxShadow={2}
          borderRadius={8}
          maxWidth={600}
          width="100%"
        >
          {getError === null ? (
            <></>
          ) : getError === "user" ? (
            <AlertsError
              title="Usuario no encontrado"
              message="El usuario no ha sido encontrado en la base de datos"
            />
          ) : (
            <AlertsError
              title="Contraseña incorrecta"
              message="Por favor inserte la contraseña"
            />
          )}
          <div style={{ textAlign: "center" }}>
            <h1>Bienvenido!!</h1>
            <h3>Iniciar sesión</h3>
            <form onSubmit={handleLogin}>
              <Box paddingBottom={3}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>

              <Box paddingBottom={3}>
                <TextField
                  label="Contraseña"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>
              <Box
                width={"100%"}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <div>
                  <Button
                    color="primary"
                    size="large"
                    variant="contained"
                    type="submit"
                  >
                    Iniciar sesión
                  </Button>
                  <p style={{ color: "#6F7B8C", paddingTop: "30px" }}>
                    No te has registrado?{" "}
                    <Link
                      to={"/signup"}
                      style={{ font: "caption", color: "#3B54AD" }}
                    >
                      Crea una cuenta
                    </Link>
                  </p>
                </div>
              </Box>
            </form>
          </div>
        </Box>
      </Box>
    </div>
  );
};
