import React, { createContext, useState, useContext } from 'react';

// Context para manejar las validaciones
const ValidationContext = createContext();

export const useValidation = () => useContext(ValidationContext);

export const ValidationProvider = ({ children }) => {
  const [validationErrors, setValidationErrors] = useState({});

  // Validación del nombre de usuario (mínimo 6 caracteres)
  const validateUserName = (username) => {
    return username.length >= 6; // Solo se verifica la longitud mínima
  };

  // Validación de la contraseña (mínimo 8 caracteres, 1 mayúscula y 1 número)
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Al menos 8 caracteres, 1 mayúscula y 1 número
    return regex.test(password);
  };

  // Validación de la edad (mayoría de edad)
  const validateAge = (birthdate) => {
    const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
    return age >= 18;
  };

  return (
    <ValidationContext.Provider value={{ validationErrors, setValidationErrors, validateUserName, validatePassword, validateAge }}>
      {children}
    </ValidationContext.Provider>
  );
};
