import React, { useState } from 'react';
import { Box, Container, Typography, IconButton, Avatar } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, FormatQuote } from '@mui/icons-material';
import { motion } from 'framer-motion';
// import { useTranslation } from 'react-i18next'; // <-- COMENTADO: Não vamos usar i18n

// --- MOCK DE DADOS INLINE ---
const mockData = {
    // Título (A chave 'subtitle' do JSON)
    subtitle: "De agendas vazias a pipelines de vendas previsíveis",
    
    // Array de depoimentos (A chave 'testimonials' do JSON)
    testimonials: [
        {
            "name": "Ana Silva",
            "role": "Nexora Solutions",
            "quote": "A QualifAI transformou nossa geração de leads. A qualificação é impecável e a comunicação da IA é surpreendentemente humana. Nossas agendas nunca estiveram tão cheias!",
            "avatar": "image-carousel-3.jpg"
        },
        {
            "name": "Bruno Costa",
            "role": "Diretor de Vendas - Grupo Horizonte Azul",
            "quote": "Estávamos perdendo tempo com leads desqualificados. Com a QualifAI, nossa equipe foca apenas no que realmente importa, aumentando a conversão em 40%.",
            "avatar": "image-carousel-4.png"
        },
        {
            "name": "Diego Mendes",
            "role": "Gerente de Vendas - Trevoo",
            "quote": "O suporte 24/7 da IA é uma vantagem enorme. Não perdemos mais oportunidades, mesmo fora do horário comercial. É como ter um SDR extra sempre ativo.",
            "avatar": "image-carousel-2.jpg"
        },
        {
            "name": "Diego Pereira",
            "role": "Empreendedor - Luminec Systems",
            "quote": "A integração com nosso CRM e Google Calendar é fantástica. Tudo funciona automaticamente, liberando nossa equipe para focar na estratégia e no fechamento de negócios.",
            "avatar": "image-carousel.jpg"
        }
    ]
};

const FeaturesCarousel = () => {
    // 1. Dados vêm diretamente do mock, garantindo que 'testimonials' é um array.
    const testimonials = mockData.testimonials; 
    const subtitle = mockData.subtitle; // Para o título

    const [currentIndex, setCurrentIndex] = useState(0);

    // 2. Não há mais 'if (!ready)', pois os dados são síncronos e garantidos.
    // O fallback de array vazio não é necessário, mas podemos adicioná-lo por extrema segurança.
    if (!Array.isArray(testimonials) || testimonials.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ my: 12, textAlign: 'center', minHeight: '500px' }}>
                <Typography 
                    variant="h5" 
                    sx={{ color: '#0F0C29', fontWeight: 500 }}
                >
                    Erro: Dados de depoimentos não disponíveis.
                </Typography>
            </Container>
        );
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <Container maxWidth="lg" sx={{ my: 12, textAlign: 'center' }}>
            
            <Typography 
                variant="h4" 
                component="h4" 
                sx={{ fontWeight: 600, color: '#0F0C29', mb: 10 }}
                // Usando o mock de 'subtitle'
                dangerouslySetInnerHTML={{ __html: subtitle }} 
            />

            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                
                {/* Mapeamento de 'testimonials' que é garantido de ser um array */}
                {testimonials.map((testimonial, index) => {
                    const isCenter = index === currentIndex;
                    const isLeft = index === (currentIndex - 1 + testimonials.length) % testimonials.length;
                    const isRight = index === (currentIndex + 1) % testimonials.length;
                    
                    let x = '0%';
                    if(isLeft) x = '-50%';
                    if(isRight) x = '50%';
                    if(!isCenter && !isLeft && !isRight) x = index - currentIndex > 0 ? '100%' : '-100%';

                    return (
                        <motion.div
                            key={testimonial.name}
                            animate={{
                                x: x,
                                scale: isCenter ? 1 : 0.8,
                                opacity: isCenter || isLeft || isRight ? 1 : 0,
                                zIndex: isCenter ? 2 : 1,
                                filter: isCenter ? 'blur(0px)' : 'blur(8px)',
                            }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            style={{
                                position: isCenter ? 'relative' : 'absolute',
                                width: '85%',
                                maxWidth: '600px',
                                minHeight: '450px',
                                borderRadius: '24px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                boxShadow: '0 8px 40px 0 rgba(0, 0, 0, 0.15)',
                                background: isCenter
                                    ? 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, rgba(115,86,252,0.3) 100%)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(15px)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '48px',
                                textAlign: 'center',
                            }}
                        >
                            <Avatar
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                sx={{ width: 120, height: 120, mb: 2, border: '4px solid #7356FC' }}
                            />
                            <Typography variant="h5" component="h3" sx={{ fontWeight: 600, color: '#0F0C29', mb: 0.5 }}>
                                {testimonial.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#5c16acff' }}>
                                {testimonial.role}
                            </Typography>
                            
                            <Box sx={{ width: '100%', mt: 3, textAlign: 'left' }}>
                                <FormatQuote sx={{ fontSize: '4rem', color: '#48287D' }} />
                                <Typography variant="body1" sx={{ color: '#0F0C29', fontSize: '1.15rem', lineHeight: 1.6, mt: 1 }}>
                                    {testimonial.quote}
                                </Typography>
                            </Box>
                        </motion.div>
                    );
                })}
                 
                <IconButton onClick={handlePrev} sx={{ 
                    position: 'absolute', 
                    left: -60, 
                    zIndex: 3, 
                    backgroundColor: '#7356FC', 
                    '&:hover': { backgroundColor: 'rgba(167, 118, 231, 0.8)' }, 
                    p: 2,
                    display: { xs: 'none', md: 'inline-flex' }
                }}>
                    <ArrowBackIosNew fontSize="large" sx={{ color: '#fdfdfdff' }} />
                </IconButton>
                <IconButton onClick={handleNext} sx={{ 
                    position: 'absolute', 
                    right: -60, 
                    zIndex: 3, 
                    backgroundColor: '#7356FC', 
                    '&:hover': { backgroundColor: 'rgba(167, 118, 231, 0.8)' }, 
                    p: 2,
                    display: { xs: 'none', md: 'inline-flex' }
                }}>
                    <ArrowForwardIos fontSize="large" sx={{ color: '#fdfdfdff' }} />
                </IconButton>
            </Box>

            <Box 
                sx={{ 
                    display: { xs: 'flex', md: 'none' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: 4,
                    gap: 4,
                }}
            >
                <IconButton onClick={handlePrev} sx={{ backgroundColor: '#7356FC', '&:hover': { backgroundColor: 'rgba(167, 118, 231, 0.8)' }, p: 2 }}>
                    <ArrowBackIosNew fontSize="large" sx={{ color: '#fdfdfdff' }} />
                </IconButton>
                <IconButton onClick={handleNext} sx={{ backgroundColor: '#7356FC', '&:hover': { backgroundColor: 'rgba(167, 118, 231, 0.8)' }, p: 2 }}>
                    <ArrowForwardIos fontSize="large" sx={{ color: '#fdfdfdff' }} />
                </IconButton>
            </Box>

        </Container>
    );
};

export default FeaturesCarousel;