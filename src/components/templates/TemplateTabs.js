import React from 'react';
import { Box, Tabs, Tab, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TemplateCard } from 'components/templates/TemplateCard'; 

function a11yProps(index) {
  return {
    id: `template-tab-${index}`,
    'aria-controls': `template-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`template-tabpanel-${index}`}
      aria-labelledby={`template-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>{children}</Box>
      )}
    </div>
  );
}

export const TemplateTabs = ({ currentTab, onTabChange, conversationTemplates, followUpTemplates, emailTemplates, onCardAction }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={onTabChange}
          aria-label="Abas de templates"
          sx={{
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main'
            }
          }}
        >
          <Tab label={t('templatesPage.tabs.conversation')} {...a11yProps(0)} />
          <Tab label={t('templatesPage.tabs.followUp')} {...a11yProps(1)} /> 
          <Tab label="Emails" {...a11yProps(2)} />
        </Tabs>
      </Box>
      
      <TabPanel value={currentTab} index={0}>
        {conversationTemplates.length > 0 ? (
          <Grid container spacing={3}>
            {conversationTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template._id}>
                <TemplateCard template={template} onAction={onCardAction} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ color: 'text.secondary', mt: 4, textAlign: 'center' }}>
            {t('templatesPage.noConversationTemplates')}
          </Typography>
        )}
      </TabPanel>
      
      <TabPanel value={currentTab} index={1}>
        {followUpTemplates.length > 0 ? (
          <Grid container spacing={3}>
            {followUpTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template._id}>
                <TemplateCard template={template} onAction={onCardAction} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ color: 'text.secondary', mt: 4, textAlign: 'center' }}>
            {t('templatesPage.noFollowUpTemplates')}
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        {emailTemplates.length > 0 ? (
          <Grid container spacing={3}>
            {emailTemplates.map((template) => (
              <Grid item xs={12} md={6} lg={4} key={template._id}>
                <TemplateCard template={template} onAction={onCardAction} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ color: 'text.secondary', mt: 4, textAlign: 'center' }}>
            Nenhum template de email criado.
          </Typography>
        )}
      </TabPanel>
    </Box>
  );
};
