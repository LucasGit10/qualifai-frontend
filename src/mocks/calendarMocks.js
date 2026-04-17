// Mock data for Calendar (Agendas)
import { addDays, subDays, startOfHour, addHours } from 'date-fns';

export const MOCK_CALENDAR_EVENTS = [
  { 
    id: 'e1', 
    title: 'Reunião com Tech Solutions', 
    start: startOfHour(addHours(new Date(), 2)), 
    end: startOfHour(addHours(new Date(), 3)), 
    resource: { 
      leadName: 'Ana Silva', 
      crm: 'HubSpot',
      meetLink: 'https://meet.google.com/abc-defg-hij',
      participants: { p1: 'ana.silva@techsolutions.com', p2: 'contato@qualifai.tech' }
    } 
  },
  { 
    id: 'e2', 
    title: 'Follow-up Market Growth', 
    start: addDays(startOfHour(addHours(new Date(), 1)), 1), 
    end: addDays(startOfHour(addHours(new Date(), 2)), 1), 
    resource: { 
      leadName: 'Carla Dias', 
      crm: 'Pipedrive',
      participants: { p1: 'carla.dias@marketgrowth.com' }
    } 
  },
  { 
    id: 'e3', 
    title: 'Demo para CloudFast', 
    start: subDays(startOfHour(addHours(new Date(), 4)), 1), 
    end: subDays(startOfHour(addHours(new Date(), 5)), 1), 
    resource: { 
      leadName: 'Gabriela Mota', 
      crm: 'Kommo',
      meetLink: 'https://zoom.us/j/123456789'
    } 
  }
];

export const MOCK_LEADS_LIST = [
  { _id: 'l1', name: 'Ana Silva', company: 'Tech Solutions' },
  { _id: 'l2', name: 'Bruno Costa', company: 'Inova Corp' },
  { _id: 'l3', name: 'Carla Dias', company: 'Market Growth' },
  { _id: 'l4', name: 'Daniel Alves', company: 'Future Systems' }
];
