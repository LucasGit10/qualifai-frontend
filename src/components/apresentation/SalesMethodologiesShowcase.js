import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// --- DIÁLOGOS COM MODOS DE FALA E CAMINHO DA IMAGEM ---
// NOTA: A estrutura foi simplificada para conter apenas o texto 'normal'.
const conversationScripts = {
  SPICE: {
    name: "SPICE",
    imagePath: '/apimentado.png',
    color: "#33A1FF",
    explanation: "Mapeia a Situação, a Dor, o Impacto financeiro, o Evento Crítico (o que acontece se nada for feito) e os critérios de Avaliação do sucesso.",
    chat: [
      { sender: 'ai', text: "Analisando seu fluxo de trabalho, qual tarefa mais consome tempo da equipe?" },
      { sender: 'lead', text: "A geração de relatórios mensais. É uma dor de cabeça." },
      { sender: 'ai', text: "Vamos quantificar o impacto disso. Quantas horas de trabalho são gastas nesses relatórios?" },
      { sender: 'lead', text: "Facilmente umas 80 horas por mês, um custo operacional significativo." },
      { sender: 'ai', text: "Certo. E qual o evento crítico se nada mudar e a demanda dobrar no próximo trimestre?" },
      { sender: 'lead', text: "A equipe não daria conta, a qualidade dos dados cairia e afetaria nossas decisões." },
      { sender: 'ai', text: "Ok. E como vocês avaliariam o sucesso de uma nova solução para isso?" },
      { sender: 'lead', text: "Se conseguirmos gerar relatórios precisos em menos de 5 minutos, seria uma vitória." },
      { sender: 'ai', text: "Métricas claras. Análise concluída: Lead qualificado via SPICE.", final: true },
    ]
  },
  SPIN: {
    name: "SPIN Selling",
    imagePath: '/spin.png',
    color: "#56cdfcff",
    explanation: "Focada em fazer as perguntas certas para guiar o cliente à solução, explorando a Situação, Problema, Implicação e Necessidade.",
    chat: [
      { sender: 'ai', text: "Olá! Para entendermos seu cenário, pode me descrever seu processo de vendas atual?" },
      { sender: 'lead', text: "Claro. É bastante manual, usamos planilhas para quase tudo." },
      { sender: 'ai', text: "Entendo. E qual o maior desafio que esse processo manual gera para vocês?" },
      { sender: 'lead', text: "O ciclo de vendas é muito longo. Levamos semanas para qualificar um lead." },
      { sender: 'ai', text: "Imagino o impacto disso. Essa lentidão já fez vocês perderem negócios para concorrentes?" },
      { sender: 'lead', text: "Sim, várias vezes. É frustrante." },
      { sender: 'ai', text: "Então, uma solução que automatize tarefas e acelere o ciclo seria a prioridade para vocês?" },
      { sender: 'lead', text: "Com certeza! Seria exatamente o que precisamos." },
      { sender: 'ai', text: "Perfeito. Análise concluída: Lead qualificado via SPIN.", final: true },
    ]
  },
  BANT: {
    name: "BANT",
    imagePath: '/bandiit.png',
    color: "#38dcc1ff, #f78706ff, #f1e31dff",
    explanation: "Framework de qualificação rápida para focar nos leads com maior potencial, validando Orçamento, Autoridade, Necessidade e Prazo.",
    chat: [
      { sender: 'ai', text: "Para sermos eficientes, vamos validar alguns pontos. Vocês têm um orçamento definido para novas ferramentas?" },
      { sender: 'lead', text: "Sim, temos um budget aprovado de até $15k para a ferramenta certa." },
      { sender: 'ai', text: "Ótimo. E quem mais está envolvido na decisão final de compra?" },
      { sender: 'lead', text: "Eu faço a avaliação, mas a Diretora de Vendas dá a aprovação final." },
      { sender: 'ai', text: "Entendido. A necessidade principal é aumentar a produtividade da equipe, correto?" },
      { sender: 'lead', text: "Exato. Menos tempo em tarefas administrativas, mais tempo vendendo." },
      { sender: 'ai', text: "E qual o prazo para ter essa solução implementada e gerando resultados?" },
      { sender: 'lead', text: "Idealmente, gostaríamos de começar no próximo trimestre." },
      { sender: 'ai', text: "Excelente. Análise concluída: Lead qualificado via BANT.", final: true },
    ]
  },
  MEDDIC: {
    name: "MEDDIC",
    imagePath: '/MEDDIC CORRIGIDO.png',
    color: "#56cdfcff, #b82da0ff",
    explanation: "Ideal para vendas complexas B2B, garantindo uma qualificação profunda ao analisar Métricas, Decisor Econômico, Critérios, Dor e um Defensor interno.",
    chat: [
      { sender: 'ai', text: "Iniciando análise aprofundada. Qual métrica de negócio (KPI) vocês mais precisam impactar agora?" },
      { sender: 'lead', text: "Precisamos diminuir nosso Custo de Aquisição de Clientes (CAC) em 20%." },
      { sender: 'ai', text: "Uma meta clara. Quem é o decisor econômico que aprova projetos com esse impacto?" },
      { sender: 'lead', text: "É o nosso CFO, ele aprova todos os investimentos acima de $20k." },
      { sender: 'ai', text: "Certo. E quais os critérios técnicos mais importantes para vocês?" },
      { sender: 'lead', text: "Integração com nosso CRM, segurança dos dados e um suporte ágil." },
      { sender: 'ai', text: "Anotado. E o que acontece se o CAC não diminuir? Qual é a dor real?" },
      { sender: 'lead', text: "Nossa margem de lucro será comprometida e teremos que cortar outros investimentos." },
      { sender: 'ai', text: "Compreendo a urgência. Análise concluída: Lead qualificado via MEDDIC.", final: true },
    ]
  },
  ADAPTIVE: {
    name: "Adaptativo (IA Mestra)",
    imagePath: '/QualifaiLogo.png',
    color: "#ff3381ff",
    explanation: "A IA demonstra sua capacidade de adaptar a metodologia em tempo real, combinando técnicas para qualificar o lead da forma mais eficiente possível.",
    chat: [
        { sender: 'ai', text: "Olá! Para entendermos seu cenário, pode me descrever seu processo de vendas atual?" },
        { sender: 'lead', text: "Claro. É bastante manual, usamos planilhas para quase tudo." },
        { sender: 'ai', text: "Entendo. E qual o maior desafio que esse processo manual gera para vocês?" },
        { sender: 'lead', text: "O ciclo de vendas é muito longo. Levamos semanas para qualificar um lead." },
        { sender: 'ai', text: "Percebo a urgência. Para sermos mais diretos, vocês já têm um orçamento definido para uma nova solução?" },
        { sender: 'lead', text: "Sim, temos um budget aprovado de até $15k para a ferramenta certa." },
        { sender: 'ai', text: "Ótimo. Note que mudei a abordagem para BANT para sermos mais eficientes. Quem mais participa da decisão final?" },
        { sender: 'lead', text: "Eu avalio, mas a Diretora de Vendas dá a aprovação final." },
        { sender: 'ai', text: "Perfeito. Análise concluída: Lead qualificado com sucesso usando uma abordagem adaptativa.", final: true },
    ]
  },
};

