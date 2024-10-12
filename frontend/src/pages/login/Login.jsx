import React from 'react'
import Button from '@mui/material/Button';
import './Login.css';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';

function Login() {
  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" >
            Bienvenido!
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </div>
  )
}

export default Login
