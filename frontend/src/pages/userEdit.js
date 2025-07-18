import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';
import  useRolAuthRedirect from "../Hooks/rolAuthRedirect"
const UserEdit = () => {

    useRolAuthRedirect();

   
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('');
   

    const { iduser } = useParams();
    console.log('id:', iduser);
    console.log('ruta actual:', window.location.pathname);
    const navigate = useNavigate();
  

    
    useEffect(() => {
       
        handleGetUser();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch(`/users/${iduser}`, {
                nombre,
                correo,
                contrasena,
                rol
                
                
            });
            console.log(response.data);
            navigate('/users');
        } catch (error) {
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                alert(`Error: ${error.response.data.message || 'Hubo un problema al actualizar al usuario'}`);
            } else {
                console.error('Error al actualizar el usuario:', error.message);
                alert('Hubo un problema al actualizar el producto');
            }
        }
    }

   

    const handleGetUser = async () => {
        try {
            const response = await api.get(`/users/${iduser}`);
            console.log('Response:', response);
            console.log(response.data);
            setNombre(response.data.nombre);
            setCorreo(response.data.correo);
            setRol(response.data.rol);
            
            
            
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center bg-gray-50 dark:bg-gray-800">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-5">
                Actualizar usuario
            </h1>
            <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        nombre:
                    </label>
                    <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                
                
                <div className="mb-5">
                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        correo:
                    </label>
                    <input type="text" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div className="mb-5">
                    <label htmlFor="rol" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Rol:
                    </label>
                    <select
                        id="rol"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        required
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="">Selecciona un rol</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>

                <div className="mb-5">
                    <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        password:
                    </label>
                    <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={contrasena} onChange={(e) => setContrasena(e.target.value)}  />
                </div>
             <button type="submit" className="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-900">
                actualizar
                </button>
            </form>
        </div>
    );
}

export default UserEdit;