import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../config/api"
import  useRolAuthRedirect from "../Hooks/rolAuthRedirect"

const ProductCreate = () =>{
    useRolAuthRedirect();
    
    const [nombre, setNombre] = useState("");
    const [imagenes,setImagenes] = useState({});
    const [precio,setprecio] = useState(1);
    const [cantidad_disponible,setcantidad_disponible] = useState(1);
    const [categoria,setcategoria] = useState("");
    const [selecteCategory, setSelecteCategory] = useState([]);
    const [tipo, setTipo] = useState("");
     const [selecteTipo, setSelecteTipo] = useState([]);
     const [discount, setDiscount] = useState(0);
    const [errors, setErrors] = useState("");
    const [preview,setPreview] = useState({})
    const navigate = useNavigate();

       const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (indexToRemove) => {
  setImagenes((prev) => prev.filter((_, i) => i !== indexToRemove));
  setPreview((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(""); // Reiniciar errores antes de enviar la petición

         // ✅ Validaciones previas
          if (!nombre || !categoria || !tipo || imagenes.length === 0) {
            setErrors("Por favor completa todos los campos y sube al menos una imagen.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }

          if (discount < 0 || discount > 100 || isNaN(discount)) {
            setErrors("El descuento debe estar entre 0 y 100.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
        

        try {
                  const formData = new FormData(); 
              formData.append("nombre",nombre);
              formData.append("precio",precio);
              formData.append("cantidad_disponible",cantidad_disponible);
              formData.append("categoria",categoria);
              formData.append('tipo', tipo);
              formData.append('discount', discount);
              for(const file of imagenes){
                formData.append("imagenes", file);
              }
            const response = await api.post('/products', 
                 formData, {
                 headers: { "Content-Type": "multipart/form-data" },
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
        handleGettipo();
    }, []);

     const handleGettipo = async () => {
        try {
            const response = await api.get('/tipo');
            setSelecteTipo(response.data);
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };
    return (
  <div className="min-h-screen py-12 px-4 bg-white dark:bg-gray-900 overflow-y-auto">
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
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Nombre:
        </label>
        <input
          type="text"
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>

      <div className="mb-5">
        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Precio:
        </label>
        <input
          type="number"
          id="price"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={precio}
          min="1"
          onChange={(e) => setprecio(Math.max(1, parseInt(e.target.value)))}
          required
        />
      </div>

      <div className="mb-5">
        <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Stock:
        </label>
        <input
          type="number"
          id="stock"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={cantidad_disponible}
          min="1"
          onChange={(e) => setcantidad_disponible(Math.max(1, parseInt(e.target.value)))}
          required
        />
      </div>

      <div className="mb-5">
        <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Categoría id:
        </label>
        <select
          value={categoria}
          onChange={(e) => setcategoria(e.target.value)}
          className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Todas las categorías</option>
          {selecteCategory.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tipo:
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Todos los tipos</option>
          {selecteTipo.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block"
          required
        />
      </div>

      {preview.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {preview.map((src, index) => (
            <div key={index} className="relative">
              <img
                src={src}
                alt={`Vista previa ${index + 1}`}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
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