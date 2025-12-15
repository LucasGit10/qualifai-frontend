import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Box, Typography, Modal, Grid, Card, CardHeader, CardContent, IconButton, CircularProgress, useTheme, styled, alpha, Button, Chip, TextField, Autocomplete, Paper, Stack, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Close as CloseIcon, Sync as SyncIcon, Videocam as VideocamIcon, Person as PersonIcon, OpenInNew as OpenInNewIcon, AccessTime as AccessTimeIcon, CalendarToday as CalendarTodayIcon, Lock as LockIcon } from '@mui/icons-material';
import { useShowcaseContext } from '../contexts/ShowcaseContext';
import { mockCalendarEvents } from '../utils/mockData';
import { useForm, Controller } from 'react-hook-form';
import ShowcaseBlocker from '../components/Showcase/ShowcaseBlocker';
import { useTranslation } from 'react-i18next';
import { StyledDialog } from '../components/ui/StyledDialog';
import { GradientButton } from '../components/ui/GradientButton';

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { locale: ptBR }), getDay, locales });

const fetchEvents = async ({ queryKey }) => {
    const [_key, { start, end }] = queryKey;
    const params = new URLSearchParams({ start: start.toISOString(), end: end.toISOString() });
    const { data } = await api.get(`/calendar/events?${params.toString()}`);
    return data.map(event => ({ ...event, start: new Date(event.start), end: new Date(event.end) }));
};

const fetchLeadsList = async () => {
    const { data } = await api.get('/leads/list');
    return data;
}

const validateEmails = (emails) => {
    if (!emails || emails.trim() === '') return true;
    
    const emailList = emails.split(',').map(email => email.trim()).filter(email => email !== '');
    if (emailList.length === 0) return true;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));
    
    return invalidEmails.length === 0 || 'Alguns emails são inválidos: ' + invalidEmails.join(', ');
};

const StyledCalendarWrapper = styled(Box)(({ theme }) => ({
    height: 'calc(100vh - 200px)',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    position: 'relative',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',

    '.rbc-calendar': {
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily
    },
    '.rbc-toolbar': {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1),
        '& .rbc-toolbar-label': {
            fontSize: theme.typography.h5.fontSize,
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.text.primary,
            flexGrow: 1,
            textAlign: 'center',
        },
    },
    '.rbc-btn-group button': {
        cursor: 'pointer',
        border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.2)',
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
        padding: '6px 12px',
        borderRadius: theme.shape.borderRadius,
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.1),
            borderColor: theme.palette.primary.light,
        },
        '&.rbc-active': {
            background: theme.palette.custom?.gradients?.button || theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderColor: theme.palette.primary.main,
        },
    },
    '.rbc-header': {
        color: theme.palette.text.secondary,
        border: 'none',
        padding: '10px 0',
        fontSize: '0.875rem',
    },
    '.rbc-month-view, .rbc-time-view': {
        border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.default, 0.1)
            : alpha(theme.palette.background.paper, 0.5)
    },
    '.rbc-day-bg, .rbc-month-row': {
        borderColor: alpha(theme.palette.divider, 0.2),
    },
    '.rbc-off-range-bg': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
    },
    '.rbc-today': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    '.rbc-event': {
        backgroundColor: alpha(theme.palette.primary.main, 0.8),
        color: theme.palette.primary.contrastText,
        borderRadius: theme.shape.borderRadius,
        padding: '4px 8px',
        fontSize: '0.8rem',
        border: 'none',
        // CORREÇÃO: Box shadow para eventos
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
}));

