import React, { useContext, useEffect, useState } from "react";
import api from "../config/api";
import ProductCard from "../components/productcard";
import { CartContext } from "../context/cartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [cart]);

  // Calcular índices
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Total de páginas
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Manejadores de cambio de página
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Cambiar directamente a una página específica
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="flex flex-wrap items-center justify-center">
        <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white">
          Productos
        </h1>

        {/* Mostrar productos de la página actual */}
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Navegación de páginas */}
        {totalPages > 1 && (
          <div className="w-full flex flex-wrap justify-center items-center mt-10 gap-2">
            
            {/* Botón anterior */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded disabled:opacity-50"
            >
              Anterior
            </button>

            {/* Botones numerados */}
            {[...Array(totalPages)].map((_, index) => { //crear un array de tamaño total de paginas igual al total de paginas
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageClick(pageNum)}
                  className={`px-3 py-1 rounded font-semibold border ${
                    currentPage === pageNum
                      ? "bg-yellow-400 text-black border-black"
                      : "bg-white hover:bg-gray-200 text-gray-800 border-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Botón siguiente */}
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




/*

import React, { useContext, useEffect, useState } from "react";
import api from "../config/api";
import ProductCard from "../components/productcard";
import { CartContext } from "../context/cartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { cart } = useContext(CartContext);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchcategorias = async () => {
    try {
      const response = await api.get("/categoria/");
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchproductsCategory = async (selectedCategory) => {
    try {
      const response = await api.get(`/products/categoria/${selectedCategory}`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchcategorias();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchproductsCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="flex flex-wrap items-center justify-center">
        <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">Productos</h1>
        <select
          className="w-full md:w-1/3 p-4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todos</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} className="shadow-md rounded-md" />
        ))}
      </div>
    </section>
  );
};

   */

export default Home;
