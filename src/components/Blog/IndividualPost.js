import { Box, Typography, Grid, IconButton, CircularProgress, Alert } from "@mui/material";
import {
    Visibility,
    Share as ShareIcon,
    Twitter as TwitterIcon,
    LinkedIn as LinkedInIcon,
    Instagram as InstagramIcon,
    ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import CustomAppBar from "../CustomAppBar";
import Footer from "../Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from 'react-query';
import api from '../../services/api';

function IndividualPost() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { slug } = useParams();

    const { data: postData, isLoading, isError, error } = useQuery(
        ['blogPost', slug], 
        () => api.get(`/blog/${slug}`).then(res => {
            return res.data;
        }),
        { 
            enabled: !!slug,
            retry: 1
        }
    );
    
    const post = postData;

    if (isLoading) {
        return (
            <>
                <CustomAppBar />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
                <Footer />
            </>
        );
    }

    if (isError) {
        return (
            <>
                <CustomAppBar />
                <Box sx={{ p: 4 }}>
                    <Alert severity="error">
                        {t('individualPost.loadError') || 'Erro ao carregar o post'}: {error?.message}
                    </Alert>
                </Box>
                <Footer />
            </>
        );
    }

    if (!post) {
        return (
            <>
                <CustomAppBar />
                <Box sx={{ p: 4 }}>
                    <Alert severity="warning">
                        {t('individualPost.notFound') || 'Post não encontrado'}
                    </Alert>
                </Box>
                <Footer />
            </>
        );
    }

    const socialIcons = [
        { label: t('individualPost.shareInstagram'), icon: <InstagramIcon /> },
        { label: t('individualPost.shareLinkedIn'), icon: <LinkedInIcon /> },
        { label: t('individualPost.shareTwitter'), icon: <TwitterIcon /> },
        { label: t('individualPost.copyLink'), icon: <ShareIcon /> },
    ];

    const handleNavigate = (path) => {
        navigate(path);
    };

    const formatContent = (content) => {
        if (!content) return '';

        const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');

        return paragraphs.map(paragraph => {
            const cleanedParagraph = paragraph.split('\n')
                .map(line => line.trim())
                .join('<br />');
            return `<p>${cleanedParagraph}</p>`;
        }).join('');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '18/07/2025, 6:01:39 PM'; 
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR') + ', ' + date.toLocaleTimeString('pt-BR');
        } catch {
            return '18/07/2025, 6:01:39 PM';
        }
    };

    return (
        <>
            <CustomAppBar />
            <Box sx={{ bgcolor: '#f5f5f5', paddingBlock: '24px', marginBlock: '24px', minHeight: '100vh' }}>
                <Grid container justifyContent="center" sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 2, md: 0 } }}>
                    <Grid item xs={12} md={8}>
                        <Box>
                        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ color: '#0F0C29', mt: 4, mb: 8, fontSize: { xs: '1.75rem', md: '3.75rem' } }}>
                                {post.title || t('individualPost.defaultTitle')}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'space-between', md: 'space-between' }, alignItems: 'center', maxWidth: '800px', margin: '0 auto', px: 2, my: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                    <img 
                                        src={post.author?.imageUrl || "/image-post.jpg"} 
                                        alt={post.author?.name || t('individualPost.defaultAuthor')} 
                                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
                                    />
                                    <Typography variant="body2" component="p" sx={{ lineHeight: 1.5, color: '#333' }}>
                                        {t('individualPost.by')} <strong>{post.author?.name || t('individualPost.defaultAuthor')}</strong><br />
                                        {formatDate(post.createdAt || post.date)}
                                    </Typography>
                                </Box>
                                <Typography sx={{ display: { xs: 'none', sm: 'flex', md: 'flex' }, alignItems: 'center', gap: 0.5, color: '#565656', fontSize: '0.9rem' }}>
                                    <Visibility sx={{ fontSize: 18, color: '#777' }} />
                                    {t('individualPost.readingTime', { minutes: 4 })}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                                <Box
                                    component="img"
                                    src={post.imageUrl || "/image-blog-2.jpg"}
                                    alt={post.title || t('individualPost.defaultAlt')}
                                    sx={{
                                        width: { xs: '332px', sm: '100%' },
                                        height: { xs: '264px', sm: '400px', md: '500px' },
                                        borderRadius: { xs: '13.32px', sm: '24px', md: '49.47px' },
                                        maxWidth: '1233px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>

                            <Typography 
                                onClick={() => handleNavigate('/blog')} 
                                sx={{ 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: 1, 
                                    color: '#0F0C29', 
                                    fontSize: '1rem', 
                                    cursor: 'pointer', 
                                    my: 4, 
                                    px: 2, 
                                    '&:hover': { textDecoration: 'underline' } 
                                }}
                            >
                                <ArrowBackIcon />
                                {t('individualPost.backToBlog')}
                            </Typography>

                            <Grid container spacing={4} sx={{ px: 2, paddingBottom: 8 }}>
                                <Grid item lg={3} sx={{ display: { xs: 'none', lg: 'block' }, borderRight: '1px solid #5D1D8B', paddingRight: 6, paddingLeft: 2 }}>
                                    <Box sx={{ mb: 8, pr: 2 }}>
                                        <Typography variant="h6" component="p" sx={{ color: '#5D1D8B', fontWeight: 600, wordBreak: 'break-word' }}>
                                            <strong>{post.category || t('individualPost.defaultCategory')}</strong>
                                        </Typography>
                                        <Typography variant="body1" component="p" sx={{ color: '#565656', mt: 2, wordBreak: 'break-word' }}>
                                            {post.category || t('individualPost.defaultCategory')}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        {socialIcons.map((item, index) => (
                                            <IconButton 
                                                key={index} 
                                                sx={{ 
                                                    backgroundColor: '#D9D9D9', 
                                                    color: '#565656', 
                                                    '&:hover': { backgroundColor: '#c0c0c0' } 
                                                }} 
                                                aria-label={item.label}
                                            >
                                                {item.icon}
                                            </IconButton>
                                        ))}
                                    </Box>
                                </Grid>

                                <Grid item xs={12} lg={9}>
                                    <Typography 
                                        variant="body1" 
                                        component="div"
                                        sx={{
                                            lineHeight: 1.8,
                                            fontSize: '1.1rem',
                                            color: '#333',
                                            px: { xs: 0, md: 2 },
                                            marginBottom: 8,
                                            textAlign: 'left', 
                                            '& p': {
                                                marginBottom: '1.5rem'
                                            },
                                            '& p:first-of-type': {
                                                marginTop: 0
                                            },
                                            '& p:last-of-type': {
                                                marginBottom: 0
                                            }
                                        }}
                                    >
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: post.content
                                                    ? formatContent(post.content)
                                                    : formatContent(t('individualPost.defaultContent'))
                                            }}
                                        />
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </>
    );
}

export default IndividualPost;