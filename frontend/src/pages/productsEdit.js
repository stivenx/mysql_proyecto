import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../config/api';
import  useRolAuthRedirect from "../Hooks/rolAuthRedirect"

const ProductEdit = () => {
    useRolAuthRedirect();

    const [nombre, setNombre] = useState("");
    const [imagenesNuevas,setImagenesNuevas] = useState([]);
    const [imagenesActuales, setImagenesActuales] = useState([]);
    const [precio,setprecio] = useState(0);
    const [cantidad_disponible,setcantidad_disponible] = useState(0);
    const [categoria,setcategoria] = useState("");
    const [selecteCategory, setSelecteCategory] = useState([]);
    const [tipo, setTipo] = useState("");
    const [selecteTipo, setSelecteTipo] = useState([]);
    const [discount, setDiscount] = useState();
    const [etiqueta, setEtiqueta] = useState("");
    const [preview,setPreview] = useState([])
    const [imagenesConservadas, setImagenesConservadas] = useState([]);
     const [errors, setErrors] = useState("");
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        handleGetProduct();
        handleGetCategory();
        handleGettipo();
    }, []);

      const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenesNuevas(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };
 // Elimina una imagen actual de las que se conservarán
  const toggleImagen = (nombre) => {
  setImagenesConservadas((prev) =>
    prev.includes(nombre) // revisa si la imagen ya está en la lista. 
      ? prev.filter((img) => img !== nombre) // Si ya está, la quita (o sea, el usuario quitó el chulo)
      : [...prev, nombre] //  Si no está, la agrega (el usuario puso el chulo)
  );
 };

const removeImage = (indexToRemove) => {
  setImagenesNuevas((prev) => prev.filter((_, i) => i !== indexToRemove));
  setPreview((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors("");

        if (!nombre || !categoria || !tipo ) {
            setErrors("Por favor completa todos los campos y sube al menos una imagen.");
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
        try {
            if (discount < 0 || discount > 100 || isNaN(discount)) {
                alert('El descuento debe estar entre 0 y 100% o ser un número válido.');
                return;
            }

            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('precio', precio);
            formData.append('cantidad_disponible', cantidad_disponible);
            formData.append('categoria', categoria);
            formData.append('tipo', tipo);
            formData.append('discount', discount);
            formData.append('etiqueta', etiqueta || '');
            for (const file of imagenesNuevas) {
                formData.append('imagenes', file);
            }
           for (const img of imagenesConservadas) {
             formData.append('imagenesConservar', img); // ✅ Correcto, sin espacio
            }

            
            const response = await api.patch(`/products/${id}`, formData, {
                 headers: { "Content-Type": "multipart/form-data" },
                
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

     const handleGettipo = async () => {
        try {
            const response = await api.get('/tipo');
            setSelecteTipo(response.data);
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
        setTipo(response.data.tipo);
        setcantidad_disponible(response.data.cantidad_disponible);
        setImagenesActuales(response.data.imagenes);
        setImagenesConservadas(response.data.imagenes);
        setDiscount(response.data.discount);
        setEtiqueta(response.data.etiqueta || "");

    } catch (error) {
        console.error('Error al obtener el producto:', error);
    }
  };

  return (
  <div className="min-h-screen py-12 px-4 bg-white dark:bg-gray-900 overflow-y-auto">
    <h1 className="text-4xl font-semibold text-primary-900 dark:text-white text-center mb-8">
      Editar un producto
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
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
          Categoría:
        </label>
        <select
          value={categoria}
          onChange={(e) => setcategoria(e.target.value)}
          className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Seleccione una categoría</option>
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
          <option value="">Seleccione un tipo</option>
          {selecteTipo.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="discount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Descuento (%):
        </label>
        <input
          type="number"
          id="discount"
          className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          value={discount}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            setDiscount(Math.max(0, Math.min(100, value)));
          }}
          min="0"
          max="100"
          step="1"
        />
      </div>
      <div className="mb-5">
          <label htmlFor="etiqueta" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Etiqueta:
          </label>
          <select
            value={etiqueta}
            onChange={(e) => setEtiqueta(e.target.value)}
            className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Sin etiqueta</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Normal">Normal</option>
            <option value="Oferta">Oferta</option>
            <option value="Destacado">Destacado</option>
          </select>
        </div>

      <div className="mb-5">
        <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Imágenes actuales:
        </label>
        <div className="flex flex-wrap">
          {imagenesActuales.map((imagen, index) => (
            <div key={index} className="relative mr-2 mb-2">
              <img
                src={`http://localhost:5000/${imagen.replace(/\\/g, "/")}`}
                alt={`Imagen ${index}`}
                className="w-24 h-24 object-cover rounded border"
              />
              <input
                type="checkbox"
                checked={imagenesConservadas.includes(imagen)}
                onChange={() => toggleImagen(imagen)}
                className="absolute top-1 right-1 w-5 h-5 accent-red-600"
                title="Quitar o conservar imagen"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block"
        />
      </div>

      <div className="mb-5">
        {preview.length > 0 && (
          <div className="flex flex-wrap">
            {preview.map((url, index) => (
              <div key={index} className="relative w-24 h-24 mr-2 mb-2">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded border"
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
      </div>

      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Actualizar
      </button>
    </form>
  </div>
);


}

export default ProductEdit
    






