import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

export default function OpportunitiesTable() {
  const [rows, setRows] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Read admin param to control blur button visibility and blur default state
  const [isAdmin, setIsAdmin] = useState(false);
  const [assignmentFeeBlurred, setAssignmentFeeBlurred] = useState(true);

  // Filters state
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const [dealTypeFilter, setDealTypeFilter] = useState('');

  useEffect(() => {
    // Parse query params
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get('admin');
    const adminValue = adminParam === 'true';
    setIsAdmin(adminValue);

    // Blur Assignment Fee by default if not admin
    setAssignmentFeeBlurred(!adminValue);

    axios
      //.get('http://localhost:5000/api/opportunities')
      .get('https://ghl-opportunity-dashboard.onrender.com/api/opportunities')
      .then((res) => {
        setRows(res.data.map((row) => ({ ...row, id: row.Id })));
      })
      .catch((err) => {
        console.error('Error fetching opportunities:', err);
      });

    setColumnVisibilityModel({
      LockboxCode: false,
      ShowingTime: false,
      Quality: false,
      MarketingLink: false,
      PicturesLink: false,
      Wholesaler: false,
      Notes: false,
    });
  }, []);

  const columns = [
    { field: 'PropertyAddress', headerName: 'Property Address', width: 250 },
    {
      field: 'PropertyType',
      headerName: 'Property Type',
      width: 150,
      filterable: false,
    },
    {
      field: 'DealType',
      headerName: 'Deal Type',
      width: 120,
      filterable: false,
    },
    { field: 'AskingPrice', headerName: 'Asking Price', width: 150 },
    {
      field: 'AssignmentFee',
      headerName: 'Assignment Fee',
      width: 150,
      renderCell: (params) => (
        <span style={{ filter: assignmentFeeBlurred ? 'blur(5px)' : 'none' }}>
          {params.value}
        </span>
      ),
    },
    { field: 'ContractedPrice', headerName: 'Contracted Price', width: 150 },
    { field: 'CompensationType', headerName: 'Compensation Type', width: 180 },
    {
      field: 'JVShare',
      headerName: 'JV Share',
      width: 120,
      renderCell: (params) => (params.value ? `${params.value}%` : ''),
    },
    {
      field: 'OptionPeriodExpiration',
      headerName: 'Option Period Expiration',
      width: 200,
      renderCell: (params) => (params.value ? new Date(params.value).toISOString().slice(0, 10) : ''),
    },
    {
      field: 'ClosingDate',
      headerName: 'Closing Date',
      width: 150,
      renderCell: (params) => (params.value ? new Date(params.value).toISOString().slice(0, 10) : ''),
    },
    { field: 'Access', headerName: 'Access', width: 150 },

    // Button to open modal for hidden columns
    {
      field: 'details',
      headerName: 'Details',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setModalData(params.row);
              setModalOpen(true);
            }}
          >
            More
          </Button>
        </div>
      ),
    },
  ];

  const hiddenColumns = [
    { label: 'Lockbox Code', field: 'LockboxCode' },
    { label: 'Showing Time', field: 'ShowingTime' },
    { label: 'Quality', field: 'Quality' },
    { label: 'Marketing Link', field: 'MarketingLink', isLink: true },
    { label: 'Pictures Link', field: 'PicturesLink', isLink: true },
    { label: 'Wholesaler', field: 'Wholesaler' },
    { label: 'Notes', field: 'Notes' },
  ];

  // Apply filters
  const filteredRows = rows.filter((row) => {
    return (
      (propertyTypeFilter === '' || row.PropertyType === propertyTypeFilter) &&
      (dealTypeFilter === '' || row.DealType === dealTypeFilter)
    );
  });

  // Get unique filter options
  const uniquePropertyTypes = Array.from(new Set(rows.map((r) => r.PropertyType))).filter(Boolean);
  const uniqueDealTypes = Array.from(new Set(rows.map((r) => r.DealType))).filter(Boolean);

  return (
    <>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Property Type</InputLabel>
          <Select
            value={propertyTypeFilter}
            label="Property Type"
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {uniquePropertyTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Deal Type</InputLabel>
          <Select
            value={dealTypeFilter}
            label="Deal Type"
            onChange={(e) => setDealTypeFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {uniqueDealTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => setAssignmentFeeBlurred((prev) => !prev)}
            sx={{ ml: 'auto' }}
          >
            {assignmentFeeBlurred ? 'Show Assignment Fee' : 'Blur Assignment Fee'}
          </Button>
        )}
      </Box>

      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          components={{ Toolbar: GridToolbar }}
          pageSizeOptions={[5, 10, 20]}
          pagination
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal !important',
              overflow: 'visible !important',
              textOverflow: 'unset !important',
              lineHeight: '1.4rem',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              whiteSpace: 'normal !important',
              overflow: 'visible !important',
              textOverflow: 'unset !important',
              lineHeight: '1.4rem',
            },
          }}
        />
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Opportunity Details</DialogTitle>
        <DialogContent dividers>
          {modalData && (
            <Table>
              <TableBody>
                {hiddenColumns.map(({ label, field, isLink }) => (
                  <TableRow key={field}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                      {label}
                    </TableCell>
                    <TableCell>
                      {isLink && modalData[field] ? (
                        <Link href={modalData[field]} target="_blank" rel="noopener">
                          Click Here
                        </Link>
                      ) : (
                        modalData[field] || '-'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
