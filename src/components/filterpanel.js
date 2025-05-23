// components/filterpanel.js (or .jsx)

import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";

const FilterPanel = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      <TextField
        label="Donor Name"
        variant="outlined"
        name="donor"
        value={filters.donor}
        onChange={handleChange}
      />
      <TextField
        type="date"
        label="Date"
        variant="outlined"
        name="date"
        value={filters.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        select
        label="Cause"
        variant="outlined"
        name="cause"
        value={filters.cause}
        onChange={handleChange}
      >
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Food">Food</MenuItem>
        <MenuItem value="Shelter">Shelter</MenuItem>
        <MenuItem value="Clothing">Clothing</MenuItem>
        <MenuItem value="Education">Education</MenuItem>
        <MenuItem value="Health">Health</MenuItem>
      </TextField>
    </Box>
  );
};

export default FilterPanel;
