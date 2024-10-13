import React, { useState } from 'react'
import Button from '@mui/material/Button';
import './Login.css';
import { Card, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Inicializar useNavigate

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    navigate('/inicio');
  }


  return (
    <section id='login'>
      <div>
        <Card variant="outlined" className='login-card'>
          <div className='login-title'>
            <Typography gutterBottom variant="h3" component="div" >
              Bienvenido!
            </Typography>
          </div>
          <div className="m-4">
            <TextField fullWidth label="Email" id="fullWidth" />
          </div>
          <div className='m-4'>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </div>
          <div className='m-4' >
            <Button fullWidth variant="contained" size="large" onClick={handleClick}>Ingresar</Button>
          </div>
        </Card>
      </div >
    </section>
  )
}

export default Login
