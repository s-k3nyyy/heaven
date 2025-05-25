import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";

const drawerWidth = 240;

const getStatusChipColor = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Pending":
      return "warning";
    case "Completed":
      return "default";
    default:
      return "default";
  }
};

const formatAmount = (amount, duration) => {
  if (duration === 'One-time') {
    return `$${amount} (One-time)`;
  }
  return `$${amount}/${duration.toLowerCase()}`;
};

const formatDuration = (startDate, endDate, duration) => {
  const start = new Date(startDate).toLocaleDateString();
  const end = new Date(endDate).toLocaleDateString();
  
  if (duration === 'One-time') {
    return start;
  }
  
  return `${start} - ${end}`;
};

const SponsorshipsPage = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSponsorships = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sponsorships');
      
      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned HTML instead of JSON. Check if API routes are properly configured.');
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch sponsorships`);
      }
      
      const data = await response.json();
      setSponsorships(data);
      setError("");
    } catch (err) {
      console.error('Error fetching sponsorships:', err);
      if (err.message.includes('HTML')) {
        setError("API routes not configured. Please ensure your server has the sponsorships routes set up.");
      } else {
        setError(`Failed to load sponsorships: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const handleRefresh = () => {
    fetchSponsorships();
  };

  return (
    <Box sx={{ marginLeft: `${drawerWidth}px`, padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Sponsorships
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ mt: 4, borderRadius: 2 }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#C4B1CF" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Child</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Sponsor</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Duration</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sponsorships.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No sponsorships found. Submit a sponsorship form to see data here.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sponsorships.map((entry, index) => (
                  <TableRow key={entry.sponsorship_id || index}>
                    <TableCell sx={{ fontSize: "0.95rem" }}>
                      {entry.child_name || 'Unknown Child'}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.95rem" }}>
                      {entry.sponsor_name || 'Unknown Sponsor'}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.95rem" }}>
                      {formatAmount(entry.amount, entry.duration)}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.95rem" }}>
                      {entry.sponsorship_type || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.95rem" }}>
                      {formatDuration(entry.start_date, entry.end_date, entry.duration)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entry.status}
                        color={getStatusChipColor(entry.status)}
                        size="small"
                        sx={{ fontSize: "0.8rem" }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SponsorshipsPage;