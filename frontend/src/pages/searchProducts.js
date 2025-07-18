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
    const [currentPage, setCurrentPage] = useState(1);
      const productsPerPage = 5;

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
    
    const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 👇 Renderizado truncado de los números de páginas
  const renderPageNumbers = () => {
    const pageButtons = [];   // Aquí se almacenan los botones (números y '...')
    const maxVisible = 3;     // Máximo de páginas centrales visibles
    const ellipsis = '...';   // Texto para representar puntos suspensivos

    if (totalPages <= maxVisible + 2) {
      // Si hay pocas páginas (ej. <= 5), se muestran todas
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else if (currentPage <= maxVisible) {
      // Si estás en las primeras páginas (ej. página 1, 2, 3)
      for (let i = 1; i <= maxVisible + 1; i++) {
        pageButtons.push(i);
      }
      pageButtons.push(ellipsis);      // Añade '...'
      pageButtons.push(totalPages);    // Añade última página
    } else if (currentPage >= totalPages - maxVisible) {
      // Si estás cerca del final (ej. última o penúltima página)
      pageButtons.push(1);             // Siempre muestra primera página
      pageButtons.push(ellipsis);     // Añade '...'
      for (let i = totalPages - maxVisible; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else {
      // Si estás en medio (ej. página 5 de 10)
      pageButtons.push(1);             // Muestra primera
      pageButtons.push(ellipsis);     // ...
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageButtons.push(i);          // Muestra actual ± 1
      }
      pageButtons.push(ellipsis);     // ...
      pageButtons.push(totalPages);   // Última
    }

    // Renderizar los botones y los '...'
    return pageButtons.map((num, index) =>
      num === ellipsis ? (
        <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={num}
          onClick={() => handlePageClick(num)}
          className={`px-3 py-1 rounded font-semibold border transition ${
            currentPage === num
              ? "bg-yellow-400 text-black border-black"
              : "bg-white hover:bg-gray-200 text-gray-800 border-gray-300"
          }`}
        >
          {num}
        </button>
      )
    );
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
        {currentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {/* Navegación paginada */}
        {totalPages > 1 && (
          <div className="w-full flex flex-wrap justify-center items-center mt-10 gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded disabled:opacity-50"
            >
              Anterior
            </button>

            {renderPageNumbers()}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
         )}
        {products.length === 0 && !loading && !error && (
          <p className="text-gray-500">No se encontraron productos   `.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;

