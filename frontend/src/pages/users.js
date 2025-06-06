import React, { useEffect, useState } from "react";
import api from "../config/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

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
            users.map((user) => (
              <tr key={user.iduser} className="border-b dark:border-gray-700">
                <td className="px-6 py-4 text-gray-900 dark:text-white">{user.nombre}</td>
                <td className="px-6 py-4">{user.correo}</td>
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
    </div>
  );
};

export default Users;
