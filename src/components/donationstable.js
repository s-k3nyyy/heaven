import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";

const sampleData = [
  { donor: "John Doe", cause: "Food", date: "2024-04-01", amount: "KES 5,000" },
  { donor: "Jane Smith", cause: "Education", date: "2024-04-10", amount: "KES 2,000" },
  { donor: "Alice Johnson", cause: "Health", date: "2024-04-15", amount: "KES 3,500" },
  { donor: "Bob Williams", cause: "Clothing", date: "2024-04-20", amount: "KES 1,200" }
];

const DonationsTable = ({ filters }) => {
  const filteredData = sampleData.filter((item) => {
    return (
      (filters.donor === "" || (item.donor && item.donor.toLowerCase().includes(filters.donor.toLowerCase()))) &&
      (filters.cause === "" || (item.cause && item.cause.toLowerCase() === filters.cause.toLowerCase())) &&
      (filters.date === "" || item.date === filters.date)
    );
  });

  return (
    <Paper elevation={3} sx={{ backgroundColor: "#fff", color: "#000" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Donor</strong></TableCell>
            <TableCell><strong>Cause</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Amount</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.donor}</TableCell>
              <TableCell>{row.cause}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DonationsTable;