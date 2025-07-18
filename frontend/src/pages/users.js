import React, { useEffect, useState } from "react";
import api from "../config/api";
import  useRolAuthRedirect from "../Hooks/rolAuthRedirect"

const Users = () => {
  useRolAuthRedirect();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const fetchFilteredUsers = async (search) => {
    try {
      const response = await api.get(`/users/search/${search}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error al filtrar los usuarios:", error);
    }
  };
 

  const handleDelete = async (iduser) => {
    if (!iduser) return console.error("Error: iduser no está definido");
    
    try {
      const response = await api.delete(`/users/${iduser}`);
      if (response.status === 200) {
        setUsers(users.filter((user) => user.iduser !== iduser));
        alert("El usuario se ha eliminado correctamente");
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }; 

  const indexOfLastUsers = currentPage * usersPerPage;
  const indexOfFirstProduct = indexOfLastUsers - usersPerPage;
  const currentUsers = users.slice(indexOfFirstProduct, indexOfLastUsers);
  const totalPages = Math.ceil(users.length / usersPerPage);
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
    <div className="relative overflow-x-auto shadow-md">
      <div className="flex justify-between items-center px-4 py-2 bg-primary-100 dark:bg-primary-800">
        <h2 className="text-xl font-semibold text-primary-900 dark:text-white">Usuarios</h2>
        <a href="/admin/Create" className="px-4 py-2 bg-primary-700 text-white hover:bg-primary-600">
          Agregar Usuario
        </a>
      </div>

      <div className="flex justify-between items-center px-4 py-2">
        <input
          type="text"
          value={search}
          placeholder="Buscar usuario por nombre"
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-50 border text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="button"
          onClick={() => fetchFilteredUsers(search)}
          className="bg-primary-700 hover:bg-primary-800 text-white font-bold py-2 px-4 rounded"
        >
          Buscar
        </button>
        <button
          className="px-4 py-2 bg-gray-300 text-gray-900 hover:bg-gray-400"
          onClick={() => {
            setSearch("");
            fetchUsers();
          }}
        >
          Limpiar filtro
        </button>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Correo</th>
            <th className="px-6 py-3">Editar</th>
            <th className="px-6 py-3">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            currentUsers.map((user) => (
              <tr key={user.iduser} className="border-b dark:border-gray-700">
                <td className="px-6 py-4 text-gray-900 dark:text-white">{user.nombre}</td>
                <td className="px-6 py-4">{user.correo}</td>
                <td className="px-6 py-4">{user.rol}</td>
                <td className="px-6 py-4">
                  <a href={`/UserEdit/${user.iduser}`} className="text-primary-500 hover:underline">
                    Editar
                  </a>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(user.iduser)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
        {/* Navegación paginada */}
        {totalPages > 1 &&  (
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
};

export default Users;
