// Frontend utility para validações de formulário

export const isValidEmail = (email) => {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidUsername = (username) => {
  if (!username) return false;
  // Min 3 caracteres, sem espaços, apenas alfanuméricos e underscore
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const isValidPassword = (password) => {
  if (!password) return false;
  // Min 6 caracteres
  return password.length >= 6;
};

export const isValidName = (name) => {
  if (!name) return false;
  // Min 2 caracteres, apenas letras e espaços
  return name.length >= 2 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
};

export const isValidCPF = (cpf) => {
  if (!cpf) return false;
  // Remove pontos e traços
  const numbers = cpf.replace(/\D/g, '');
  
  // Deve ter exatamente 11 dígitos
  if (numbers.length !== 11) return false;
  
  // Valida se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  // Algoritmo de validação do CPF
  let sum = 0;
  let remainder;
  
  // Validar primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(9, 10))) return false;
  
  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.substring(10, 11))) return false;
  
  return true;
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Remove caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  // Deve ter 10 ou 11 dígitos
  return numbers.length >= 10 && numbers.length <= 11;
};

export const isValidRating = (rating) => {
  const num = parseInt(rating);
  return num >= 1 && num <= 5;
};

export const isValidBio = (bio) => {
  if (!bio) return true; // Bio é opcional
  return bio.length <= 500;
};

export const isValidAlbumTitle = (title) => {
  if (!title) return false;
  return title.trim().length >= 2 && title.length <= 100;
};

export const isValidComment = (comment) => {
  if (!comment) return true; // Comentário é opcional
  return comment.trim().length <= 500;
};

export const isValidArtistName = (name) => {
  if (!name) return false;
  return name.length >= 2 && name.length <= 100 && /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
};

export const isValidDate = (date) => {
  if (!date) return false;
  // Validar formato DD/MM/YYYY ou YYYY-MM-DD
  const regex = /^\d{2}\/\d{2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$/;
  
  if (!regex.test(date)) return false;
  
  // Validar se é uma data válida
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Validar campo genérico com regras customizadas
export const validateField = (fieldName, value, rules = {}) => {
  const defaultRules = {
    username: { validator: isValidUsername, message: 'Username deve ter pelo menos 3 caracteres' },
    email: { validator: isValidEmail, message: 'Email inválido' },
    password: { validator: isValidPassword, message: 'Senha deve ter pelo menos 6 caracteres' },
    name: { validator: isValidName, message: 'Nome deve ter apenas letras e espaços' },
    bio: { validator: isValidBio, message: 'Bio deve ter no máximo 500 caracteres' },
    cpf: { validator: isValidCPF, message: 'CPF inválido' },
    phone: { validator: isValidPhone, message: 'Telefone deve ter 10 ou 11 dígitos' },
    rating: { validator: isValidRating, message: 'Avaliação deve ser entre 1 e 5' },
    albumTitle: { validator: isValidAlbumTitle, message: 'Título deve ter entre 2 e 100 caracteres' },
    comment: { validator: isValidComment, message: 'Comentário deve ter no máximo 500 caracteres' },
    artistName: { validator: isValidArtistName, message: 'Nome deve ter entre 2 e 100 caracteres' },
    date: { validator: isValidDate, message: 'Data inválida' },
  };

  const rule = rules[fieldName] || defaultRules[fieldName];
  
  if (!rule) return { valid: true, message: '' };
  
  const isValid = rule.validator(value);
  return {
    valid: isValid,
    message: isValid ? '' : rule.message,
  };
};

// Função para validar todos os campos de um formulário
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((fieldName) => {
    const result = validateField(fieldName, formData[fieldName], validationRules);
    if (!result.valid) {
      errors[fieldName] = result.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};
