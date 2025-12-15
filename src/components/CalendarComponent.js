import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  format,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isBefore,
  isToday,
  isSameMonth,
} from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale'; // Importe os locales de data necessários
import { useTranslation } from 'react-i18next'; // Importe o hook de tradução

// Mapeia os códigos de idioma do i18next para os objetos de locale do date-fns
const locales = {
  pt: ptBR,
  en: enUS,
};

const CalendarComponent = ({
  currentMonth,
  selectedDate,
  handleDateSelect,
  handlePrevMonth,
  handleNextMonth,
}) => {
  const { t, i18n } = useTranslation(); // Use o hook para obter a função t e a instância i18n
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Pega o locale de data correspondente ao idioma ativo no i18next
  const currentLocale = locales[i18n.language] || ptBR;
  
  // Busca a lista de dias da semana traduzida do arquivo JSON
  const daysOfWeek = t('contactSection.calendar.daysOfWeek', { returnObjects: true });

  const monthDate = new Date(currentMonth);
  if (isNaN(monthDate)) {
    console.error("Data inválida recebida pelo CalendarComponent:", currentMonth);
    return <Box>{t('contactSection.calendar.invalidDateError')}</Box>;
  }

  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const startDay = getDay(monthStart);

  const startOffset = startDay === 0 ? 6 : startDay - 1;
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const days = [...Array(startOffset).fill(null), ...daysInMonth];
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <motion.div
      key="calendar"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      style={{ position: 'relative' }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: { xs: '30%', sm: '25%' },
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          width: { xs: '64px', sm: '72px' },
          height: { xs: '64px', sm: '72px' },
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/icons/Frame 6 (2).svg" 
          alt="Ícone decorativo"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '25%', sm: '30%' },
          right: 0,
          transform: 'translate(50%, 50%)',
          zIndex: 1,
          width: { xs: '50px', sm: '60px' },
          height: { xs: '50px', sm: '60px' },
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/icons/Frame 7.svg" 
          alt="Ícone decorativo 2"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          background: 'linear-gradient(to bottom, rgba(246, 244, 255, 0.5), rgba(233, 193, 255, 0.5), rgba(115, 86, 252, 0.5), rgba(72, 40, 125, 0.6))',
          backdropFilter: 'blur(2px)',
          borderRadius: 4,
          p: { xs: 2, sm: 4, md: 6 },
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            px: { xs: 1, sm: 2, md: 0 },
          }}
        >
          <Typography
            variant={isSmallScreen ? 'h6' : 'h5'}
            component="h3"
            sx={{
              fontWeight: 700,
              color: '#3A1C6E',
              textTransform: 'capitalize',
              letterSpacing: '1px',
              px: 1,
              textShadow: '0 1px 3px rgba(255,255,255,0.9)',
            }}
          >
            {format(monthDate, 'MMMM yyyy', { locale: currentLocale })}
          </Typography>

          <Box sx={{ display: 'flex' }}>
            <IconButton
              onClick={handlePrevMonth}
              sx={{
                color: '#3A1C6E',
                '&:hover': {
                  color: '#1A60C0',
                  backgroundColor: 'rgba(58, 28, 110, 0.1)',
                },
              }}
              size={isSmallScreen ? 'medium' : 'small'}
            >
              <ChevronLeft fontSize={isSmallScreen ? 'medium' : 'small'} />
            </IconButton>
            <IconButton
              onClick={handleNextMonth}
              sx={{
                color: '#3A1C6E',
                '&:hover': {
                  color: '#1A60C0',
                  backgroundColor: 'rgba(41, 16, 82, 0.1)',
                },
              }}
              size={isSmallScreen ? 'medium' : 'small'}
            >
              <ChevronRight fontSize={isSmallScreen ? 'medium' : 'small'} />
            </IconButton>
          </Box>
        </Box>

        <Table
          size="small"
          sx={{
            width: '100%',
            tableLayout: 'fixed',
            borderCollapse: 'collapse', 
            '& td, & th': {
              border: 'none',
              textAlign: 'center',
            },
          }}
        >
          <TableHead>
            <TableRow>
              {daysOfWeek.map((day) => (
                <TableCell
                  key={day}
                  sx={{
                    fontWeight: 600,
                    color: '#3A1C6E',
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.65rem', sm: '0.85rem' },
                    pb: 2,
                  }}
                >
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {weeks.map((week, weekIndex) => (
              <TableRow key={weekIndex}>
                {week.map((day, dayIndex) => {
                  if (!day) {
                    return <TableCell key={`empty-${weekIndex}-${dayIndex}`} />;
                  }

                  const isPastDate = isBefore(day, new Date()) && !isToday(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentDay = isToday(day);
                  const canSelect = !isPastDate && (isSameMonth(day, monthDate) || !isSmallScreen);

                  return (
                    <TableCell
                      key={day.getTime()}
                      sx={{
                        padding: { xs: '8px 0', sm: '16px 0' },
                      }}
                    >
                      <Box
                        onClick={() => canSelect && handleDateSelect(day)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: { xs: '28px', sm: '44px' },
                          width: { xs: '28px', sm: '44px' },
                          mx: 'auto',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #3A1C6E' : '2px solid rgba(58, 28, 110, 0.3)',
                          transition: 'all 0.3s ease',
                          cursor: canSelect ? 'pointer' : 'default',
                          backgroundColor: isSelected
                            ? '#3A1C6E'
                            : isCurrentDay
                            ? 'rgba(58, 28, 110, 0.15)'
                            : 'transparent',
                          '&:hover': {
                            backgroundColor: canSelect && !isSelected
                              ? 'rgba(58, 28, 110, 0.1)'
                              : undefined,
                            transform: canSelect && !isSelected ? 'scale(1.05)' : undefined,
                          },
                          opacity: isPastDate ? 0.5 : 1,
                        }}
                      >
                        <Typography
                          component="span"
                          sx={{
                            color: isSelected
                              ? '#FFFFFF'
                              : isPastDate
                              ? 'rgba(0, 0, 0, 0.5)'
                              : '#000000',
                            fontWeight: isSelected ? 700 : isCurrentDay ? 600 : 500,
                            fontSize: { xs: '0.65rem', sm: '0.9rem' },
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>
                        {isCurrentDay && !isSelected && (
                          <Box
                            component="span"
                            sx={{
                              position: 'absolute',
                              bottom: '2px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              bgcolor: '#3A1C6E',
                            }}
                          />
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </motion.div>
  );
};

export default CalendarComponent;