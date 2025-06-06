import { createContext, useState, useEffect } from "react";

// Crear el contexto de autenticación
export const AuthContext = createContext();

// Función reutilizable para obtener el ID del usuario desde el token
const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.iduser || null; // ✅ Extraer correctamente el ID del usuario
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
};

  

export const AuthProvider = ({ children }) => {
  // Estado para almacenar el ID del usuario
  const [userId, setUserId] = useState(getUserIdFromToken);

  useEffect(() => {
    // Función para actualizar el userId cuando cambie el token
    const updateUserId = () => {
      setUserId(getUserIdFromToken()); // Ahora solo llamamos a la función
    };

    // Escuchar cambios en el localStorage (cuando el token cambie en otras pestañas)
    window.addEventListener("storage", updateUserId);
    // Evento personalizado para cambios dentro de la misma pestaña
    window.addEventListener("authChange", updateUserId);

    // Limpiar los eventos cuando el componente se desmonte
    return () => {
      window.removeEventListener("storage", updateUserId);
      window.removeEventListener("authChange", updateUserId);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userId }}>
      {children}
    </AuthContext.Provider>
  );
};