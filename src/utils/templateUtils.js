export const formatTemplateNameForDisplay = (name) => {
  if (!name) return '';
  return name.split('_v')[0];
};

export const applyNameMask = (value) => {
  if (!value) return '';
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};