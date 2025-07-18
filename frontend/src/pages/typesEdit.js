import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';




const TypeEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState('');

    useEffect(() => {
        const getType = async () => {
            try {
                const response = await api.get(`/tipo/${id}`);
                setNombre(response.data.nombre);
            } catch (error) {
                console.error('Error al obtener el tipo:', error);
            }
        };
        getType();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch(`/tipo/${id}`, { nombre });
            console.log(response.data);    
            navigate('/types');
        } catch (error) {
            console.error('Error al actualizar el tipo:', error);
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center bg-white dark:bg-gray-900">
        <h1 className="text-4xl font-semibold text-primary-900 dark:text-white text-center mb-8">
            actualizar un tipo
        </h1>
        <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
                <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nombre:
                </label>
                <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Actualizar
            </button>
        </form>
    </div>
);

}

export default TypeEdit