import React, { useEffect, useState } from "react";
import api from '../config/api';




const Categorys = () => {
    const [categorys, setCategorys] = useState([]);

    const handleDelete = async (categoryId) => {
        try {
            const response = await api.delete(`/categoria/${categoryId}`);
            if (response.status === 200) {
                setCategorys(categorys.filter((category) => category.id !== categoryId));
                alert('El producto se ha eliminado correctamente');
            } else {
                console.error('Error al eliminar el producto:', response.data);
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };

    useEffect(() => {
        const fetchCategorys = async () => {
            try {
                const response = await api.get("/categoria/");
                setCategorys(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchCategorys();
    }, []);
    return (
        <div class="relative overflow-x-auto shadow-md ">
            <div class="flex justify-between items-center px-4 py-2 bg-primary-100 dark:bg-primary-800">
                <h2 class="text-xl font-semibold text-primary-900 dark:text-white">
                    Categorys</h2>
               
               
                <a href="/CategoryCreate" class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Add Category
                </a>

              
            </div>
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            categoryId
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Nombre
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
                    {categorys.map((category) => (
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {category.id}
                            </td>
                            <td class="px-6 py-4">
                                {category.nombre}
                            </td>
        
                            <td class="px-6 py-4">
                                <a href={`CategoryEdit/${category.id}`} class="font-medium text-primary-500 hover:underline">
                                    Edit</a>
                            </td>
                            <td class="px-6 py-4">
                                <a style={{cursor: "pointer"}} onClick={() => handleDelete(category.id)} class="font-medium text-red-500 hover:underline">
                                    Delete</a>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}

export default Categorys