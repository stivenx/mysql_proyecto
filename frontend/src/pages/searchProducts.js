import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../config/api";
import ProductCard from "../components/productcard";


const ProductSearch = () => {
    const location = useLocation();
    const [query, setQuery] = useState(""); // Para manejar el input del usuario
    const [products, setProducts] = useState([]); // Para almacenar los resultados
    const [loading, setLoading] = useState(false); // Indicador de carga
    const [error, setError] = useState(""); // Manejo de errores

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const nameParam = params.get("nombre") || "";
        setQuery(nameParam);
        
        if(nameParam.length >= 3) {
            fetchProducts(nameParam);
        }
    }, [location.search]);

    useEffect(() => {
        if (query.length >= 3) {
            fetchProducts(query);
        } else {
            setProducts([]);
        }
    }, [query]);

    const fetchProducts = async (nameParam) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get(`/products/search/${nameParam}`);
            setProducts(response.data);
        } catch (error) {
            setError("Error al obtener los productos");
        } finally {
            setLoading(false);
        }
    };
  // Renderizado
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Buscar Productos</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ingresa el nombre del producto..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            window.history.pushState({}, "", `/search?name=${query}`);
            fetchProducts(query);
          }}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Buscar
        </button>
      </div>
      {loading && <p className="text-gray-500">Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {products.length === 0 && !loading && !error && (
          <p className="text-gray-500">No se encontraron productos   `.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;

