import { styled, alpha } from '@mui/material/styles';
import { Paper } from '@mui/material';

const StyledCard = styled(Paper, { shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'variant',})(({ theme, isDragging, variant }) => ({
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-start',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px',
    border: `1px solid transparent`,

    ...(variant === 'default' && {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1.5),
        fontSize: '1rem',
        boxShadow: theme.shadows[1],
        borderColor: alpha(theme.palette.divider, 0.1),
        '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
            borderColor: alpha(theme.palette.primary.main, 0.3),
        },
    }),

    ...(variant === 'compact' && {
        padding: theme.spacing(1.5),
        marginBottom: theme.spacing(1),
        fontSize: '0.9rem',
        boxShadow: theme.shadows[1],
        borderColor: alpha(theme.palette.divider, 0.1),
        '&:hover': {
            boxShadow: theme.shadows[3],
            transform: 'translateY(-1px)',
            borderColor: alpha(theme.palette.primary.main, 0.2),
        },
    }),

    ...(variant === 'outlined' && {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1.5),
        fontSize: '1rem',
        boxShadow: 'none',
        borderColor: theme.palette.divider,
        '&:hover': {
            boxShadow: theme.shadows[2],
            borderColor: theme.palette.primary.main,
        },
    }),

    ...(variant === 'disabled' && {
        opacity: 0.6,
        cursor: 'not-allowed',
        boxShadow: 'none',
        borderColor: theme.palette.divider,
        '&:hover': {}, 
    }),

    ...(isDragging && {
        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
        transform: 'rotate(2deg)',
        opacity: 0.95,
        cursor: 'grabbing',
    }),
}));

const Card = ({ children, isDragging = false, variant = 'default', sx, ...props }) => {
    return (
        <StyledCard elevation={0} isDragging={isDragging} variant={variant} sx={sx} {...props}>
            {children}
        </StyledCard>
    );
};

export default Card;