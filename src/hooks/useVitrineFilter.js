import { useState, useEffect } from 'react';

const solutionsMock = [
  { id: 1, name: "SalesFlow CRM", category: "Vendas", description: "CRM focado em automação e pipeline visual.", logo: "SF", color: "#3b82f6", tags: ["SaaS", "CRM"], rating: 4.8, reviews: 124, verified: true },
  { id: 2, name: "RocketGrowth", category: "Marketing", description: "Agência de Growth Hacking e tráfego pago B2B.", logo: "RG", color: "#a855f7", tags: ["Serviço", "Ads"], rating: 4.9, reviews: 85, verified: true },
  { id: 3, name: "ContaSimples ERP", category: "Finanças", description: "Gestão financeira completa para PMEs.", logo: "CS", color: "#10b981", tags: ["SaaS", "Fiscal"], rating: 4.5, reviews: 310, verified: false },
  { id: 4, name: "TalentMatch", category: "RH", description: "Recrutamento tech com testes automatizados.", logo: "TM", color: "#f43f5e", tags: ["SaaS", "Tech"], rating: 4.7, reviews: 56, verified: true },
  { id: 5, name: "CloudSecure IT", category: "TI", description: "Consultoria em segurança e LGPD.", logo: "CI", color: "#64748b", tags: ["Consultoria", "Sec"], rating: 5.0, reviews: 22, verified: true },
  { id: 6, name: "LeadGen Pro", category: "Vendas", description: "Ferramenta de enriquecimento de dados outbound.", logo: "LG", color: "#f59e0b", tags: ["SaaS", "Leads"], rating: 4.6, reviews: 190, verified: false },
];

export const categories = ['Todas', 'Vendas', 'Marketing', 'Finanças', 'RH', 'TI'];

export default function useVitrineFilter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [filteredData, setFilteredData] = useState(solutionsMock);
  const [selectedModels, setSelectedModels] = useState(['SaaS']);

  const handleToggleModel = (model) => {
    if (selectedModels.includes(model)) {
      setSelectedModels(prev => prev.filter(m => m !== model));
    } else {
      setSelectedModels(prev => [...prev, model]);
    }
  };

  const clearFilters = () => {
    setActiveCategory('Todas');
    setSearchTerm('');
    setSelectedModels([]);
  };

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = solutionsMock.filter(item => {
      const matchCategory = activeCategory === 'Todas' || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(lowerTerm) || 
                          item.description.toLowerCase().includes(lowerTerm) ||
                          item.tags.some(tag => tag.toLowerCase().includes(lowerTerm));
      
      return matchCategory && matchSearch;
    });
    setFilteredData(filtered);
  }, [searchTerm, activeCategory, selectedModels]);

  return {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    filteredData,
    selectedModels,
    handleToggleModel,
    clearFilters
  };
}