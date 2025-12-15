import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, TextField, Button, Grid, useTheme,
    Skeleton, IconButton, InputAdornment, Card, CardMedia,
    Tooltip, CircularProgress
} from '@mui/material';
import {
    Publish as PublishIcon, Image as ImageIcon, ArrowBack as ArrowBackIcon,
    Title as TitleIcon, Category as CategoryIcon, Add as AddIcon,
    Edit as EditIcon, Delete as DeleteIcon, Description as DescriptionIcon
} from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import api from '../services/api'; // Verifique se o caminho para seu arquivo api.js está correto

// --- ESTILO GLASSMORPHISM REUTILIZÁVEL ---
const glassmorphismStyle = (theme) => ({
    p: { xs: 3, md: 4 },
    borderRadius: 4,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(40, 40, 40, 0.3)' : 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
});

// --- COMPONENTE DE PREVIEW ---
const LivePostPreview = ({ title, content, excerpt, imageUrl, author, tags }) => {
    const { t } = useTranslation();
    const socialIcons = [
        { label: 'Instagram', icon: 'https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png' },
        { label: 'LinkedIn', icon: 'https://img.icons8.com/ios-filled/50/ffffff/linkedin.png' },
        { label: 'Twitter', icon: 'https://img.icons8.com/ios-filled/50/ffffff/twitter-squared.png' },
    ];
    const defaultAuthorImageUrl = "https://via.placeholder.com/48/CCCCCC/FFFFFF?text=AD";
    
    return (
        <Box>
            <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ color: 'text.primary', mt: 4, mb: 8, fontWeight: 'bold', wordBreak: 'break-word', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                {title || 'Título do Post'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <img src={author?.imageUrl || defaultAuthorImageUrl} alt={author?.name || 'Autor'} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <Typography variant="body2" component="p" sx={{ lineHeight: 1.5, color: 'text.secondary' }}>
                        {t('individualPost.by')} <strong>{author?.name || 'Admin'}</strong><br />
                        {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                {imageUrl ? (
                    <Box component="img" src={imageUrl} alt="Prévia" sx={{ width: '100%', height: { xs: '264px', md: '500px' }, borderRadius: { xs: '13px', md: '49px' }, objectFit: 'cover' }} />
                ) : (
                    <Skeleton variant="rectangular" sx={{ width: '100%', height: { xs: '264px', md: '500px' }, borderRadius: { xs: '13px', md: '49px' }, bgcolor: 'rgba(255,255,255,0.1)' }} />
                )}
            </Box>
            <Grid container spacing={4} sx={{ px: 2, paddingBottom: 8 }}>
                <Grid item lg={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
                    <Box sx={{ mb: 8, pr: 2, borderRight: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h6" component="p" sx={{ color: 'primary.main', fontWeight: 600, wordBreak: 'break-word' }}>
                            <strong>{(tags && tags.length > 0) ? tags.join(', ') : 'Tags'}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {socialIcons.map((item, index) => (
                            <IconButton key={index} sx={{ border: '1px solid', borderColor: 'divider' }} aria-label={item.label}>
                                <img src={item.icon} alt={item.label} style={{ width: '20px', height: '20px' }} />
                            </IconButton>
                        ))}
                    </Box>
                </Grid>
                <Grid item xs={12} lg={9}>
                    {excerpt && (
                        <Typography variant="subtitle1" component="p" sx={{ lineHeight: 1.6, fontSize: '1.2rem', color: 'text.secondary', mb: 3, fontStyle: 'italic', px: { xs: 0, md: 2 } }}>
                            {excerpt}
                        </Typography>
                    )}
                    <Typography variant="body1" component="div" sx={{ lineHeight: 1.8, fontSize: '1.1rem', color: 'text.primary', whiteSpace: 'pre-wrap', wordBreak: 'break-word', px: { xs: 0, md: 2 } }}>
                        {content || t('individualPost.defaultContent')}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};

// --- COMPONENTE DE LISTA ---
const PostList = ({ posts, onAddNew, onEdit, onDelete, loading }) => {
    const theme = useTheme();

    return (
        <Paper sx={glassmorphismStyle(theme)}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" fontWeight="bold">Gerenciar Publicações</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddNew} sx={{ py: 1.5, px: 3 }}>
                    Criar Novo Post
                </Button>
            </Box>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
            ) : (
                <Grid container spacing={4}>
                    {posts.map(post => (
                        <Grid item key={post._id} xs={12} sm={6} lg={4}>
                            <Card sx={{
                                position: 'relative', borderRadius: 4, overflow: 'hidden', height: '350px',
                                '&:hover .post-overlay': { transform: 'translateY(0)', opacity: 1 }
                            }}>
                                <CardMedia component="img" image={post.imageUrl} alt={post.title} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Box className="post-overlay" sx={{
                                    position: 'absolute', bottom: 0, left: 0, width: '100%', p: 2, color: 'white',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
                                    transform: 'translateY(30%)', opacity: 0.9, transition: 'all 0.4s ease-in-out',
                                }}>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>{post.title}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                        <Typography variant="body2">{post.tags?.join(', ') || 'Sem Tags'}</Typography>
                                        <Box>
                                            <Tooltip title="Excluir"><IconButton onClick={() => onDelete(post.slug)} sx={{ color: 'rgba(255,255,255,0.8)' }}><DeleteIcon /></IconButton></Tooltip>
                                            <Tooltip title="Editar"><IconButton onClick={() => onEdit(post)} sx={{ color: 'white' }}><EditIcon /></IconButton></Tooltip>
                                        </Box>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};

// --- COMPONENTE DE EDIÇÃO ---
const PostEditor = ({ initialPost, onBack, onSave, loading }) => {
    const theme = useTheme();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [tags, setTags] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (initialPost) {
            setTitle(initialPost.title || '');
            setContent(initialPost.content || '');
            setExcerpt(initialPost.excerpt || '');
            setTags(initialPost.tags?.join(', ') || '');
            setImagePreview(initialPost.imageUrl || '');
            setImageFile(null);
        } else {
            setTitle(''); setContent(''); setExcerpt(''); setTags(''); setImageFile(null); setImagePreview('');
        }
    }, [initialPost]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const mockAuthor = { name: "Admin", imageUrl: "https://via.placeholder.com/48/CCCCCC/FFFFFF?text=AD" };

    const handleSaveClick = () => {
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        onSave({ title, content, excerpt, tags: tagsArray, image: imageFile });
    };

    // Se estiver no modo de edição e carregando os dados, mostra um loader.
    if (loading && !title && initialPost) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress size={60} />
                <Typography sx={{ ml: 2 }}>Carregando post para edição...</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} lg={5}>
                <Paper sx={{ ...glassmorphismStyle(theme), position: 'sticky', top: '24px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <IconButton onClick={onBack}><ArrowBackIcon /></IconButton>
                        <Typography variant="h4" fontWeight="bold">{initialPost ? 'Editar Post' : 'Criar Novo Post'}</Typography>
                    </Box>
                    <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
                        <TextField label="Título do Post" variant="outlined" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><TitleIcon color="action" /></InputAdornment>) }} />
                        <TextField label="Resumo (Excerpt)" variant="outlined" fullWidth multiline rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><DescriptionIcon color="action" /></InputAdornment>) }} />
                        <TextField label="Tags (separadas por vírgula)" variant="outlined" fullWidth value={tags} onChange={(e) => setTags(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><CategoryIcon color="action" /></InputAdornment>) }} />
                        <TextField label="Conteúdo Principal" variant="outlined" fullWidth multiline rows={15} value={content} onChange={(e) => setContent(e.target.value)} />
                        <Button variant="outlined" component="label" startIcon={<ImageIcon />} fullWidth sx={{ py: 1.5, textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}>
                            {imageFile ? imageFile.name : (imagePreview ? 'Trocar Imagem' : 'Carregar Imagem de Capa')}
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                        <Button variant="contained" color="primary" size="large" startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <PublishIcon />} onClick={handleSaveClick} disabled={loading} sx={{ mt: 2, py: 1.5 }}>
                            {initialPost ? 'Salvar Alterações' : 'Publicar Post'}
                        </Button>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={7}>
                <Paper sx={glassmorphismStyle(theme)}>
                    <LivePostPreview
                        title={title}
                        content={content}
                        excerpt={excerpt}
                        tags={tags.split(',').map(tag => tag.trim())}
                        imageUrl={imagePreview}
                        author={mockAuthor}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
};


// --- COMPONENTE PRINCIPAL QUE GERENCIA A TELA E A LÓGICA DA API ---
export default function BlogAdmin() {
    const theme = useTheme();
    const [view, setView] = useState('list');
    const [selectedPost, setSelectedPost] = useState(null);
    const [posts, setPosts] = useState([]);
    const [listLoading, setListLoading] = useState(true); // Loading da lista principal
    const [actionLoading, setActionLoading] = useState(false); // Loading de ações (salvar, carregar para editar)

    const fetchPosts = async () => {
        setListLoading(true);
        try {
            const response = await api.get('/blog');
            setPosts(response.data.posts);
        } catch (error) {
            toast.error('Falha ao buscar as publicações.');
            console.error(error);
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        if (view === 'list') {
            fetchPosts();
        }
    }, [view]);

    const handleAddNew = () => {
        setSelectedPost(null);
        setView('editor');
    };

    const handleEdit = async (post) => {
        setActionLoading(true);
        setView('editor');
        try {
            const response = await api.get(`/blog/${post.slug}`);
            setSelectedPost(response.data);
        } catch (error) {
            toast.error("Falha ao carregar dados do post para edição.");
            setView('list');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (postSlug) => {
        if (window.confirm('Tem certeza que deseja excluir este post? A ação não pode ser desfeita.')) {
            try {
                await api.delete(`/blog/${postSlug}`);
                toast.success('Post excluído com sucesso!');
                fetchPosts();
            } catch (error) {
                toast.error('Falha ao excluir o post.');
            }
        }
    };

    const handleSave = async (postData) => {
        setActionLoading(true);
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('excerpt', postData.excerpt);
        postData.tags.forEach(tag => formData.append('tags[]', tag));
        if (postData.image) {
            formData.append('image', postData.image);
        }

        try {
            if (selectedPost) {
                await api.put(`/blog/${selectedPost.slug}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Post atualizado com sucesso!');
            } else {
                await api.post('/blog', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                toast.success('Post criado com sucesso!');
            }
            setView('list');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ocorreu um erro.';
            toast.error(`Falha ao salvar: ${errorMessage}`);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Box sx={{
            p: { xs: 2, md: 3 }, minHeight: '100vh',
        }}>
            {view === 'list' ? (
                <PostList posts={posts} onAddNew={handleAddNew} onEdit={handleEdit} onDelete={handleDelete} loading={listLoading} />
            ) : (
                <PostEditor initialPost={selectedPost} onBack={() => setView('list')} onSave={handleSave} loading={actionLoading} />
            )}
        </Box>
    );
}