export default function CalendarPage() {
    const { t } = useTranslation();
    const [dateRange, setDateRange] = useState(() => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }));
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [slotInfo, setSlotInfo] = useState(null);

    const navigate = useNavigate();
    const { isGuestMode, openModal } = useShowcaseContext();
    const theme = useTheme();
    const queryClient = useQueryClient();

    // ✅ ATUALIZADO: Adicionar campo participants nos defaultValues com validação
    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            description: '',
            start: new Date(),
            end: new Date(),
            lead: null,
            participants: ''
        }
    });

    const { data: apiEvents = [], isLoading: apiIsLoading } = useQuery(['calendarEvents', dateRange], fetchEvents, { keepPreviousData: true, staleTime: 60 * 1000, enabled: !isGuestMode });
    const { data: leads = [], isLoading: isLoadingLeads } = useQuery('leadsList', fetchLeadsList, { enabled: !isGuestMode && createModalOpen });

    const events = isGuestMode ? mockCalendarEvents : apiEvents;
    const isLoading = isGuestMode ? false : apiIsLoading;

    const createEventMutation = useMutation((newEvent) => api.post('/calendar/events', newEvent), {
        onSuccess: () => {
            toast.success(t('calendarPage.toasts.createSuccess'));
            queryClient.invalidateQueries(['calendarEvents', dateRange]);
            setCreateModalOpen(false);
            reset();
        },
        onError: (error) => {
            console.error('Erro ao criar evento:', error);
            toast.error(error.response?.data?.message || t('calendarPage.toasts.createError'));
        },
    });

    const syncMutation = useMutation(() => api.post('/calendar/events/sync'), {
        onSuccess: (response) => {
            queryClient.invalidateQueries(['calendarEvents', dateRange]);
            toast.success(response.data.message || t('calendarPage.toasts.syncSuccess'));
            const stats = response.data.stats;
            if (stats) {
                Object.entries(stats).forEach(([crm, result]) => {
                    const crmName = crm.charAt(0).toUpperCase() + crm.slice(1);
                    if (result.error) {
                        toast.error(t('calendarPage.toasts.syncCrmError', { crmName, error: result.error }), { autoClose: 7000 });
                    } else if (result.synced > 0) {
                        toast.info(t('calendarPage.toasts.syncCrmSuccess', { count: result.synced, crmName }));
                    }
                });
            }
        },
        onError: (error) => {
            console.error('Erro ao sincronizar:', error);
            toast.error(error.response?.data?.message || t('calendarPage.toasts.syncError'));
        },
    });

    const handleNavigate = (newDate) => setDateRange({ start: startOfMonth(newDate), end: endOfMonth(newDate) });
    const handleSelectEvent = (event) => setSelectedEvent(event);
    const handleSelectSlot = (slot) => {
        if (isGuestMode) { openModal(); return; }
        setSlotInfo(slot);
        // ✅ ATUALIZADO: Reset inclui participants
        reset({
            title: '',
            description: '',
            start: slot.start,
            end: slot.end,
            lead: null,
            participants: ''
        });
        setCreateModalOpen(true);
    };

    const handleCloseModal = () => setSelectedEvent(null);
    const handleCloseCreateModal = () => {
        setCreateModalOpen(false);
        setSlotInfo(null);
        reset();
    };

    // ✅ VALIDAÇÃO: Função para validar horários
    const validateTimeRange = (start, end) => {
        return end > start || 'O horário final deve ser após o horário inicial';
    };

    // ✅ ATUALIZADO: Incluir participants como objeto no payload
    const onSubmitCreateEvent = async (data) => {
        try {
            // ✅ CORREÇÃO: Usar a data do slot corretamente
            const startDate = new Date(slotInfo.start);
            const endDate = new Date(slotInfo.start);
            
            // Definir horas e minutos para a data do slot
            startDate.setHours(data.start.getHours(), data.start.getMinutes(), 0, 0);
            endDate.setHours(data.end.getHours(), data.end.getMinutes(), 0, 0);

            // ✅ VALIDAÇÃO: Verificar se horário final é após inicial
            const timeValidation = validateTimeRange(startDate, endDate);
            if (timeValidation !== true) {
                toast.error(timeValidation);
                return;
            }

            // ✅ PROCESSAMENTO: Converter participantes string para objeto
            let participantsObject = {};
            if (data.participants && data.participants.trim() !== '') {
                const emailList = data.participants.split(',').map(email => email.trim()).filter(email => email !== '');
                emailList.forEach((email, index) => {
                    participantsObject[`participant${index + 1}`] = email;
                });
            }

            const payload = {
                title: data.title,
                description: data.description || '',
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                lead: data.lead?._id || null,
                participants: participantsObject  // ✅ AGORA É UM OBJETO
            };

            createEventMutation.mutate(payload);
        } catch (error) {
            console.error('Erro ao processar formulário:', error);
            toast.error('Erro inesperado ao criar evento');
        }
    };

    const messages = {
        allDay: t('calendarPage.bigCalendar.allDay'), previous: t('calendarPage.bigCalendar.previous'), next: t('calendarPage.bigCalendar.next'), today: t('calendarPage.bigCalendar.today'), month: t('calendarPage.bigCalendar.month'), week: t('calendarPage.bigCalendar.week'), day: t('calendarPage.bigCalendar.day'), agenda: t('calendarPage.bigCalendar.agenda'), date: t('calendarPage.bigCalendar.date'), time: t('calendarPage.bigCalendar.time'), event: t('calendarPage.bigCalendar.event'), noEventsInRange: t('calendarPage.bigCalendar.noEventsInRange'), showMore: total => t('calendarPage.bigCalendar.showMore', { count: total })
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {/* CORREÇÃO: Paper do header com box shadow */}
            <Paper sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                // CORREÇÃO: Box shadow adicionado
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    : '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            }}>
                <Typography variant="h4" fontWeight="bold" color={theme.palette.text.primary}>
                    {t('calendarPage.title')}
                </Typography>
                <ShowcaseBlocker inline>
                    <GradientButton
                        startIcon={syncMutation.isLoading ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
                        onClick={() => syncMutation.mutate()}
                        disabled={syncMutation.isLoading}
                    >
                        {syncMutation.isLoading ? t('calendarPage.syncButton.loading') : t('calendarPage.syncButton.default')}
                    </GradientButton>
                </ShowcaseBlocker>
            </Paper>

            <StyledCalendarWrapper>
                <Box sx={{
                    height: '100%',
                    transition: 'filter 0.3s, opacity 0.3s',
                    filter: isGuestMode ? 'blur(4px)' : 'none',
                    opacity: isGuestMode ? 0.5 : 1,
                    pointerEvents: isGuestMode ? 'none' : 'auto'
                }}>
                    {isLoading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1 }} />}
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onNavigate={handleNavigate}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={handleSelectSlot}
                        selectable
                        messages={messages}
                        culture='pt-BR'
                    />
                </Box>
                {isGuestMode && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 10,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                        onClick={openModal}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            p: 3,
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            borderRadius: '50%',
                            boxShadow: theme.shadows[6]
                        }}>
                            <LockIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                        </Box>
                    </Box>
                )}
            </StyledCalendarWrapper>

            {/* CORREÇÃO: Modal do evento com cores corretas e box shadow */}
            <Modal open={!!selectedEvent} onClose={handleCloseModal}>
                <Card sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 450,
                    borderRadius: 3,
                    border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 45, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(15px)',
                    // CORREÇÃO: Box shadow adicionado
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 60px 0 rgba(0, 0, 0, 0.5)'
                        : '0 20px 60px 0 rgba(0, 0, 0, 0.2)',
                }}>
                    <CardHeader
                        action={
                            <IconButton onClick={handleCloseModal}>
                                <CloseIcon sx={{ color: theme.palette.text.primary }} />
                            </IconButton>
                        }
                        sx={{
                            background: theme.palette.custom?.gradients?.button || alpha(theme.palette.primary.main, 0.3),
                            py: 1.5,
                            px: 2,
                            '& .MuiCardHeader-title': {
                                color: theme.palette.primary.contrastText,
                                fontWeight: 'bold'
                            }
                        }}
                        title={t('calendarPage.eventModal.title')}
                    />
                    <CardContent sx={{ p: 3 }}>
                        {selectedEvent && (
                            <Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
                                    {selectedEvent.title}
                                </Typography>
                                <Stack spacing={1.5} mt={2}>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <CalendarTodayIcon sx={{ color: theme.palette.text.secondary }} />
                                        <Typography color={theme.palette.text.primary}>
                                            {format(selectedEvent.start, 'EEEE, dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <AccessTimeIcon sx={{ color: theme.palette.text.secondary }} />
                                        <Typography color={theme.palette.text.primary}>
                                            {`${format(selectedEvent.start, 'HH:mm')} - ${format(selectedEvent.end, 'HH:mm')}`}
                                        </Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={1.5}>
                                        <PersonIcon sx={{ color: theme.palette.text.secondary }} />
                                        <Typography color={theme.palette.text.primary}>
                                            {selectedEvent.resource.leadName}
                                        </Typography>
                                    </Box>
                                    {selectedEvent.resource.meetLink && (
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <VideocamIcon sx={{ color: theme.palette.text.secondary }} />
                                            <Button
                                                size="small"
                                                href={selectedEvent.resource.meetLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{
                                                    p: 0,
                                                    justifyContent: 'flex-start',
                                                    textTransform: 'none',
                                                    fontWeight: 'bold',
                                                    color: theme.palette.primary.main
                                                }}
                                            >
                                                {t('calendarPage.eventModal.meetButton')}
                                            </Button>
                                        </Box>
                                    )}
                                    {/* ✅ ATUALIZADO: Mostrar participantes como objeto no modal de visualização */}
                                    {selectedEvent.resource.participants && Object.keys(selectedEvent.resource.participants).length > 0 && (
                                        <Box display="flex" alignItems="flex-start" gap={1.5}>
                                            <PersonIcon sx={{ color: theme.palette.text.secondary, mt: 0.5 }} />
                                            <Box>
                                                <Typography variant="body2" color={theme.palette.text.primary} fontWeight="medium">
                                                    Participantes:
                                                </Typography>
                                                <Typography variant="body2" color={theme.palette.text.secondary}>
                                                    {Object.values(selectedEvent.resource.participants).join(', ')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                                    <Chip
                                        label={selectedEvent.resource.crm}
                                        color="secondary"
                                        variant="outlined"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                                        }}
                                    />
                                    {selectedEvent.resource.leadId && (
                                        <Button
                                            size="small"
                                            endIcon={<OpenInNewIcon />}
                                            onClick={() => isGuestMode ? openModal() : navigate('/app/leads', { state: { leadName: selectedEvent.resource.leadName } })}
                                            sx={{ color: theme.palette.text.primary }}
                                        >
                                            {t('calendarPage.eventModal.viewLeadButton')}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Modal>

            <StyledDialog open={createModalOpen} onClose={handleCloseCreateModal} fullWidth maxWidth="sm">
                <form onSubmit={handleSubmit(onSubmitCreateEvent)}>
                    <DialogTitle sx={{ color: theme.palette.text.primary }}>
                        {t('calendarPage.createModal.title')}
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Controller
                                name="title"
                                control={control}
                                rules={{ required: t('calendarPage.createModal.titleRequired') }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label={t('calendarPage.createModal.titleLabel')}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        sx={{
                                            '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            },
                                            '& .MuiInputBase-input': { color: theme.palette.text.primary },
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label={t('calendarPage.createModal.descriptionLabel')}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        sx={{
                                            '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            },
                                            '& .MuiInputBase-input': { color: theme.palette.text.primary },
                                        }}
                                    />
                                )}
                            />

                            {/* ✅ ATUALIZADO: Campo participantes com validação */}
                            <Controller
                                name="participants"
                                control={control}
                                rules={{ validate: validateEmails }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label="Participantes (emails)"
                                        placeholder="email1@exemplo.com, email2@empresa.com"
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message || "Separe múltiplos emails por vírgula"}
                                        sx={{
                                            '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                                '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                            },
                                            '& .MuiInputBase-input': { color: theme.palette.text.primary },
                                        }}
                                    />
                                )}
                            />

                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Controller
                                        name="start"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="time"
                                                label={t('calendarPage.createModal.startTimeLabel')}
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                value={format(field.value, 'HH:mm')}
                                                onChange={(e) => {
                                                    const [h, m] = e.target.value.split(':');
                                                    const newDate = new Date(field.value);
                                                    newDate.setHours(parseInt(h), parseInt(m));
                                                    field.onChange(newDate);
                                                }}
                                                sx={{
                                                    '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                    },
                                                    '& .MuiInputBase-input': { color: theme.palette.text.primary },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="end"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="time"
                                                label={t('calendarPage.createModal.endTimeLabel')}
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                value={format(field.value, 'HH:mm')}
                                                onChange={(e) => {
                                                    const [h, m] = e.target.value.split(':');
                                                    const newDate = new Date(field.value);
                                                    newDate.setHours(parseInt(h), parseInt(m));
                                                    field.onChange(newDate);
                                                }}
                                                sx={{
                                                    '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                    },
                                                    '& .MuiInputBase-input': { color: theme.palette.text.primary },
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Controller
                                name="lead"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        options={leads}
                                        getOptionLabel={(option) => `${option.name} (${option.company})`}
                                        isOptionEqualToValue={(option, value) => option._id === value._id}
                                        onChange={(_, data) => field.onChange(data)}
                                        loading={isLoadingLeads}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label={t('calendarPage.createModal.linkLeadLabel')}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>{isLoadingLeads ? <CircularProgress color="inherit" size={20} /> : null}{params.InputProps.endAdornment}</>
                                                    )
                                                }}
                                                sx={{
                                                    '& .MuiInputLabel-root': { color: theme.palette.text.primary },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': { borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)' },
                                                        '&:hover fieldset': { borderColor: theme.palette.primary.main },
                                                        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                                                    },
                                                    '& .MuiInputBase-input': { color: theme.palette.text.primary },
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button
                            onClick={handleCloseCreateModal}
                            color="inherit"
                            sx={{ color: theme.palette.text.secondary }}
                        >
                            {t('calendarPage.createModal.cancelButton')}
                        </Button>
                        <GradientButton 
                            type="submit" 
                            loading={createEventMutation.isLoading}
                            disabled={createEventMutation.isLoading}
                        >
                            {createEventMutation.isLoading ? 'Criando...' : t('calendarPage.createModal.saveButton')}
                        </GradientButton>
                    </DialogActions>
                </form>
            </StyledDialog>
        </Box>
    );
}