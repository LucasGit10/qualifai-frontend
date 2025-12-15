import { styled, keyframes } from '@mui/material/styles';
import { Box } from '@mui/material';

export const rotateNebula = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const float1 = keyframes`
  0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
  50% { transform: translate(30vw, -30vh) scale(1.5); opacity: 0.4; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
`;
export const float2 = keyframes`
  0% { transform: translate(0, 0) scale(1.2); opacity: 0.5; }
  50% { transform: translate(-25vw, 20vh) scale(0.8); opacity: 0.8; }
  100% { transform: translate(0, 0) scale(1.2); opacity: 0.5; }
`;
export const float3 = keyframes`
  0% { transform: translate(0, 0) scale(0.9); opacity: 0.6; }
  50% { transform: translate(20vw, 25vh) scale(1.3); opacity: 0.3; }
  100% { transform: translate(0, 0) scale(0.9); opacity: 0.6; }
`;

export const LightOrb = styled(Box)({
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(100px)',
  willChange: 'transform, opacity',
  mixBlendMode: 'screen',
});
