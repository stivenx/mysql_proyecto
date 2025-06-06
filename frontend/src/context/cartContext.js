import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../config/api";
import { AuthContext } from "../context/authContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { userId } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false); // Nuevo estado

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    useEffect(() => {
        if (userId) {
            fetchCart(userId);
        } else {
            setCart([]); // Vaciar el carrito si no hay usuario
        }
    }, [userId]);
    
    
    // Cargar el carrito desde el backend
    const fetchCart = async (userId) => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await api.get(`/carrito/user/${userId}`);
            setCart(response.data);
        } catch (error) {
            console.error("Error al obtener el carrito", error);
        } finally {
            setLoading(false);
        }
    };

    // Agregar producto al carrito
    const addToCart = async (userId, product, cantidad) => {
        if (!userId) {
            console.error("No hay usuario autenticado");
            return;
        }
        try {
            const response = await api.post(`/carrito/add`, {
                userId: userId,
                id_producto: product.id, 
                cantidad: cantidad
            });
            // Actualizar el carrito desde el backend  
            setCart(response.data);
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
        }
    };

    // Eliminar producto del carrito
    const removeFromCart = async (id_carrito,id_producto) => {
        if (!userId) {
            console.error("No hay usuario autenticado");
            return;
        }
        try {
            const response = await api.delete(`carrito/remove/${id_carrito}/${id_producto}`,{
                

            });
            
            await fetchCart(userId);
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
        }
    };

    // Actualizar cantidad de un producto en el carrito
const updateCartItem = async (id_carrito, id_producto, nuevaCantidad) => {
    if (!userId) {
        console.error("No hay usuario autenticado");
        return;
    }

    try {
        await api.put(`/carrito/update`, {
            id_carrito,
            id_producto,
            nuevaCantidad
        });

           await fetchCart(userId); // ✅ Volver a cargar el carrito para reflejar cambios
         // await  fetchCart(userId).filter((item) => item.id !== id_producto);
    } catch (error) {
        console.error("Error al actualizar cantidad en el carrito", error);
    }
};


    return (
        <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, loading, isCartOpen, toggleCart, updateCartItem }}>
            {children}
        </CartContext.Provider>
    );
};
