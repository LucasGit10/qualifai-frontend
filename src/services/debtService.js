import api from './api';

const debtService = {
  createDebt: (data) => api.post('/debts', data),
  getDebtDetails: (id) => api.get(`/debts/${id}`),
  getDebtByLead: (leadId) => api.get(`/debts/lead/${leadId}`),
  processPayment: (data) => api.post('/debts/payment', data),
  addGuarantor: (data) => api.post('/debts/guarantor', data),
  importDebts: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/debts/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default debtService;
