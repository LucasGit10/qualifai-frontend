import React from 'react';
import { Box, Typography, Paper, LinearProgress, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { GradientButton } from 'components/ui/GradientButton';
import { useMessageTemplates } from 'hooks/useMessageTemplates';
import { TemplateTabs } from 'components/templates/TemplateTabs';
import { TemplateEmptyState } from 'components/templates/TemplateEmptyState';
import { TemplateFormDialog } from 'components/templates/TemplateFormDialog';
import { SubmitApprovalDialog } from 'components/templates/SubmitApprovalDialog';
import { DeleteConfirmationDialog } from 'components/templates/DeleteConfirmationDialog';

export default function MessageTemplates() {
  const { t } = useTranslation();
  const theme = useTheme();

  const {
    isLoadingTemplates,
    templates,
    conversationTemplates,
    followUpTemplates,
    instances,
    isLoadingInstances,
    currentTab,
    dialogState,
    selectedTemplate,
    correctedData,
    mutationIsLoading,
    uploadSampleMutation,
    handleTabChange,
    handleOpenDialog,
    handleCloseDialogs,
    handleCardAction,
    handleFormSubmit,
    onSubmitApproval,
    onDeleteConfirm,
    deconstructComponentsForForm
  } = useMessageTemplates();

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'background.paper',
        backdropFilter: theme.palette.mode === 'dark' ? 'blur(10px)' : 'none',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[2]
      }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: 'text.primary' }}>
          {t('templatesPage.title')}
        </Typography>
        <GradientButton
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
        >
          {t('templatesPage.newTemplateButton')}
        </GradientButton>
      </Paper>

      {isLoadingTemplates && <LinearProgress sx={{ mb: 3 }} />}

      {!isLoadingTemplates && (!templates || templates.length === 0) ? (
        <TemplateEmptyState onAction={() => handleOpenDialog('create')} />
      ) : !isLoadingTemplates && templates?.length > 0 && (
        <TemplateTabs
          currentTab={currentTab}
          onTabChange={handleTabChange}
          conversationTemplates={conversationTemplates}
          followUpTemplates={followUpTemplates}
          onCardAction={handleCardAction}
        />
      )}

      <TemplateFormDialog
        open={dialogState.create || dialogState.edit}
        onClose={handleCloseDialogs}
        onSubmit={handleFormSubmit}
        template={dialogState.edit ? selectedTemplate : null}
        isLoading={mutationIsLoading}
        deconstructComponentsForForm={deconstructComponentsForForm}
      />
      <SubmitApprovalDialog
        open={dialogState.submit}
        onClose={handleCloseDialogs}
        onSubmit={onSubmitApproval}
        isLoading={mutationIsLoading}
        template={selectedTemplate}
        correctedData={correctedData}
        instances={instances}
        instancesLoading={isLoadingInstances}
        onUploadSample={uploadSampleMutation.mutateAsync}
        isUploading={uploadSampleMutation.isLoading}
      />
      <DeleteConfirmationDialog
        open={dialogState.delete}
        onClose={handleCloseDialogs}
        onConfirm={onDeleteConfirm}
        isLoading={mutationIsLoading}
        templateName={selectedTemplate?.name}
      />
    </Box>
  );
}