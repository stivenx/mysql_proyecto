import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';


const ProductEdit = () => {

    const [nombre, setNombre] = useState("");
    const [imagen,setimagen] = useState("");
    const [precio,setprecio] = useState(0);
    const [cantidad_disponible,setcantidad_disponible] = useState(0);
    const [categoria,setcategoria] = useState("");
    const [selecteCategory, setSelecteCategory] = useState([]);
    const [discount, setDiscount] = useState();
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        handleGetProduct();
        handleGetCategory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (discount < 0 || discount > 100 || isNaN(discount)) {
                alert('El descuento debe estar entre 0 y 100% o ser un número válido.');
                return;
            }
            
            const response = await api.patch(`/products/${id}`, {
                nombre,
                precio,
                cantidad_disponible,
                categoria,
                imagen,
                discount
            });
            console.log(response.data);
            navigate('/Products');
        } catch (error) {
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                alert(`Error: ${error.response.data.message || 'Hubo un problema al editar el producto'}`);
            } else {
                console.error('Error al crear el producto:', error.message);
                alert('Hubo un problema al crear el producto');
            }
        }
    }

    const handleGetCategory = async () => {
        try {
            const response = await api.get('/categoria');
            setSelecteCategory(response.data);
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };

   const handleGetProduct = async () => {
    try {
        const response = await api.get(`/products/${id}`);
        setNombre(response.data.nombre);
        setprecio(response.data.precio);
        setcategoria(response.data.categoria);
        setcantidad_disponible(response.data.cantidad_disponible);
        setimagen(response.data.imagen);
        setDiscount(response.data.discount);

    } catch (error) {
        console.error('Error al obtener el producto:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center bg-white dark:bg-gray-900">
        <h1 className="text-4xl font-semibold text-primary-900 dark:text-white text-center mb-8">
            Editar un producto
        </h1>
        <form className="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
                <label for="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Nombre:
                </label>
                <input type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div classNameName="mb-5">
                <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    precio:
                </label>
                <input type="number" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={precio} min="1" onChange={(e) => setprecio(Math.max(1, parseInt(e.target.value)))} required />
            </div>
            
            <div classNameName="mb-5">
                <label for="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    stock:
                </label>
                <input type="number" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={cantidad_disponible} min="1" onChange={(e) => setcantidad_disponible(Math.max(1, parseInt(e.target.value)))} required />
            </div>
            <div className="mb-5">
                <label for="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Categoría:
                </label>
                <select
                                value={categoria}
                                onChange={(event) => setcategoria(event.target.value)}
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                <option value="">Todos las categorías</option>
                                {selecteCategory.map((category) => (
                                    <option key={category.id} value={category.id}>
                                    {category.nombre}
                                    </option>
                                ))}
                                
                                </select>
            </div>

            <div className="mb-5">
                <label for="discount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Descuento (%):
                </label>

                <input
                type="number"
                id="discount"
                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                value={discount}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setDiscount( Math.max(0, Math.min(100, value)));
                }}
                min="0"
                max="100"
                step="1"
                
                />
            </div>

            <div className="mb-5">
                <label for="imageUrl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Imagen:
                </label>
                <textarea id="imageUrl"
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-20"
                   value={imagen} onChange={(e) => setimagen(e.target.value)} required />
            </div>
            <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                actualizar
            </button>
        </form>
    </div>
);

}

export default ProductEdit
    






