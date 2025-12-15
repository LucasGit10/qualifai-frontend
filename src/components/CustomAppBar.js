import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Menu, MenuItem, Typography, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';

const CustomAppBar = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [langAnchorEl, setLangAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // ... (resto das suas funções handle... não mudam) ...
    const handleNavigate = (path) => {
        navigate(path);
        setAnchorEl(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenLangMenu = (event) => {
        setLangAnchorEl(event.currentTarget);
    };

    const handleCloseLangMenu = () => {
        setLangAnchorEl(null);
    };

    const handleChangeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        handleCloseLangMenu();
    };


    return (
    <AppBar 
        position="static"
        elevation={0}
        sx={{ background: 'white', borderRadius: '50px', maxWidth: '1200px', mx: 'auto', mt: 2 }}
    >
        <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
            
            <Box 
                onClick={() => handleNavigate('/')} 
                sx={{ 
                    cursor: 'pointer', 
                    height: { xs: '30px', md: '40px' }, 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <img 
                    src="/Logoooo.png" 
                    alt="Logo QualifAI" 
                    style={{ 
                        height: '100%', 
                        width: 'auto',
                    }} 
                />

                <img 
                    src="/meta.png"
                    alt="meta"
                    style={{ 
                        height: '80%', 
                        width: 'auto',
                    }}
                />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
                <Button color="inherit" sx={{ color: 'black', display: { xs: 'none', md: 'inline-flex' } }} onClick={() => handleNavigate('/blog')}>blog</Button>
                <Button color="inherit" sx={{ color: 'black', display: { xs: 'none', md: 'inline-flex' } }} onClick={() => handleNavigate('/register-calendar')}>contato</Button>

                <Tooltip title="Alterar idioma">
                    <IconButton onClick={handleOpenLangMenu} sx={{ color: 'black' }}>
                        <TranslateIcon />
                    </IconButton>
                </Tooltip>

                <Button 
                    variant="contained" 
                    sx={{ 
                        borderRadius: '15px', 
                        bgcolor: 'black', 
                        color: 'white', 
                        px: { xs: 2, md: 4 },
                        py: { xs: 1, md: 1.5 },
                        display: 'inline-flex',
                        '&:hover': { bgcolor: '#333' }
                    }} 
                    onClick={() => handleNavigate('/login')}
                >
                    <Typography sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                       Acessar SDR AI
                    </Typography>
                </Button>
                
                <IconButton
                    onClick={handleClick}
                    sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'black' }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>
        </Toolbar>

        <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleCloseLangMenu}
        >
            <MenuItem onClick={() => handleChangeLanguage('pt')} selected={i18n.language === 'pt'}>Português</MenuItem>
            <MenuItem onClick={() => handleChangeLanguage('en')} selected={i18n.language === 'en'}>English</MenuItem>
        </Menu>

        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={() => handleNavigate('/blog')}>Blog</MenuItem>
            <MenuItem onClick={() => handleNavigate('/register-calendar')}>Contato</MenuItem>
        </Menu>
    </AppBar>
);
};

export default CustomAppBar;