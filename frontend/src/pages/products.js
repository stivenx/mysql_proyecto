import React, { useEffect, useState } from "react";
import api from '../config/api';
import  useRolAuthRedirect from "../Hooks/rolAuthRedirect"


const Products = () => {
    useRolAuthRedirect()

    const[products,setProducts] = React.useState([]);
    const [starNumber, setStarNumber] = useState( );
    const [endNumber, setEndNumber] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    const handleDelete = async (productId) => {
        try {
            const response = await api.delete(`/products/${productId}`);
            if (response.status === 200) {
                setProducts(products.filter((product) => product.id !== productId));
                alert('El producto se ha eliminado correctamente');
            } else {
                console.error('Error al eliminar el producto:', response.data);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };
    
    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }

    };
    const fetchFilteredProducts = async () => {
        if (starNumber && endNumber) {
            const start =Number(starNumber);
            const end =Number(endNumber);
            if (start <0 || end <0) {
                alert("los valores deben ser mayor a 0");
                return
            }
            if (end < start) {
                alert("El valor final debe ser mayor  al valor inicial");
                return;
              }
          try {
            const response = await api.get(`/products/filter/${start}/${end}`);
            setProducts(response.data);
          } catch (error) {
            console.error(error);
          }
        } else {
          alert("Por favor, seleccione ambos valores para aplicar el filtro.");
        }
     };


    useEffect(() => {

        fetchProducts();
    }, []);
    
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
        <div class="relative overflow-x-auto shadow-md ">
            <div class="flex justify-between items-center px-4 py-2 bg-primary-100 dark:bg-primary-800">
                <h2 class="text-xl font-semibold text-primary-900 dark:text-white">
                    Products</h2>
                    <div className="flex items-center space-x-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Valor inicial:</label>
                <input
                    type="number"
                    value={starNumber}
                    placeholder="ingrese el valor inicial"
                    onChange={(e) => setStarNumber(e.target.value === "" ? "" : Number(e.target.value))}
                    className="bg-gray-50 border text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Valor final:</label>
                <input
                    type="number"
                    value={endNumber}
                    placeholder="ingrese el valor final"
                    onChange={(e) => setEndNumber(e.target.value === "" ? "" : Number(e.target.value))}
                    className="bg-gray-50 border text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                    className="px-4 py-2 bg-primary-700 text-white hover:bg-primary-600"
                    onClick={fetchFilteredProducts}
                >
                    Aplicar filtro
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-900 hover:bg-gray-400"
                    onClick={() => {
                    setStarNumber("");
                    setEndNumber("");
                    fetchProducts();
                    }}
                >
                    Limpiar filtro
                </button>
                </div>
            
                <a href="/Users" class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Users 
                </a>
                <a href="/Categorys" class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Categories
                </a>
                 <a href='/types' class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    types
                </a>

               
                <a href="/ProductCreate" class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Add product
                </a>

              
            </div>
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" class="px-6 py-3">
                            type
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Stock
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Discount
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Etiqueta
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Image
                        </th>

                        <th scope="col" class="px-6 py-3">
                            Edit
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Delete
                        </th>
                    </tr>
                </thead>
                
                <tbody>
                      {products.length > 0 ? (
                        currentProducts.map((product) => (
                            <tr key={product.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {product.nombre}
                                </td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    ${product.precio} <span className="text-xs ml-1"> COL</span>
                                </td>
                                <td className="px-6 py-4">
                                    {product.categoria_nombre}
                                </td>
                                <td className="px-6 py-4">
                                    {product.tipo_nombre}
                                </td>
                                <td className="px-6 py-4">
                                    {product.cantidad_disponible}
                                </td>
                                <td className="px-6 py-4">
                                    {product.discount}%
                                </td>
                                <td className="px-6 py-4">
                                    {product.etiqueta}
                                </td>
                                <td className="px-6 py-4">
                                    <img src={ `http://localhost:5000/${product.imagenes[0]}`} alt={product.name} className="w-10 h-10 object-cover rounded-full" />
                                </td>
                                <td className="px-6 py-4">
                                    <a href={`/ProductEdit/${product.id}`} className="font-medium text-primary-500 hover:underline">
                                        Edit
                                    </a>
                                </td>
                                <td className="px-6 py-4">
                                    <a style={{ cursor: "pointer" }} onClick={() => handleDelete(product.id)} className="font-medium text-red-500 hover:underline">
                                        Delete
                                    </a>
                                </td>
                            </tr>
                             
       

                        ))
                     ) : (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                No hay productos disponibles.
                            </td>
                        </tr>
                     )}
                </tbody>
            </table>

            {/* 👇 Paginación debajo de la tabla */}
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
    );

}
export default Products