const TypingIndicator = () => <TypingBubble><span></span><span></span><span></span></TypingBubble>;

const AISalesShowcase = () => {
  const [methodologyIndex, setMethodologyIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  // const [aiMode, setAiMode] = useState('normal'); // <-- REMOVIDO
  const messageListRef = useRef(null);
  const timerRef = useRef(null);

  const loadedScripts = conversationScripts; 
  
  const methodologies = useMemo(() => Object.keys(loadedScripts), [loadedScripts]);

  const activeMethodologyKey = methodologies[methodologyIndex] || '';
  const activeScript = loadedScripts[activeMethodologyKey] || {};

  const activeColors = useMemo(() => activeScript.color ? activeScript.color.split(',').map(c => c.trim()) : ['#33A1FF'], [activeScript.color]);

  useEffect(() => {
    const hasValidData = methodologies.length > 0 && activeScript && Array.isArray(activeScript.chat);
    setIsReady(hasValidData); 
  }, [methodologies, activeScript]);
  
  const resetAndSwitchMethodology = (nextIndex) => {
      setCurrentStep(0);
      setChatHistory([]);
      setMethodologyIndex(nextIndex);
  };

  useEffect(() => {
    if (!isReady) return;

    clearTimeout(timerRef.current);

    const scriptChat = activeScript.chat;
    if (!scriptChat || scriptChat.length === 0) return;

    if (currentStep >= scriptChat.length) {
      timerRef.current = setTimeout(() => {
        const nextIndex = (methodologyIndex + 1) % methodologies.length;
        resetAndSwitchMethodology(nextIndex);
      }, 3000);
      return;
    }

    timerRef.current = setTimeout(() => {
      setChatHistory(prev => [...prev, scriptChat[currentStep]]);
      setCurrentStep(prev => prev + 1);
    }, 2000);

    return () => clearTimeout(timerRef.current);
  }, [currentStep, methodologyIndex, activeScript, isReady, methodologies.length]); 

  useEffect(() => {
    if (messageListRef.current) {
      const scrollTimer = setTimeout(() => {
          const { scrollHeight } = messageListRef.current;
          messageListRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(scrollTimer);
    }
  }, [chatHistory]);
  
  // handleModeChange REMOVIDO
  
  if (!isReady) {
    return (
      <ShowcaseCard>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          Erro: Dados de simulação não carregados.
        </div>
      </ShowcaseCard>
    );
  }

  const isFinished = currentStep >= activeScript.chat.length;
  let leadMessageCounter = 0;

  return (
    <ShowcaseCard>
      <InfoPanel>
        <AnimatePresence mode="wait">
          <InfoContent
            key={activeMethodologyKey}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <MainTitle>
              A nossa IA domina as principais metodologias
            </MainTitle>
            
            {/* ModeSelectorContainer REMOVIDO */}

            <MethodologyTitle isMeddic={activeMethodologyKey === 'MEDDIC'}>
              <img src={activeScript.imagePath} alt={`${activeScript.name} logo`} />
            </MethodologyTitle>

            <MethodologyExplanation>{activeScript.explanation}</MethodologyExplanation>
          </InfoContent>
        </AnimatePresence>
      </InfoPanel>
      <ChatPanel>
        <ChatWindow>
          <MessageList ref={messageListRef}>
            <AnimatePresence>
              {chatHistory.map((msg, index) => {
                let bubbleColor = activeColors[0];
                if (msg.sender === 'lead') {
                    if(activeColors.length > 1) {
                        bubbleColor = activeColors[leadMessageCounter % activeColors.length];
                        leadMessageCounter++;
                    }
                }
                const finalBubbleColor = activeColors[0];
                const backgroundColor = msg.sender === 'lead' ? bubbleColor : '#E9ECEF';
                
                // <-- LÓGICA DE SELEÇÃO DE TEXTO SIMPLIFICADA -->
                // Agora msg.text é sempre uma string
                const messageText = msg.text;

                return (
                  <MessageBubble
                    key={`${activeMethodologyKey}-${index}`}
                    $sender={msg.sender}
                    $isFinal={msg.final}
                    $finalColor={finalBubbleColor}
                    $backgroundColor={backgroundColor}
                    as={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {messageText}
                  </MessageBubble>
                );
              })}
            </AnimatePresence>
            {isFinished && (
                <TransitionMessage as={motion.div} initial={{opacity: 0}} animate={{opacity: 1}}>
                    Avançando... <TypingIndicator />
                </TransitionMessage>
            )}
          </MessageList>
        </ChatWindow>
      </ChatPanel>
      <ProgressBarContainer>
        {methodologies.map((key, index) => {
          const script = loadedScripts[key];
          if (!script) return null;
          
          return (
            <ProgressSegment key={key}>
              <ProgressBar
                as={motion.div}
                initial={{ width: '0%' }}
                animate={{ 
                  width: index < methodologyIndex ? '100%' : 
                         (index === methodologyIndex ? `${(currentStep / (script.chat?.length || 1)) * 100}%` : '0%') 
                }}
                transition={{ duration: 1.8, ease: "linear" }}
                $color={script.color || '#E9ECEF'}
              />
            </ProgressSegment>
          );
        })}
      </ProgressBarContainer>
    </ShowcaseCard>
  );
};

export default AISalesShowcase;


// --- ESTILOS (COM REMOÇÕES) ---

const ShowcaseCard = styled.div`
  display: flex;
  width: 100%;
  height: 550px;
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  font-family: '"Nunito Sans", sans-serif';
  border: 1px solid #E9ECEF;
  
  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    min-height: 800px;
  }
`;

const InfoPanel = styled.div`
  flex: 0.8; 
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  align-items: center; 
  
  @media (max-width: 900px) {
    padding: 30px; 
    flex-grow: 1;
    min-height: 0;
  }
`;

const InfoContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const MainTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1A0A3A;
  line-height: 1.3;
  margin-bottom: 20px;
  text-align: center;
  
  @media (max-width: 900px) {
    font-size: 1.5rem;
  }
`;

// -- ESTILOS DO SELETOR DE MODO REMOVIDOS --
// const ModeSelectorContainer = styled.div...
// const ModeButton = styled.button...

const MethodologyTitle = styled.h3`
  margin-bottom: 15px;
  /* Aumentei um pouco a altura para compensar o espaço do seletor removido */
  height: ${props => props.isMeddic ? '240px' : '220px'}; 
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; 

  img {
    max-width: 80%;
    max-height: 100%;
    object-fit: contain;
  }

  @media (max-width: 900px) {
    height: ${props => props.isMeddic ? '100px' : '90px'};
  }
`;

const MethodologyExplanation = styled.p`
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
  max-width: 400px;
  text-align: center;

  @media (max-width: 900px) {
    font-size: 0.9rem;
  }
`;

const ChatPanel = styled.div`
  flex: 1.2;
  padding: 20px;
  display: flex;
  background: #F8F9FA;
  height: 100%;

  @media (max-width: 900px) {
    flex: none; 
    height: 450px; 
    padding: 20px 15px;
    flex-shrink: 0;
  }
`;

const ChatWindow = styled.div`
  width: 100%;
  background: #FFFFFF;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #DEE2E6;
`;

const MessageList = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageBubble = styled.div`
  padding: 12px 18px;
  border-radius: 20px;
  max-width: 85%;
  line-height: 1.5;
  
  color: ${props => props.$isFinal ? props.$finalColor : (props.$sender === 'lead' ? '#FFFFFF' : '#212529')};
  background: ${props => props.$isFinal ? '#FFFFFF' : props.$backgroundColor};
  align-self: ${props => props.$sender === 'lead' ? 'flex-end' : 'flex-start'};
  font-weight: ${props => props.$isFinal ? '600' : '400'};
  
  border: 1px solid ${props => props.$isFinal ? props.$finalColor : 'transparent'};

  ${props => props.$sender === 'lead' ? 'border-bottom-right-radius: 5px;' : 'border-bottom-left-radius: 5px;'}
`;

const TransitionMessage = styled.div`
    color: #6c757d;
    font-style: italic;
    font-size: 0.9rem;
    align-self: center;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
`;

const typing = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
`;

const TypingBubble = styled.div`
    display: flex;
    span {
        width: 5px; height: 5px;
        border-radius: 50%;
        background-color: #6c757d;
        margin: 0 1px;
        animation: ${typing} 1s infinite ease-in-out;
        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
    }
`;

const ProgressBarContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: #E9ECEF;
    display: flex;
`;

const ProgressSegment = styled.div`
    flex: 1;
    height: 100%;
`;

const ProgressBar = styled.div`
    height: 100%;
    background: ${props => props.$color && props.$color.includes(',') 
        ? `linear-gradient(to right, ${props.$color})` 
        : props.$color};
`;