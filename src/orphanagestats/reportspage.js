import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Container
} from '@mui/material';

function Reports() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    donorName: '',
    amount: '',
    usage: '',
    usageDate: '',
  });
  const [reports, setReports] = useState([]);

  // Dummy data on first load
  useEffect(() => {
    const dummyReports = [
      {
        name: 'School Supplies',
        date: '2025-04-01',
        donorName: 'Alice Mwangi',
        amount: 5000,
        usage: 'Purchased books and pens',
        usageDate: '2025-04-05'
      },
      {
        name: 'Medical Aid',
        date: '2025-03-20',
        donorName: 'John Otieno',
        amount: 3000,
        usage: 'Bought medicine and bandages',
        usageDate: '2025-03-22'
      }
    ];
    setReports(dummyReports);
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setReports([...reports, formData]);
    setOpen(false);
    setFormData({
      name: '',
      date: '',
      donorName: '',
      amount: '',
      usage: '',
      usageDate: '',
    });
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
          <TextField label="Name" fullWidth margin="normal" name="name" value={formData.name} onChange={handleInputChange} />
          <TextField label="Date" type="date" fullWidth margin="normal" name="date" value={formData.date} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
          <TextField label="Donor's Name" fullWidth margin="normal" name="donorName" value={formData.donorName} onChange={handleInputChange} />
          <TextField label="Amount" type="number" fullWidth margin="normal" name="amount" value={formData.amount} onChange={handleInputChange} />
          <TextField label="How it was used" fullWidth margin="normal" name="usage" value={formData.usage} onChange={handleInputChange} />
          <TextField label="When it was used" type="date" fullWidth margin="normal" name="usageDate" value={formData.usageDate} onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Submit</Button>
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
              <TableRow key={index}>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.donorName}</TableCell>
                <TableCell>{report.amount}</TableCell>
                <TableCell>{report.usage}</TableCell>
                <TableCell>{report.usageDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Reports;




