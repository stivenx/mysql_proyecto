import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";

const ProductCard = ({ product }) => {
  const { addToCart, toggleCart, fetchCart } = useContext(CartContext);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState({});

  const currentIndex = activeImage[product.id] ?? 0;

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Por favor, inicia sesión para agregar al carrito.");
      return;
    }
    try {
      await addToCart(userId, product, 1);
      await fetchCart(userId);
      toggleCart();
    } catch (error) {
      console.error("Error al agregar al carrito", error);
    }
  };

  if (!product || !product.id) return null;

  const discountPercentage = product.discount ?? 0;
  const finalPrice =
    product.precio - product.precio * (discountPercentage / 100);

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 ml-4 p-4">
      {/* Imagen del producto con navegación */}
      <div className="relative">
        <Link to={`/product/${product.id}`}>
        <div className="relative w-64 h-64 mx-auto overflow-hidden rounded-t-lg bg-white">
          {product.imagenes?.length > 0 ? (
            product.imagenes.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                alt={`Imagen ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              />
            ))
          ) : (
            <img
              className="w-full h-full object-cover"
              src="/placeholder.jpg"
              alt="Sin imagen"
            />
          )}
       </div>

        </Link>

        {/* Botones para cambiar imagen */}
        {product.imagenes?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {product.imagenes.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full border border-white ${
                  currentIndex === index ? "bg-gray-800" : "bg-gray-400"
                }`}
                onClick={(e) => {
                  e.preventDefault(); // evita que el Link se active
                  setActiveImage((prev) => ({
                    ...prev,
                    [product.id]: index,
                  }));
                }}
              ></button>
            ))}
          </div>
        )}

        {/* Etiqueta AGOTADO */}
         {product.cantidad_disponible === 0 && (
            <div className="absolute top-4 left-4 z-30 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">
              AGOTADO
            </div>
          )}

          {/* Etiqueta NUEVO (u otra) */}
          {product.etiqueta && product.etiqueta !== "Normal" && (
            <div className="absolute top-4 right-4 z-30 bg-green-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">
              {product.etiqueta.toUpperCase()}
            </div>
          )}


      </div>

      {/* Info del producto */}
      <div className="px-5 pb-5">
        <Link to={`/product/${product.id}`}>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {product.nombre}
          </h5>
          <p className="text-sm text-gray-500">
            {product.categoria_nombre ?? "Sin categoría"}
          </p>
           <p className="text-sm text-gray-500">
            {product.tipo_nombre ?? "Sin tipo"}
          </p>
        </Link>

        {/* Rating */}
        <div className="flex items-center mt-2.5 mb-3">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <svg
              key={index}
              className="w-4 h-4 text-yellow-300"
              fill="currentColor"
              viewBox="0 0 22 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          ))}
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ms-3">
            {product.rating}
          </span>
        </div>

        {/* Precio con descuento */}
        <div className="mb-4">
          {discountPercentage > 0 ? (
            <div className="flex flex-col">
              <span className="text-sm text-red-600 font-bold bg-red-200 px-2 py-1 rounded-lg w-fit">
                -{discountPercentage}% OFF
              </span>
              <span className="text-lg font-bold text-gray-500 line-through">
                ${product.precio} COL
              </span>
              <span className="text-xl font-bold text-green-600">
                ${finalPrice.toFixed(2)} COL
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ${product.precio} COL
            </span>
          )}
        </div>

        {/* Botones */}
        <div className="flex items-center justify-between">
          <Link to={`/product/${product.id}`}>
            <button className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm px-3 py-2 text-center">
              Ver detalles
            </button>
          </Link>
          {product.cantidad_disponible > 0 ? (
            <button
              onClick={handleAddToCart}
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-3 py-2 text-center"
            >
              🛒 Agregar
            </button>
          ) : (
            <button
              disabled
              className="text-white bg-gray-400 font-medium rounded-lg text-sm px-3 py-2 text-center cursor-not-allowed"
            >
              Agotado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
