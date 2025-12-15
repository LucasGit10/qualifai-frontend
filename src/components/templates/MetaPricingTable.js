import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, Chip, useTheme, alpha
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const MetaPricingTable = ({ selectedCategory }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const pricingData = t('whatsappPricing.pricingData', { returnObjects: true }) || [];

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="#f0f0f0">
        {t('whatsappPricing.title')}
      </Typography>
      <Typography variant="caption" display="block" color="#b0b0b0" mb={2}>
        {t('whatsappPricing.subtitle')}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 2,
        }}
      >
        <Table size="small" aria-label={t('whatsappPricing.tableAriaLabel')}>
          <TableHead>
            <TableRow sx={{ '& > th': { borderBottom: '1px solid rgba(255, 255, 255, 0.2)' } }}>
              <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold' }}>
                {t('whatsappPricing.categoryHeader')}
              </TableCell>
              <TableCell align="right" sx={{ color: '#f0f0f0', fontWeight: 'bold' }}>
                {t('whatsappPricing.priceHeader')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pricingData.map((row) => (
              <TableRow
                key={row.category}
                sx={{
                  backgroundColor: selectedCategory === row.category ? alpha(theme.palette.primary.main, 0.3) : 'transparent',
                  transition: 'background-color 0.2s',
                  '&:last-child td, &:last-child th': { border: 0 },
                  '& td, & th': { color: '#e0e0e0' }
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body2" component="div" fontWeight="bold">
                    {row.type}
                  </Typography>
                  <Typography variant="caption" component="div" color="#b0b0b0">
                    {row.description}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', verticalAlign: 'top' }}>
                  {row.priceBRL}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Chip
        icon={<InfoIcon />}
        label={t('whatsappPricing.freeTierInfo')}
        variant="outlined"
        size="small"
        sx={{
          mt: 2,
          height: 'auto',
          color: alpha(theme.palette.info.main, 0.9),
          borderColor: alpha(theme.palette.info.main, 0.5),
          backgroundColor: alpha(theme.palette.info.main, 0.1),
          '& .MuiChip-label': { whiteSpace: 'normal', py: 0.5 },
          '& .MuiChip-icon': { color: alpha(theme.palette.info.main, 0.9) }
        }}
      />
    </Box>
  );
};

export default MetaPricingTable;