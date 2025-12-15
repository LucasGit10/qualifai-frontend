import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Box, CircularProgress, Alert } from '@mui/material';
import api from '../services/api';
import { mockBlogPosts } from '../utils/mockBlogData'; // Importe os dados mockados
import IndividualPost from '../components/Blog/IndividualPost';

const PostPage = () => {
  const { slug } = useParams();

  const { data: post, isLoading, isError, error } = useQuery(
    ['blogPost', slug], 
    () => api.get(`/blog/${slug}`).then(res => res.data),
    {
      // Se a chamada falhar, busca o post nos dados mockados pelo slug
      initialData: () => {
        const mockPost = mockBlogPosts.find(p => p.slug === slug);
        return mockPost;
      }
    }
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) return <Alert severity="error">Erro ao carregar o post: {error.message}</Alert>;

  return <IndividualPost post={post} />;
};

export default PostPage;