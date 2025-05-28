import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Container, CircularProgress
} from '@mui/material';

function Reports() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    donorName: '',  // Changed to camelCase to match schema
    amount: '',
    usage: '',
    usageDate: '',  // Changed to camelCase to match schema
  });
  
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await axios.get('https://ideal-sniffle-1y3k.onrender.com/api/reports/');
      setReports(res.data.reports || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        date: formData.date,
        donorName: formData.donorName,  // Fixed: use camelCase to match schema
        amount: parseFloat(formData.amount),
        usage: formData.usage,
        usageDate: formData.usageDate,  // Fixed: use camelCase to match schema
      };
  
      await axios.post('https://ideal-sniffle-1y3k.onrender.com/api/reports/', payload);
      await fetchReports(); // refresh list
      setOpen(false);
      setFormData({
        name: '',
        date: '',
        donorName: '',  // Fixed: consistent camelCase
        amount: '',
        usage: '',
        usageDate: '',  // Fixed: consistent camelCase
      });
    } catch (err) {
      console.error('Error submitting report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ ml: { sm: '80px' }, pt: 4, pb: 4 }}>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Report
      </Button>

      {/* Modal Form */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Report</DialogTitle>
        <DialogContent>
          <TextField 
            label="Name" 
            fullWidth 
            margin="normal" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField 
            label="Date" 
            type="date" 
            fullWidth 
            margin="normal" 
            name="date" 
            value={formData.date} 
            onChange={handleInputChange} 
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
          <TextField 
            label="Donor's Name" 
            fullWidth 
            margin="normal" 
            name="donorName"  // Fixed: changed from "donor_name" to "donorName"
            value={formData.donorName} 
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField 
            label="Amount" 
            type="number" 
            fullWidth 
            margin="normal" 
            name="amount" 
            value={formData.amount} 
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField 
            label="How it was used" 
            fullWidth 
            margin="normal" 
            name="usage" 
            value={formData.usage} 
            onChange={handleInputChange}
            disabled={loading}
          />
          <TextField 
            label="When it was used" 
            type="date" 
            fullWidth 
            margin="normal" 
            name="usageDate"  // Fixed: changed from "usageDate" to match state
            value={formData.usageDate} 
            onChange={handleInputChange} 
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpen(false)} 
            color="primary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reports Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Date</b></TableCell>
              <TableCell><b>Donor's Name</b></TableCell>
              <TableCell><b>Amount</b></TableCell>
              <TableCell><b>Usage</b></TableCell>
              <TableCell><b>Usage Date</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow key={report.id || index}>  {/* Use report.id if available */}
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.donorName}</TableCell>  {/* Fixed: use camelCase from API response */}
                <TableCell>{report.amount}</TableCell>
                <TableCell>{report.usage}</TableCell>
                <TableCell>{report.usageDate}</TableCell>  {/* Fixed: use camelCase from API response */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Reports;