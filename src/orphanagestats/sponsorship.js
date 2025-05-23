import React from "react";
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
} from "@mui/material";

const drawerWidth = 240;

const sponsorships = [
  {
    childName: "Amina Njeri",
    sponsorName: "John Doe",
    monthlyAmount: "KSh 5,000",
    duration: "Jan 2024 - Dec 2024",
    status: "Active"
  },
  {
    childName: "Kevin Otieno",
    sponsorName: "Jane Smith",
    monthlyAmount: "KSh 4,000",
    duration: "Mar 2024 - Mar 2025",
    status: "Pending"
  },
  {
    childName: "Winnie Achieng",
    sponsorName: "Brian Kimani",
    monthlyAmount: "KSh 6,000",
    duration: "Feb 2024 - Jan 2025",
    status: "Completed"
  }
];

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

const SponsorshipsPage = () => {
  return (
    <Box sx={{ marginLeft: `${drawerWidth}px`, padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sponsorships
      </Typography>

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
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Monthly Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sponsorships.map((entry, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontSize: "0.95rem" }}>{entry.childName}</TableCell>
                <TableCell sx={{ fontSize: "0.95rem" }}>{entry.sponsorName}</TableCell>
                <TableCell sx={{ fontSize: "0.95rem" }}>{entry.monthlyAmount}</TableCell>
                <TableCell sx={{ fontSize: "0.95rem" }}>{entry.duration}</TableCell>
                <TableCell>
                  <Chip
                    label={entry.status}
                    color={getStatusChipColor(entry.status)}
                    size="small"
                    sx={{ fontSize: "0.8rem" }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SponsorshipsPage;


