import { Button, Card, Box, Grid, Typography, Link, CircularProgress, Alert } from "@mui/material";
import CustomAppBar from "../CustomAppBar";
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import Footer from "../Footer";
import { useQuery } from 'react-query';
import api from '../../services/api';
import { useTranslation } from "react-i18next";

export const Blog = () => {
    const { t } = useTranslation();

    const { data: blogData, isLoading, isError, error } = useQuery(
        'blogPosts', 
        () => api.get('/blog/').then(res => {
            return res.data;
        }),
        { 
            retry: 1,
            onError: (error) => {
                console.error(error);
            }
        }
    );

    const posts = blogData?.posts || [];
    const sortedPosts = [...posts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    const featuredPost = sortedPosts.length > 0 ? sortedPosts[0] : null;
    const allPostsForGrid = sortedPosts;

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <CustomAppBar />
            <Box sx={{ bgcolor: 'white', pb: { xs: 8, md: 12 } }}>
                {isError && (
                    <Alert severity="error" sx={{ m: 4 }}>
                        {t('blog.loadError')} {error?.message}
                    </Alert>
                )}

                {featuredPost && (
                    <Box sx={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'end',
                        alignItems: 'center',
                        my: { xs: 2, md: 4 },
                        mx: { xs: 2, lg: '15%' },
                        py: { xs: 2, md: 5 },
                        minHeight: { xs: 'auto', md: '600px' }
                    }}>
                        <Card
                            sx={{
                                order: { xs: 2, md: 1 },
                                position: { xs: 'relative', md: 'absolute' },
                                top: { md: '50%' },
                                left: { xs: 'auto', md: '50%' },
                                transform: { xs: 'none', md: 'translate(-100%, -50%)' },
                                mt: { xs: -15, md: 0 },
                                zIndex: 2,
                                width: { xs: '100%', md: 630 },
                                height: 'auto',
                                borderRadius: '31.21px',
                                opacity: 1,
                                p: { xs: 3, md: '50px' },
                                color: 'text.primary',
                                background: 'linear-gradient(180.05deg, rgba(246, 244, 255, 0.3) 0.04%, rgba(233, 193, 255, 0.3) 26.94%, rgba(115, 86, 252, 0.3) 74.5%, rgba(72, 40, 125, 0.3) 99.96%)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: '1px solid rgba(255, 255, 255, 0.18)'
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <Button variant="contained" sx={{
                                    borderRadius: '5px',
                                    width: 'fit-content',
                                    letterSpacing: '0.5px',
                                    backgroundColor: '#D76D77',
                                    '&:hover': { backgroundColor: '#c2555f' },
                                    py: { xs: 0.2, md: 0.5 },
                                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                                }}>
                                    {t('blog.featured')}
                                </Button>
                                <Button variant="outlined" sx={{
                                    borderColor: 'primary.main',
                                    color: 'primary.main',
                                    backgroundColor: 'transparent',
                                    fontWeight: 500,
                                    borderWidth: 2,
                                    borderStyle: 'solid',
                                    borderRadius: '5px',
                                    width: 'fit-content',
                                    letterSpacing: '0.5px',
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                        color: 'primary.contrastText',
                                        borderColor: 'primary.main',
                                        borderWidth: 2,
                                    },
                                    py: { xs: 0.2, md: 0.5 },
                                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                                }}>
                                    {featuredPost.category || t('blog.category')}
                                </Button>
                            </Box>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, lineHeight: '137%', color: 'black', my: 2, fontSize: { xs: '18px', md: '2.125rem' } }}>
                                {featuredPost.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'black', my: 2, fontWeight: 500, fontSize: { xs: '14px', md: '1rem' } }}>
                                {featuredPost.excerpt || featuredPost.content?.substring(0, 150) + '...' || t('blog.noExcerpt')}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mt: 3 }}>
                                <Link href={`/blog/${featuredPost.slug}`} underline="none" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, fontWeight: 500, color: 'black', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                                    {t('blog.readMore')}
                                    <ArrowForwardIcon fontSize="small" />
                                </Link>
                            </Box>
                        </Card>
                        <Box
                            component="img"
                            src={featuredPost.imageUrl || "/image-blog-2.jpg"}
                            alt={featuredPost.title}
                            sx={{
                                order: { xs: 1, md: 2 },
                                width: "100%",
                                height: { xs: '400px', md: 'auto' },
                                zIndex: 1,
                                objectFit: "cover",
                                maxWidth: 920,
                                borderRadius: '20px',
                                opacity: 1,
                                mt: { xs: 4, md: 2 }
                            }}
                        />
                    </Box>
                )}

                <Box sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    alignItems: 'center',
                    gap: 2,
                    pl: { xs: 1, md: '15%' }
                }}>
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: '50%',
                            minWidth: '56px',
                            height: '56px',
                            borderColor: '#5a42d4',
                            color: 'text.secondary'
                        }}
                    >
                        <ArrowBackIcon />
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            borderRadius: '50%',
                            minWidth: '56px',
                            height: '56px',
                            bgcolor: '#7356FC',
                            '&:hover': {
                                bgcolor: '#5a42d4',
                            }
                        }}
                    >
                        <ArrowForwardIcon />
                    </Button>
                </Box>

                <Grid container spacing={4} sx={{ px: { xs: 3, md: '13%' }, my: 8 }}>
                    {allPostsForGrid.map((post, index) => (
                        <Grid item xs={12} sm={6} md={4} key={post._id || post.id || index}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '20px', border: '1px solid', borderColor: 'divider', boxShadow: 'none', transition: 'transform 0.3s, box-shadow 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 } }}>
                                <Box
                                    component="img"
                                    src={post.imageUrl || "/image-blog-2.jpg"}
                                    alt={post.title}
                                    sx={{
                                        width: '100%',
                                        height: '256px',
                                        objectFit: 'cover',
                                        borderTopLeftRadius: '20px',
                                        borderTopRightRadius: '20px',
                                    }}
                                />
                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, backgroundColor: 'white' }}>
                                    <Button variant="outlined" sx={{
                                        borderColor: 'primary.main', color: 'primary.main', borderWidth: 2, borderRadius: '5px', alignSelf: 'flex-start', mb: 2, '&:hover': {
                                            backgroundColor: 'primary.main',
                                            color: 'primary.contrastText',
                                            borderColor: 'primary.main',
                                            borderWidth: 2,
                                        }, py: 0.5
                                    }}> 
                                        {post.category || t('blog.category')}
                                    </Button>
                                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: 'black', mb: 1 }}>
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1, mb: 2 }}>
                                        {post.excerpt || post.content?.substring(0, 100) + '...' || t('blog.noExcerpt')}
                                    </Typography>
                                    <Link href={`/blog/${post.slug}`} underline="none" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500, color: 'black' }}>
                                        {t('blog.readMore')} <ArrowForwardIcon fontSize="small" />
                                    </Link>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{
                    display: { xs: 'none', md: 'flex' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1.5,
                    my: 4,
                }}>
                    {[1, 2, 3, 4, 5, '...', 18].map((page, index) => {
                        if (typeof page === 'string') {
                            return (
                                <Typography key={`ellipsis-${index}`} sx={{ color: 'text.secondary', alignSelf: 'center', px: 1, fontWeight: 'bold' }}>
                                    {page}
                                </Typography>
                            );
                        }
                        return (
                            <Button
                                key={page}
                                variant={page === 1 ? "contained" : "text"}
                                sx={{
                                    borderRadius: '50%',
                                    minWidth: '48px',
                                    height: '48px',
                                    p: 0,
                                    fontWeight: 'bold',
                                    ...(page === 1 && {
                                        bgcolor: '#DC3884',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(220, 56, 132, 0.4)',
                                        '&:hover': { bgcolor: '#c22a6e' }
                                    }),
                                    ...(page !== 1 && {
                                        color: 'text.secondary',
                                        '&:hover': {
                                            backgroundColor: 'rgba(220, 56, 132, 0.1)',
                                            color: '#DC3884',
                                        }
                                    })
                                }}
                            >{page}</Button>
                        );
                    })}
                </Box>

                <Box sx={{
                    display: { xs: 'flex', md: 'none' },
                    justifyContent: 'center',
                    px: 3,
                }}>
                    <Button
                        variant="outlined"
                        sx={{ width: '100%', maxWidth: '400px', py: 1.2, fontSize: '16px', borderRadius: '8px', border: '1px solid', borderColor: 'primary.main', '&:hover': { backgroundColor: '#000000', borderColor: 'primary.dark', color: 'primary.contrastText' }, color: '#000000' }}
                    >
                        {t('blog.loadMore')}
                    </Button>
                </Box>

            </Box>
            <Footer />
        </>
    );
}