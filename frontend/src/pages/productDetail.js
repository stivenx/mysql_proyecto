import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";

const ProductDetail = () => {
    const [product, setProduct] = useState({});
    const { id } = useParams();
    const [cantidad, setCantidad] = useState(1);
    const { addToCart, fetchCart, toggleCart, cart } = useContext(CartContext);
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    // ✅ useEffect correctamente implementado
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error al obtener el producto:", error);
            }
        };
        fetchProduct();
    }, [id, cart]);  // ✅ Se ejecuta cada vez que cambia el carrito

    const handleAddToCart = async () => {
        if (!userId) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            return;
        }

        if (cantidad <= 0 || isNaN(cantidad)) {
            alert("La cantidad debe ser mayor a 0.");
            return;
        }

        try {
            // ✅ Obtener los datos actualizados antes de agregar al carrito
            const response2 = await api.get(`/products/${id}`);
            const updatedProduct = response2.data;

            if (updatedProduct.cantidad_disponible <= 0) {
                alert("Este producto ya no está disponible.");
                setProduct(updatedProduct);
                return;
            }

            // ✅ Usar los datos actualizados
            await addToCart(userId, updatedProduct, cantidad);
            
            // ✅ Actualizar el carrito
            await fetchCart(userId);
             
            // ✅ Obtener el producto actualizado y forzar actualización en la UI
            const response3 = await api.get(`/products/${id}`);
            setProduct(response3.data);
            
            
           setCantidad(1);
            // ✅ Esperar a que React actualice antes de mostrar el carrito
            setTimeout(() => {
                toggleCart();
            }, 100);

        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    };

    // ✅ Cálculo del precio con descuento
    const discountPercentage = product.discount ?? 0;
    const finalPrice = product.precio - (product.precio * (discountPercentage / 100));

     // Normalizar imágenes: si no es array, convertirlo en array
     const images = Array.isArray(product.imagen) ? product.imagen : [product.imagen || "/placeholder.jpg"];

     const nextImage = () => {
         setCurrentImageIndex((prev) => (prev + 1) % images.length);
     };
 
     const prevImage = () => {
         setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
     };

     return (
        <section className="bg-gray-100 dark:bg-gray-900 py-16 min-h-screen flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Carrusel de imágenes */}
              <div className="md:w-1/2 relative">
                <div className="h-[500px] w-full rounded-lg bg-white dark:bg-black shadow-lg flex items-center justify-center relative overflow-hidden">
                  <img
                    className={`w-full h-full object-contain rounded-lg transition duration-500 ${
                      product.cantidad_disponible === 0 ? "opacity-50" : ""
                    }`}
                    src={images[currentImageIndex]}
                    alt={product.nombre}
                  />
      
                  {/* Cartel AGOTADO */}
                  {product.cantidad_disponible === 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">
                      AGOTADO
                    </div>
                  )}
      
                  {/* Botones de navegación */}
                  {images.length > 0 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-80 transition"
                      >
                        ›
                      </button>
                    </>
                  )}
                </div>
      
                {/* Paginación */}
                <div className="flex justify-center mt-4 space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${
                        index === currentImageIndex ? "bg-blue-600" : "bg-gray-400"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>
      
              {/* Detalles del producto */}
              <div className="md:w-1/2">
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{product.nombre}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Categoría:</span> {product.categoria_nombre}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                  <span className="font-semibold">Stock disponible:</span> {product.cantidad_disponible}
                </p>
      
                <div className="flex flex-col mb-6">
                  {discountPercentage > 0 ? (
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-red-600 bg-red-200 px-2 py-1 rounded-lg w-fit">
                        -{discountPercentage}% OFF
                      </span>
                      <span className="text-xl font-bold text-gray-500 line-through">
                        ${product.precio} COL
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ${finalPrice.toFixed(2)} COL
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${product.precio} COL
                    </span>
                  )}
                </div>
      
                <div className="flex items-center gap-4">
                  {product.cantidad_disponible > 0 ? (
                    <>
                      <input
                        type="number"
                        min="1"
                        max={product.cantidad_disponible}
                        value={cantidad}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setCantidad(
                            isNaN(value)
                              ? 1
                              : Math.max(1, Math.min(product.cantidad_disponible, value))
                          );
                        }}
                        className="w-20 p-2 border rounded-lg text-center text-lg font-semibold"
                      />
                      <button
                        onClick={handleAddToCart}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition duration-300"
                      >
                        🛒 Agregar al Carrito
                      </button>
                    </>
                  ) : (
                    <span className="text-red-600 text-lg font-bold">No hay stock disponible</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
      
};

export default ProductDetail;
