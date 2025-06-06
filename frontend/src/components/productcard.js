import React,{useContext} from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";
import{useNavigate} from "react-router-dom"



const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toggleCart, fetchCart } = useContext(CartContext);


  const handleAddToCart = async () => {
    if (!userId) {
      alert("Por favor, inicia sesión para agregar al carrito.");
      return;
    }
    try {
      await addToCart(userId, product, 1);
      await fetchCart(userId); // Actualizar el carrito
      
  
      toggleCart();
      
    } catch (error) {
      console.error("Error al agregar al carrito", error);
    }
  };

  if (!product || !product.id) {
    return null; // Manejo de error si el producto no está definido
  }

  // Cálculo del precio con descuento
  const discountPercentage = product.discount ?? 0;
  const finalPrice = product.precio - (product.precio * (discountPercentage / 100));

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 ml-4 p-4">
      
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            className={`p-4 rounded-t-lg object-cover object-center mx-auto w-64 h-64 ${
              product.cantidad_disponible === 0 ? "opacity-50" : ""
            }`}
            src={product.imagen || "/placeholder.jpg"}
            alt={product.nombre}
          />
          {product.cantidad_disponible === 0 && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">
              AGOTADO
            </div>
          )}
        </Link>
      </div>

      <div className="px-5 pb-5">
        <Link to={`/products/${product.id}`}>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {product.nombre}
          </h5>
          <p className="text-sm text-gray-500">{product.categoria_nombre ?? "Sin categoría"}</p>
        </Link>

        <div className="flex items-center mt-2.5 mb-3">
          {[1, 2, 3, 4, 5].map((star, index) => (
            <svg
              key={index}
              className="w-4 h-4 text-yellow-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
          ))}
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded ms-3">
            {product.rating}
          </span>
        </div>

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