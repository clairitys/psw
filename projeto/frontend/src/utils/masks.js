// Frontend utility para máscaras de formulário
// Exemplos de uso:
// maskUsername(value) → remove espaços e caracteres especiais
// maskPhone(value) → (XX) XXXXX-XXXX
// maskCPF(value) → XXX.XXX.XXX-XX

export const maskUsername = (value) => {
  if (!value) return '';
  // Remove espaços e caracteres especiais, apenas alfanuméricos e underscore
  return value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase().substring(0, 20);
};

export const maskEmail = (value) => {
  if (!value) return '';
  // Remove espaços apenas
  return value.trim().toLowerCase();
};

export const maskName = (value) => {
  if (!value) return '';
  // Remove números e caracteres especiais, apenas letras e espaços
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').substring(0, 100);
};

export const maskPhone = (value) => {
  if (!value) return '';
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Formata como (XX) XXXXX-XXXX
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

export const maskCPF = (value) => {
  if (!value) return '';
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Formata como XXX.XXX.XXX-XX
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }
};

export const maskBio = (value) => {
  if (!value) return '';
  // Limita a 500 caracteres
  return value.substring(0, 500);
};

export const maskPassword = (value) => {
  // Password não precisa de máscara, apenas devolver como é
  return value;
};

export const maskAlbumTitle = (value) => {
  if (!value) return '';
  // Limita a 100 caracteres
  return value.substring(0, 100);
};

export const maskComment = (value) => {
  if (!value) return '';
  // Limita a 500 caracteres
  return value.substring(0, 500);
};

export const maskGenreDescription = (value) => {
  if (!value) return '';
  // Limita a 200 caracteres
  return value.substring(0, 200);
};

export const maskArtistName = (value) => {
  if (!value) return '';
  // Remove números e caracteres especiais, apenas letras e espaços
  return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').substring(0, 100);
};

// Máscara genérica de texto numérico
export const maskNumeric = (value) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

// Máscara para data (DD/MM/YYYY)
export const maskDate = (value) => {
  if (!value) return '';
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }
};
