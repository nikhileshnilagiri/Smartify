import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import DefaultProfilePic from '../Assets/image.png'; // Add your default profile picture here

const GuestUserCard = ({ guest }) => {
  return (
    <Card style={{ maxWidth: 300, margin: '1rem', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
      <CardMedia
        component="img"
        height="140"
        image={guest.profilePic || DefaultProfilePic}
        alt="Guest Profile Picture"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {guest.name || 'Guest Name'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {guest.email || 'guest@example.com'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {guest.role || 'Role: Guest'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GuestUserCard;
