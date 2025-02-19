import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Example BulkUpload component with:
 * 1. Header (Bulk Upload + Export button)
 * 2. Drag-and-drop OR click-to-upload CSV files
 * 3. Search bar
 * 4. Table with "No Records Found"
 */
export default function Testing() {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle dropped files
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Process files (replace this with your actual logic)
  const handleFiles = (files) => {
    console.log('Files uploaded:', files);
    // You can parse CSV, upload to server, etc.
  };

  // Programmatically trigger file input
  const onSelectFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection via the hidden input
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        fontFamily: 'Inter, sans-serif', // or your preferred font
        backgroundColor: '#FFFFFF'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Bulk Upload
        </Typography>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{
            textTransform: 'none',
            borderColor: '#D9D9D9',
            color: '#333',
            '&:hover': {
              borderColor: '#333'
            }
          }}
        >
          Export
        </Button>
      </Box>

      <Box
        // Drag events
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        // Clicking the box triggers file selection
        onClick={onSelectFileClick}
        sx={{
          border: '2px dashed #D9D9D9',
          borderRadius: '8px',
          p: 4,
          textAlign: 'center',
          mb: 4,
          cursor: 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s ease-in-out',
          ...(dragActive && {
            backgroundColor: '#f5f5f5'
          })
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          accept=".csv"
          style={{ display: 'none' }}
        />

        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
          Click to upload or drag and drop
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Maximum file size 1MB, Only CSV format
        </Typography>
      </Box>

      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 600 }}>
        All Listings
      </Typography>

      <Box sx={{ mb: 2, maxWidth: 400 }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Search for files..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#999' }} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderColor: '#D9D9D9' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#F8F8F8' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>File Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date Uploaded</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Uploaded By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="center">
                No Records Found
              </TableCell>
            </TableRow>

            {/* Example of mapping over data:
            {filesData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.fileName}</TableCell>
                <TableCell>{row.dateUploaded}</TableCell>
                <TableCell>{row.uploadedBy}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}