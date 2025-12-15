import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Container, Grid, Typography, 
  InputAdornment, Chip, Button, useMediaQuery, useTheme, CircularProgress 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarIcon from '@mui/icons-material/Star';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy'; 
import SortIcon from '@mui/icons-material/Sort';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { 
  PageWrapper, BackgroundOrb, 
  SearchTextField, CategoryButtonStyled, AnimatedGridItem,
  gradientText
} from 'components/Vitrine/style';

import SolutionCard from 'components/Vitrine/SolutionCard';
import SidebarFilters from 'components/Vitrine/SidebarFilters';
import SolutionDetailsModal from 'components/Vitrine/SolutionDetailsModal.js';
import VitrineAppBar from 'components/Vitrine/VitrineAppBar'; 

import useVitrineFilter, { categories } from 'hooks/useVitrineFilter';

export default function VitrineB2B() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  const [selectedSolution, setSelectedSolution] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    searchTerm, setSearchTerm,
    activeCategory, setActiveCategory,
    filteredData,
    selectedModels, handleToggleModel, clearFilters
  } = useVitrineFilter();
  
  useEffect(() => {
    setVisibleCount(12);
  }, [searchTerm, activeCategory, selectedModels]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoadingMore && visibleCount < filteredData.length) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) => prev + 8);
        setIsLoadingMore(false);
      }, 800);
    }
  }, [isLoadingMore, visibleCount, filteredData.length]);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerTarget.current) observer.observe(observerTarget.current);
    
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    }
  }, [handleObserver]);

  const handleOpenDetails = (solution) => {
    setSelectedSolution(solution);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedSolution(null), 300);
  };

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Vendas': return <BusinessIcon />;
      case 'Marketing': return <StarIcon />;
      case 'Finanças': return <BusinessIcon />;
      case 'RH': return <CheckCircleIcon />;
      case 'TI': return <SmartToyIcon />;
      default: return <FilterListIcon />;
    }
  };

  const currentData = filteredData.slice(0, visibleCount);

  return (
    <PageWrapper>
      <BackgroundOrb top="-15%" left="-10%" size="800px" color="#4c1d95" delay="0s" />
      <BackgroundOrb bottom="5%" right="-5%" size="600px" color="#db2777" delay="-5s" />
      <BackgroundOrb top="30%" left="50%" size="400px" color="#2563eb" delay="-2s" sx={{ opacity: 0.15 }} />

      <VitrineAppBar />

      <Container 
        maxWidth={false}
        sx={{ 
          position: 'relative', 
          zIndex: 2, 
          px: { xs: 2, md: 4, lg: 6 }, 
          pt: { xs: 12, md: 16 } 
        }}
      >
        
        <Box textAlign="center" mb={10} sx={{ animation: 'fadeIn 0.8s ease-out' }}>
          <Typography variant={isMobile ? "h4" : "h2"} fontWeight="900" gutterBottom sx={{ 
            background: 'linear-gradient(to right, #fff 20%, #c084fc 40%, #e879f9 60%, #fff 80%)',
            backgroundSize: '200% auto',
            animation: `${gradientText} 5s linear infinite`, 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2, letterSpacing: '-0.02em', lineHeight: 1.1
          }}>
            Conecte-se aos melhores<br />fornecedores do mercado
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.6)', mb: 6, maxWidth: '650px', mx: 'auto', lineHeight: 1.6, fontWeight: 300 }}>
            Encontre soluções validadas, compare opções e feche negócios com parceiros que impulsionam o seu crescimento.
          </Typography>

          <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
            <SearchTextField
              fullWidth
              placeholder="O que sua empresa precisa hoje? (Ex: CRM, ERP, Marketing...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 24 }} />
                  </InputAdornment>
                ),
                style: { padding: '16px' }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="subtitle2" color="rgba(255,255,255,0.4)" fontWeight="bold" textTransform="uppercase" mb={2} ml={1}>
            Explorar por Categoria
          </Typography>
          <Box sx={{ 
            display: 'flex', gap: 2, overflowX: 'auto', 
            p: 2, mx: -2, '::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none'
          }}>
            {categories.map((cat, index) => (
              <CategoryButtonStyled 
                key={cat} 
                active={activeCategory === cat ? 1 : 0}
                onClick={() => setActiveCategory(cat)}
                style={{ animationDelay: `${index * 0.05}s`, animation: 'fadeIn 0.5s ease-out forwards' }}
              >
                {getCategoryIcon(cat)}
                <Typography variant="caption" fontWeight="600" fontSize="0.75rem">{cat}</Typography>
              </CategoryButtonStyled>
            ))}
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={2}>
            <SidebarFilters 
              selectedModels={selectedModels}
              onToggleModel={handleToggleModel}
              onClear={clearFilters}
            />
          </Grid>

          <Grid item xs={12} lg={10}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={3}>
              <Box>
                <Typography color="white" variant="h5" fontWeight="bold">
                  Oportunidades
                </Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.5)">
                  Exibindo {Math.min(visibleCount, filteredData.length)} de {filteredData.length} parceiros
                </Typography>
              </Box>
              <Button 
                endIcon={<SortIcon />} 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.1)',
                  bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '12px',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' } 
                }} 
                variant="outlined" size="small"
              >
                Ordenar
              </Button>
            </Box>

            <Grid container spacing={3}>
              {currentData.map((item, index) => (
                <AnimatedGridItem item xs={12} md={6} lg={3} key={item.id} index={index}>
                  <SolutionCard 
                    item={item} 
                    onViewDetails={handleOpenDetails}
                  />
                </AnimatedGridItem>
              ))}
            </Grid>

            <Box 
              ref={observerTarget} 
              sx={{ 
                width: '100%', 
                height: '80px', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mt: 4,
                opacity: (visibleCount >= filteredData.length) ? 0 : 1
              }}
            >
              {isLoadingMore && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                   <CircularProgress size={30} sx={{ color: '#c084fc' }} />
                   <Typography variant="caption" color="rgba(255,255,255,0.5)">Carregando mais...</Typography>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <SolutionDetailsModal 
        open={isDetailsOpen} 
        onClose={handleCloseDetails} 
        solution={selectedSolution} 
      />

    </PageWrapper>
  );
}