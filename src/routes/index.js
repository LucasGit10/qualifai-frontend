import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { TourProvider } from '../contexts/TourContext';

import AdminRoute from 'components/AdminRoute';
import { Blog } from 'components/Blog/Blog';
import ToggleConversation from 'components/ConversationPage/ToggleConversation';
import ToggleInstagramConversation from 'components/ConversationPage/ToggleInstagramConversation'; // Alterado
import ErrorBoundary from 'components/ErrorBoundary';
import ManagerRoute from 'components/ManagerRoute';
import ProtectedRoute from 'components/ProtectedRoute';
import Layout from 'components/layout/index';
import AITrainingPage from 'pages/AITrainingPage';
import Admin from 'pages/Admin';
import Debts from 'pages/Debts';
import BlogEditor from 'pages/BlogEditor';
import CalendarPage from 'pages/CalendarPage';
import Campaigns from 'pages/Campaigns';
import TermsOfUsePage from 'pages/ConditionUse';
import PrivacyPolicyPage from 'pages/ConditionsPage';
import EmailConfirmedPage from 'pages/ConfirmedEmail';
import Conversations from 'pages/Conversations';
import Dashboard from 'pages/Dashboard';
import DeleteAccountPage from 'pages/DeleteAccountPage';
import EmailConfirmationPage from 'pages/EmailConfirmation';
import InstagramIntegration from 'pages/InstagramIntegration';
import KanbanBoard from 'pages/KanbanBoard';
import LandingPage from 'pages/LandPage';
import Leads from 'pages/Leads';
import Login from 'pages/Login';
import MessageTemplates from 'pages/MessageTemplates';
import NoResponseLeads from 'pages/NoResponseLeads';
import PlanNotification from 'pages/PlanNotification';
import PlansPage from 'pages/PlansPage';
import PostPage from 'pages/PostPage';
import ProfilePage from 'pages/ProfilePage';
import Ranking from 'pages/Ranking';
import RegisterPage from 'pages/Register';
import NewRegisterPage from 'pages/RegisterCalendar';
import ForgotPassword from 'pages/RequestPassword';
import ResetPassword from 'pages/ResetPassword';
import PlansSelectionPage from 'pages/SelectPlan';
import Settings from 'pages/Settings';
import TeamManagement from 'pages/TeamManagement';
import VoiceAgent from 'pages/VoiceAgent';
import WhatsApp from 'pages/WhatsApp';
import VitrineB2B from 'pages/Vitrine';
import B2BChatPage from 'pages/Chat';


export const createRouter = (isAuthenticated, toggleColorMode) => createBrowserRouter([
  {
    element: (
      <TourProvider>
        <Outlet />
      </TourProvider>
    ), 
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/privacy", element: <PrivacyPolicyPage /> },
      { path: "/terms", element: <TermsOfUsePage /> },
      { path: "/plan-notification", element: <PlanNotification /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
      
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:slug", element: <PostPage /> },
      { path: "/marketplace", element: <VitrineB2B /> },
      { path: "/chat-business", element: <B2BChatPage /> },
      
      { 
        path: "/login", 
        element: !isAuthenticated ? <Login /> : <Navigate to="/app/dashboard" replace /> 
      },
      { 
        path: "/register", 
        element: !isAuthenticated ? <RegisterPage /> : <Navigate to="/app/dashboard" replace /> 
      },
      { 
        path: "/register-calendar", 
        element: !isAuthenticated ? <NewRegisterPage /> : <Navigate to="/app/dashboard" replace /> 
      },
      { path: "/confirmationEmail", element: <EmailConfirmationPage /> },
      { path: "/verify-email", element: <EmailConfirmedPage /> },
      { 
        path: "/signature", 
        element: <PlansSelectionPage /> 
      },
      {
        path: '/app',
        element: <ProtectedRoute />,
        children: [
          { 
            element: <Layout toggleColorMode={toggleColorMode} />,
            children: [
              { path: "dashboard", element: <Dashboard /> },
              { path: "leads", element: <Leads /> },
              { path: "debts", element: <Debts /> },
              { path: "conversations-whats", element: <Conversations /> },
              { path: "conversations", element: <ToggleConversation /> },
              { path: "settings", element: <Settings /> },
              { path: "whatsapp", element: <WhatsApp /> },
              { path: "kanban", element: <KanbanBoard /> },
              { path: "campaigns", element: <Campaigns /> },
              { path: "calendar", element: <CalendarPage /> },
              { path: "profile", element: <ProfilePage /> },
              { path: "delete-account", element: <DeleteAccountPage /> },
              { path: "template-message", element: <MessageTemplates /> },
              { path: "ranking", element: <Ranking /> },
              { path: "voice-agent", element: <VoiceAgent /> },
              { path: "instagram-conversations", element: <ToggleInstagramConversation /> }, // Alterado
              { path: "instagram", element: <InstagramIntegration/>},
              { path: "no-response-leads", element: <NoResponseLeads /> },
              
              {
                element: <ManagerRoute />,
                children: [
                  { path: "team", element: <TeamManagement /> },
                ]
              },
              {
                element: <AdminRoute />,
                children: [
                  { path: "admin", element: <Admin /> },
                  { path: "plans-admin", element: <PlansPage /> },
                  { path: "blog-editor", element: <BlogEditor />},
                  { path: "ai-training", element: <AITrainingPage />}
                ]
              },
              { index: true, element: <Navigate to="dashboard" replace /> }
            ]
          }
        ]
      }
    ]
  }
]);