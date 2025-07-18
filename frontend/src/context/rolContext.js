import { createContext, useState, useEffect } from "react";

// Crear el contexto de autenticación
export const RolContext = createContext();

// Función para extraer el rol desde el token JWT
const getRolFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.rol || null;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
};

export const RolProvider = ({ children }) => {
    const [rol, setRol] = useState(getRolFromToken);

    useEffect(() => {
        const updateRol = () => {
            setRol(getRolFromToken());
        };

        window.addEventListener("storage", updateRol);
        window.addEventListener("authChange", updateRol);

        return () => {
            window.removeEventListener("storage", updateRol);
            window.removeEventListener("authChange", updateRol);
        };
    }, []);

    return (
        <RolContext.Provider value={{ rol }}>
            {children}
        </RolContext.Provider>
    );
};
