import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent, Box, LinearProgress } from '@mui/material';

const orphanages = [
    { id: 1, name: 'Hope Orphanage', location: 'Nairobi', image: '/hopeorp.jpeg', progress: 60 },
    { id: 2, name: 'Bright Future Home', location: 'Mombasa', image: '/brightorp.jpeg', progress: 30 },
    { id: 3, name: 'Smile Children’s Home', location: 'Kisumu', image: '/smileorp.jpg', progress: 80 },
    { id: 4, name: 'New Dawn Orphanage', location: 'Eldoret', image: '/newdawn.jpg', progress: 45 },
    { id: 5, name: 'Little Stars Home', location: 'Nakuru', image: '/littlestars.jpg', progress: 70 },
    { id: 6, name: 'Peace Haven Center', location: 'Thika', image: '/peacehaven.jpg', progress: 55 }
];

const OrphanageProfile = () => {
    const { id } = useParams();
    const orphanage = orphanages.find(o => o.id === parseInt(id));

    if (!orphanage) return <Typography>Orphanage not found.</Typography>;

    return (
        <Container sx={{ mt: 4 }}>
            <Card sx={{ backgroundColor: '#DEA385', borderRadius: 2 }}>
                <CardMedia component="img" height="300" image={orphanage.image} alt={orphanage.name} />
                <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{orphanage.name}</Typography>
                    <Typography variant="subtitle1">{orphanage.location}</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1">Donation Progress: {orphanage.progress}%</Typography>
                        <LinearProgress variant="determinate" value={orphanage.progress} />
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default OrphanageProfile;
