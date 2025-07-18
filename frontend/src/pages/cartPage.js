import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/authContext";

const CartPage = () => {
    const { userId } = useContext(AuthContext);
    const { cart, fetchCart, removeFromCart, updateCartItem, loading } = useContext(CartContext);
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchCart(userId).finally(() => setCartLoading(false));
        } else {
            setCartLoading(false);
        }
    }, [userId]);

    if (cartLoading) return <p>Cargando carrito...</p>;

    // 🛒 Calcular el total del carrito aplicando descuentos si existen
    const totalCarrito = cart.reduce((total, item) => {
        const discountPercentage = item.discount ?? 0;
        const finalPrice = item.precio - (item.precio * (discountPercentage / 100));
        return total + finalPrice * item.cantidad;
    }, 0);

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tu Carrito</h2>

            {loading ? (
                <p className="text-gray-700">Cargando productos...</p>
            ) : cart.length === 0 ? (
                <p className="text-gray-700">El carrito está vacío</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-5">
                    {cart.map((item) => {
                        const discountPercentage = item.discount ?? 0;
                        const finalPrice = item.precio - (item.precio * (discountPercentage / 100));

                        return (
                            <div key={item.id_producto} className="flex items-center gap-4 p-4 border-b">
                                {/* Imagen del producto */}
                                <img 
                                    src={`http://localhost:5000/${item.imagen}`} 
                                    alt={item.nombre} 
                                    className="w-20 h-20 object-cover rounded-lg"
                                />
                                
                                {/* Detalles del producto */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.nombre}</h3>
                                    
                                    {/* ✅ Botones para modificar cantidad con validación de stock */}
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => updateCartItem(item.id_carrito, item.id_producto, item.cantidad - 1)}
                                            disabled={item.cantidad <= 1}
                                            className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold">{item.cantidad}</span>
                                        <button 
                                            onClick={() => updateCartItem(item.id_carrito, item.id_producto, item.cantidad + 1)}
                                            disabled={item.cantidad >= item.stock_disponible}  // 🚀 **Nueva validación**
                                            className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {discountPercentage > 0 ? (
                                        <>
                                            <p className="text-gray-600">Precio original: <span className="line-through">${item.precio.toLocaleString()} col</span></p>
                                            <p className="text-gray-600">Precio con descuento: <span className="font-bold text-green-600">${finalPrice.toFixed(2).toLocaleString()} col</span></p>
                                        </>
                                    ) : (
                                        <p className="text-gray-600">Precio: <span className="font-bold">${item.precio.toLocaleString()} col</span></p>
                                    )}

                                    <p className="text-gray-600">
                                        Total: <span className="font-bold text-green-700">${(finalPrice * item.cantidad).toFixed(2).toLocaleString()} col</span>
                                    </p>
                                </div>

                                {/* Botón de eliminar */}
                                <button
                                    onClick={() => removeFromCart(item.id_carrito, item.id_producto)}
                                    className="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-md border border-red-500 hover:bg-red-100 transition"
                                >
                                    Eliminar
                                </button>
                            </div>
                        );
                    })}

                    {/* 🔹 Total General del Carrito */}
                    <div className="text-right mt-4 p-4 bg-gray-200 rounded-lg">
                        <h3 className="text-xl font-bold text-gray-900">Total del Carrito:</h3>
                        <p className="text-lg text-gray-700">
                            <span className="font-bold text-green-700">${Number(totalCarrito.toFixed(2)).toLocaleString()} col</span>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
