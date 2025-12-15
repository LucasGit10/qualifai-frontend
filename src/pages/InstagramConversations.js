import React, { useState } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { Grid, Hidden, useTheme } from '@mui/material';
import ConversationList from 'components/ConversationPageWhats/ConversationList';
import ChatWindow from 'components/ConversationPageWhats/ChatWindow';
import EmptyChat from 'components/ConversationPageWhats/EmptyChat';
import api from 'services/api';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function InstagramConversations() {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const theme = useTheme();

  const deleteConversationMutation = useMutation(
    (conversationId) => api.delete(`/conversations/delete/${conversationId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conversationsList', 'instagram']); // Invalida a query específica da lista
        queryClient.invalidateQueries('conversations'); // Invalida a query geral de conversas também
        toast.success(t('conversationsPage.toasts.deleteSuccess'));
        setSelectedConversationId(null);
      },
      onError: (error) => toast.error(error.response?.data?.message || t('conversationsPage.toasts.deleteError'))
    }
  );

  const handleDeleteConversation = (conversationId, event) => {
    event?.stopPropagation();
    deleteConversationMutation.mutate(conversationId);
  };

  return (
      <Grid container sx={{ 
        height: 'calc(100vh - 112px)',
        m: 0,
        borderRadius: 3,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}>
        <Grid item xs={12} md={4} lg={3} sx={{ borderRight: { xs: 0, md: 1 }, borderColor: { md: theme.palette.divider }, display: { xs: selectedConversationId ? 'none' : 'flex', md: 'flex' }, flexDirection: 'column', height: '100%', }}>
          <ConversationList 
            channel="instagram"
            selectedConversationId={selectedConversationId} 
            onSelectConversation={setSelectedConversationId}
            onDeleteConversation={handleDeleteConversation}
          />
        </Grid>

        <Grid item xs={12} md={8} lg={9} sx={{ display: { xs: selectedConversationId ? 'flex' : 'none', md: 'flex' }, flexDirection: 'column', height: '100%', }}>
          {selectedConversationId ? (
            <ChatWindow 
              conversationId={selectedConversationId}
              onClose={() => setSelectedConversationId(null)}
              onDelete={handleDeleteConversation}
            />
          ) : (
            <Hidden mdDown><EmptyChat /></Hidden>
          )}
        </Grid>
      </Grid>
  );
}