import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import FilterPanel from "../components/filterpanel";
import DonationsTable from "../components/donationstable";

const Donations = () => {
  const [filters, setFilters] = useState({
    donor: "",
    date: "",
    cause: ""  // New filter
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Box
      sx={{
        padding: 4,
        pl: { xs: 2, sm: 10 }, // shift content right
        backgroundColor: "#ffffff",
        minHeight: "100vh"
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#000" }}>
        Donations
      </Typography>

      <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

      <Box sx={{ my: 2 }}>
        <Button
          variant="contained"
          sx={{ mr: 2, backgroundColor: "#9AA27D", color: "#fff" }}
        >
          Export CSV
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#9AA27D", color: "#fff" }}
        >
          Export PDF
        </Button>
      </Box>

      <DonationsTable filters={filters} />
    </Box>
  );
};

export default Donations;

