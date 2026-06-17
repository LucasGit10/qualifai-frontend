import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dashboard as DashboardIcon, People as PeopleIcon, Chat as ChatIcon, Settings as SettingsIcon,
  Campaign as CampaignIcon, GraphicEq as KanbanIcon, CalendarMonth as CalendarIcon,
  AdminPanelSettings as AdminPanelSettingsIcon, AccountCircle as ProfileIcon,
  DynamicFeed as DynamicFeedIcon, EmojiEvents as RankingIcon, Groups as TeamIcon,
  Instagram as InstagramIcon, 
  ReceiptLong as DebtsIcon,
  Gavel as JudicialIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';

export function useMenuItems(user, canAccess, plan) {
  const { t, i18n } = useTranslation();
  const effectivePlan = user && plan === 'guest' ? 'pro' : plan;

  const showcaseContextValue = useMemo(() => {
    const isGuestMode = !user;
    const featurePermissions = {
      TEMPLATE: ['basic', 'medium', 'pro'], CALENDAR: ['basic', 'medium', 'pro'],
      KANBAN: ['basic', 'medium', 'pro'], VOICE_AI: ['medium', 'pro'],
      FOLLOWUP_AI: ['medium', 'pro'], ADVANCED_REPORTS: ['pro'],
    };
    
    const checkAccess = (featureKey) => {
      if (isGuestMode || !featureKey || !featurePermissions[featureKey]) return !isGuestMode;
      return featurePermissions[featureKey].includes(effectivePlan);
    };

    return { checkAccess };
  }, [user, effectivePlan]);
  
  const checkAccess = showcaseContextValue.checkAccess;

  const itensMenu = useMemo(() => {
    let items = [
      { tKey: 'layout.menuItems.dashboard', icone: <DashboardIcon />, path: '/app/dashboard' },
      { tKey: 'layout.menuItems.devedores', icone: <PeopleIcon />, path: '/app/leads' },
      { tKey: 'layout.menuItems.dividas', icone: <DebtsIcon />, path: '/app/debts' },
      { tKey: 'layout.menuItems.conversations', icone: <ChatIcon />, path: '/app/conversations' },
      { tKey: 'layout.menuItems.campaigns', icone: <CampaignIcon />, path: '/app/campaigns' },
    ];
    
    if (checkAccess('TEMPLATE')) items.push({ tKey: 'layout.menuItems.templates', icone: <DynamicFeedIcon />, path: '/app/template-message' });
    if (checkAccess('CALENDAR')) items.push({ tKey: 'layout.menuItems.calendar', icone: <CalendarIcon />, path: '/app/calendar' });
    // if (checkAccess('KANBAN')) items.push({ tKey: 'layout.menuItems.kanban', icone: <KanbanIcon />, path: '/app/kanban' });

    const roleBasedItems = {
      sales: [
        ...items, 
        { tKey: 'layout.menuItems.profile', icone: <ProfileIcon />, path: '/app/profile' }
      ],
      manager: [
        ...items, 
        { tKey: 'layout.menuItems.team', icone: <TeamIcon />, path: '/app/team' },
        { tKey: 'layout.menuItems.profile', icone: <ProfileIcon />, path: '/app/profile' }, 
        { tKey: 'layout.menuItems.settings', icone: <SettingsIcon />, path: '/app/settings' },
        { tKey: 'layout.menuItems.noResponseLeads', icone: <ChatIcon />, path: '/app/no-response-leads' },
      ],
      admin: [
        ...items, 
        { tKey: 'layout.menuItems.team', icone: <TeamIcon />, path: '/app/team' }, 
        { tKey: 'layout.menuItems.ranking', icone: <RankingIcon />, path: '/app/ranking' }, 
        { tKey: 'layout.menuItems.profile', icone: <ProfileIcon />, path: '/app/profile' }, 
        { tKey: 'layout.menuItems.instagram', icone: <InstagramIcon />, path: '/app/instagram' },
        { tKey: 'layout.menuItems.settings', icone: <SettingsIcon />, path: '/app/settings' }, 
        { tKey: 'layout.menuItems.admin', icone: <AdminPanelSettingsIcon />, path: '/app/admin' },
        { tKey: 'layout.menuItems.blog', icone: <AdminPanelSettingsIcon />, path: '/app/blog-editor' },
        { tKey: 'layout.menuItems.noResponseLeads', icone: <ChatIcon />, path: '/app/no-response-leads' },
        { tKey: 'layout.menuItems.aiTraining', icone: <AdminPanelSettingsIcon />, path: '/app/ai-training' },
      ],
    };

    const finalItems = roleBasedItems[user?.role] || items;
    
    return (finalItems || []).map(item => ({ ...item, texto: t(item.tKey) }));

  }, [user?.role, effectivePlan, i18n.language, t]);

  return { itensMenu, canAccess: checkAccess };
}
