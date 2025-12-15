import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Card, useTheme, Box, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from '@mui/icons-material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const QualifApresentation = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const timelineRef = useRef(null);

  const cards = t('plansApresentation.cards', { returnObjects: true }) ?? [];

  const displayedCards = useMemo(() =>
    Array.isArray(cards) ? cards : [],
    [cards]
  );

  useEffect(() => {
    if (!displayedCards.length || !sectionRef.current) return;

    const section = sectionRef.current;
    const cardsElements = cardsRef.current.filter(Boolean);
    if (cardsElements.length === 0) return;

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const MOBILE_CONFIG = {
      scrollDuration: isMobile ? 600 : 1000, 
      stackOffset: isMobile ? 20 : 40, 
      scaleReduction: isMobile ? 0.04 : 0.08, 
      animationDuration: isMobile ? 0.6 : 1, 
      exitY: isMobile ? -60 : -100, 
      finalExitY: isMobile ? -80 : -150, 
      finalScale: isMobile ? 0.85 : 0.7 
    };

    cardsElements.forEach((card, index) => {
      gsap.set(card, {
        y: index * MOBILE_CONFIG.stackOffset,
        scale: 1 - (index * MOBILE_CONFIG.scaleReduction),
        opacity: index === 0 ? 1 : 0.4,
        zIndex: cardsElements.length - index,
        rotationX: isMobile ? -5 : -10, 
        filter: `brightness(${1 - (index * 0.3)})`
      });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        start: 'top top',
        end: `+=${displayedCards.length * MOBILE_CONFIG.scrollDuration}`,
        scrub: isMobile ? 0.8 : 1, 
        anticipatePin: 1,
        markers: false,
        id: 'cards-stacking-timeline',
        fastScrollEnd: isMobile, 
        ignoreMobileResize: isMobile,
        snap: {
          snapTo: "labels",
          duration: {
            min: isMobile ? 0.1 : 0.2,
            max: isMobile ? 0.6 : 1
          },
          delay: isMobile ? 0.05 : 0.1, 
          ease: "power1.inOut"
        }
      }
    });

    displayedCards.forEach((_, index) => {
      if (index === 0) {
        tl.addLabel(`card-${index}-start`);
      } else {
        const previousCard = cardsElements[index - 1];
        const currentCard = cardsElements[index];

        tl.to(previousCard, {
          duration: MOBILE_CONFIG.animationDuration,
          y: MOBILE_CONFIG.exitY,
          opacity: 0,
          scale: isMobile ? 0.9 : 0.8,
          rotationX: isMobile ? 5 : 10, 
          filter: 'brightness(0.5)',
          ease: "power2.in"
        }, `card-${index}-start`)

          .to(currentCard, {
            duration: MOBILE_CONFIG.animationDuration,
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            filter: 'brightness(1)',
            ease: "power2.out"
          }, `card-${index}-start`)

          .addLabel(`card-${index}-end`);
      }
    });

    timelineRef.current = tl;

    if (displayedCards.length > 1) {
      const lastCard = cardsElements[displayedCards.length - 1];
      gsap.to(lastCard, {
        y: MOBILE_CONFIG.finalExitY, 
        opacity: 0,
        scale: MOBILE_CONFIG.finalScale,
        scrollTrigger: {
          trigger: section,
          start: `+=${(displayedCards.length - 1) * MOBILE_CONFIG.scrollDuration}`,
          end: `+=${displayedCards.length * MOBILE_CONFIG.scrollDuration}`,
          scrub: isMobile ? 0.8 : 1, 
        }
      });
    }

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [displayedCards, isMobile]); 

  const setCardRef = (el, index) => {
    if (el) {
      cardsRef.current[index] = el;
    }
  };

  return (
    <Box
      ref={sectionRef}
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1600px',
          height: { xs: '600px', md: '700px' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {displayedCards.map((card, index) => (
          <Card
            key={card.id || card.title}
            ref={el => setCardRef(el, index)}
            sx={{
              width: { xs: '95%', md: '98%' },
              maxWidth: { xs: '400px', md: '1300px' },
              height: { xs: '450px', md: '600px' },
              p: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 2, md: 3 },
              borderRadius: 3,
              background: "url('/qualif_card_background_v4.png') no-repeat center/cover",
              border: `2px solid ${theme.palette.primary.main}30`,
              boxShadow: {
                xs: '0 10px 30px rgba(0, 0, 0, 0.15)',
                md: '0 20px 40px rgba(0, 0, 0, 0.2)'
              },
              position: 'absolute',
              overflow: 'hidden',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 3 } }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }}
              >
                {card.title}
              </Typography>
            </Box>

            <Box
              component="ul"
              sx={{
                m: 0,
                pl: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 1.5, md: 2 },
                flex: 1,
                overflowY: 'auto',
                pr: 1,
              }}
            >
              {card.features?.map((feature, featureIndex) => (
                <Box
                  component="li"
                  key={featureIndex}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: { xs: 2, md: 2.5 },
                    p: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.action.hover}15, ${theme.palette.action.selected}15)`,
                    border: `1px solid ${theme.palette.divider}20`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.action.hover}25, ${theme.palette.action.selected}25)`,
                      transform: { xs: 'none', md: 'translateX(4px)' },
                    }
                  }}
                >
                  <CheckCircle
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: { xs: 20, md: 24 },
                      mt: 0.1,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.primary,
                      lineHeight: 1.5,
                      fontSize: { xs: '0.85rem', md: '1.1rem' },
                      fontWeight: 500,
                    }}
                  >
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default QualifApresentation;