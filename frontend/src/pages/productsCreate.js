import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../config/api"


const ProductCreate = () =>{
    
    const [nombre, setNombre] = useState("");
    const [imagen,setimagen] = useState("");
    const [precio,setprecio] = useState(1);
    const [cantidad_disponible,setcantidad_disponible] = useState(1);
    const [categoria,setcategoria] = useState("");
    const [selecteCategory, setSelecteCategory] = useState([]);
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(""); // Reiniciar errores antes de enviar la petición
    
        try {
            const response = await api.post('/products', {
                nombre,
                precio,
                cantidad_disponible,
                categoria,
                imagen,
                discount:0
            });
    
            console.log(response.data);
            navigate('/Products');
    
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || 'Hubo un problema al crear el producto';
    
                // Mostrar el mensaje correcto basado en el código de error
                if (error.response.status === 400) {
                    setErrors(`Error: ${errorMessage}`);
                } 
                else if (error.response.status === 404 && errorMessage.includes("Categoría no encontrada")) {
                    setErrors("Error: Categoría no encontrada");
                } 
                else {
                    setErrors(`Error inesperado: ${errorMessage}`);
                }
            } else {
                console.error('Error al crear el producto:', error.message);
                setErrors('Hubo un problema al conectar con el servidor');
            }
    
            // Hacer scroll al inicio para que el usuario vea el mensaje de error
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };
    
    

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/categoria");
                setSelecteCategory(response.data);
            } catch (error) {
                console.error('Error al obtener las categorias:', error);
            }
        };
        fetchCategories();
    }, []);

     
    return (
        <div className="h-screen flex flex-col justify-center bg-white dark:bg-gray-900">
            <h1 className="text-4xl font-semibold text-primary-900 dark:text-white text-center mb-8">
                Crear un nuevo producto
            </h1>

            {errors && (
                    <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
                        {errors}
                    </div>
                )}
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
                        Categoría id:
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
                    <label for="imageUrl" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Imagen:
                    </label>
                    <textarea id="imageUrl" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-20" value={imagen} onChange={(e) => setimagen(e.target.value)} required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Crear
                </button>
            </form>
        </div>
    );

} 



export default ProductCreate  

/*
import React, { useState, useEffect } from 'react';
import api from '../config/api'; // Ajusta según tu estructura
import { useNavigate } from 'react-router-dom';

const ProductCreate = () => {
  const [nombre, setNombre] = useState("");
  const [imagenesInput, setImagenesInput] = useState("");
  const [precio, setPrecio] = useState(1);
  const [cantidad_disponible, setCantidadDisponible] = useState(1);
  const [categoria, setCategoria] = useState("");
  const [selecteCategory, setSelecteCategory] = useState([]);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  // Convertir string en array de URLs
 const imagenes = imagenesInput
  .split(',')              // 1. Divide el string en partes separadas por comas  .split(/[,\s;]+/)  // <-- acepta coma, punto y coma o cualquier espacio
  .map((url) => url.trim())   // 2. Quita espacios innecesarios al inicio y final de cada parte
  .filter((url) => url !== ""); // 3. Elimina entradas vacías


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    try {
      const response = await api.post('/products', {
        nombre,
        precio,
        cantidad_disponible,
        categoria,
        imagenes, // ahora es un array
        discount: 0
      });

      console.log(response.data);
      navigate('/Products');
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Hubo un problema';
      setErrors(`Error: ${errorMessage}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categoria");
        setSelecteCategory(response.data);
      } catch (error) {
        console.error('Error al obtener las categorias:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-semibold text-center text-primary-900 dark:text-white mb-6">
        Crear un nuevo producto
      </h1>

      {errors && (
        <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
          {errors}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Precio:</label>
          <input
            type="number"
            value={precio}
            min="1"
            onChange={(e) => setPrecio(Math.max(1, parseInt(e.target.value)))}
            required
            className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Stock:</label>
          <input
            type="number"
            value={cantidad_disponible}
            min="1"
            onChange={(e) => setCantidadDisponible(Math.max(1, parseInt(e.target.value)))}
            required
            className="w-full p-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">Categoría:</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full p-2 rounded-lg border bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Selecciona una categoría</option>
            {selecteCategory.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Imágenes (URLs separadas por coma):
          </label>
          <textarea
            value={imagenesInput}
            onChange={(e) => setImagenesInput(e.target.value)}
            placeholder="https://url1.com, https://url2.com"
            className="w-full h-24 p-2 rounded-lg border bg-gray-50 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {imagenes.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Vista previa de imágenes:</p>
            <div className="flex flex-wrap gap-3">
              {imagenes.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`preview-${index}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-5 py-2.5"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default ProductCreate;
*/