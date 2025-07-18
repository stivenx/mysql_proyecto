import React, { useContext, useEffect, useState } from "react";
import api from "../config/api";
import ProductCard from "../components/productcard";
import { CartContext } from "../context/cartContext";

const ProductsNews = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/news");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [cart]);

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

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="flex flex-wrap items-center justify-center">
        <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white">
          Productos
        </h1>

        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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
      </div>
    </section>
  );
};




export default ProductsNews