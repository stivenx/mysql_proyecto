import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/authContext";

export default function CartModal() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateCartItem, fetchCart } = useContext(CartContext);
    const { userId } = useContext(AuthContext);
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchCart(userId).finally(() => setCartLoading(false));
        } else {
            setCartLoading(false);
        }
    }, [userId]);

    if (!isCartOpen) return null;

    // 🛒 Calcular total del carrito
    const totalCarrito = cart.reduce((total, item) => {
        const discountPercentage = item.discount ?? 0;
        const finalPrice = item.precio - (item.precio * (discountPercentage / 100));
        return total + finalPrice * item.cantidad;
    }, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">🛒 Carrito de Compras</h2>
                    <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">✖️</button>
                </div>

                {cartLoading ? (
                    <p>Cargando carrito...</p>
                ) : cart.length === 0 ? (
                    <p className="text-gray-600">Tu carrito está vacío.</p>
                ) : (
                    <div>
                        {cart.map((item) => {
                            const discountPercentage = item.discount ?? 0;
                            const finalPrice = item.precio - (item.precio * (discountPercentage / 100));

                            return (
                                <div key={item.id_producto} className="flex items-center gap-4 p-2 border-b">
                                    {/* 📸 Imagen del producto */}
                                    <img 
                                        src={item.imagen} 
                                        alt={item.nombre} 
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    
                                    {/* 📌 Detalles del producto */}
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold">{item.nombre}</h3>
                                        
                                        {/* 🔹 Controles de cantidad */}
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
                                                disabled={item.cantidad >= item.stock_disponible} 
                                                className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* 🔥 Precio con descuento */}
                                        {discountPercentage > 0 ? (
                                            <p className="text-xs text-red-500">-{discountPercentage}% OFF</p>
                                        ) : null}
                                        <p className="text-sm text-gray-600">
                                            <span className="font-bold text-green-600">
                                                ${finalPrice.toFixed(2)} x {item.cantidad}
                                            </span>
                                        </p>
                                    </div>

                                    {/* 🗑️ Botón de eliminar */}
                                    <button
                                        onClick={() => removeFromCart(item.id_carrito, item.id_producto)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        ❌
                                    </button>
                                </div>
                            );
                        })}

                        {/* 🔹 Total del carrito */}
                        <div className="text-right mt-4 p-2 bg-gray-100 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-900">Total:</h3>
                            <p className="text-green-700 font-bold">${Number(totalCarrito.toFixed(2)).toLocaleString()} col</p>
                        </div>

                        {/* 🛍️ Botón de ir al checkout */}
                        <button 
                            onClick={() => alert("Redirigiendo a pago...")}
                            className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
                        >
                            Finalizar Compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
