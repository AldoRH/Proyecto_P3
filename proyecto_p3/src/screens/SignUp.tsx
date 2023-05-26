import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth();
  const navigate =useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if(user){
        navigate('/')
      }
      
    } catch (error) {
      console.error('Error al crear el usuario:', error);
    }
  };

  return (
    <div style={{ maxHeight: '100vh', boxShadow: 'initial' }}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" p={2}>
        <Box p={3} bgcolor="white" boxShadow={2} borderRadius={8} maxWidth={600} width="100%">
          <div style={{ textAlign: 'center' }}>
            <h1>Bienvenido!!</h1>
            <h3>Registrate</h3>
            <form onSubmit={handleSignUp}>
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
              <Box width={'100%'} display="flex" justifyContent="center" alignItems="center">
                <div>
                  <Button color="primary" size="large" variant="contained" type="submit">
                    Registrate
                  </Button>
                </div>
              </Box>
            </form>
          </div>
        </Box>
      </Box>
    </div>
  );
};
