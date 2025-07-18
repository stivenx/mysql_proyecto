/*
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../config/api";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";

const ProductDetail = () => {
  const [product, setProduct] = useState({
    imagenes: [],
    nombre: '',
    precio: "",
    cantidad_disponible: "",
    categoria_nombre: '',
    tipo_nombre: '',
    discount: 0
  });

  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const { addToCart, fetchCart, toggleCart, cart } = useContext(CartContext);
  const { userId } = useContext(AuthContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [comentarioEnEdicion, setComentarioEnEdicion] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };
    fetchProduct();
    fetchComentarios();
  }, [id, cart]);

  const fetchComentarios = async () => {
    try {
      const response = await api.get(`/comentarios/${id}`);
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  const enviarComentario = async () => {
    if (!userId) return alert("Debes iniciar sesión para comentar");
    if (!nuevoComentario.trim()) return alert("Comentario vacío");

    try {
      if (comentarioEnEdicion) {
        await api.patch(`/comentarios/${comentarioEnEdicion}`, {
          comentario: nuevoComentario,
          calificacion,
        });
      } else {
        await api.post("/comentarios", {
          id_producto: id,
          id_usuario: userId,
          comentario: nuevoComentario,
          calificacion,
        });
      }

      setNuevoComentario("");
      setCalificacion(5);
      setComentarioEnEdicion(null);
      fetchComentarios();
    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  const handleEditarComentario = (comentario) => {
    setNuevoComentario(comentario.comentario);
    setCalificacion(comentario.calificacion);
    setComentarioEnEdicion(comentario.id);
  };

  const handleEliminarComentario = async (idComentario) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este comentario?");
    if (!confirmar) return;

    try {
      await api.delete(`/comentarios/${idComentario}`);
      fetchComentarios();
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    if (cantidad <= 0 || isNaN(cantidad)) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    try {
      const response2 = await api.get(`/products/${id}`);
      const updatedProduct = response2.data;

      if (updatedProduct.cantidad_disponible <= 0) {
        alert("Este producto ya no está disponible.");
        setProduct(updatedProduct);
        return;
      }

      await addToCart(userId, updatedProduct, cantidad);
      await fetchCart(userId);
      const response3 = await api.get(`/products/${id}`);
      setProduct(response3.data);
      setCantidad(1);
      setTimeout(() => {
        toggleCart();
      }, 100);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  const discountPercentage = product.discount ?? 0;
  const finalPrice = product.precio - (product.precio * (discountPercentage / 100));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.imagenes.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.imagenes.length - 1 : prev - 1));
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Carrusel de imágenes *}
          <div className="md:w-1/2 flex relative">
            <div className="flex flex-col space-y-2 mr-4">
              {product.imagenes?.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                  alt={`Miniatura ${index}`}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${index === currentImageIndex ? "border-blue-600" : "border-transparent"}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
            <div className="relative flex-1 h-[500px] rounded-lg bg-white dark:bg-black shadow-lg flex items-center justify-center overflow-hidden">
              <img
                className={`w-full h-full object-contain rounded-lg transition duration-500 ${product.cantidad_disponible === 0 ? "opacity-50" : ""}`}
                src={`http://localhost:5000/${product.imagenes?.[currentImageIndex]?.replace(/\\/g, "/") || ""}`}
                alt={product.nombre}
              />
              {product.cantidad_disponible === 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">AGOTADO</div>
              )}
              {product.imagenes?.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">‹</button>
                  <button onClick={nextImage} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">›</button>
                </>
              )}
            </div>
          </div>

          {/* Detalles del producto *}
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{product.nombre}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2"><span className="font-semibold">Categoría:</span> {product.categoria_nombre}</p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2"><span className="font-semibold">Tipo:</span> {product.tipo_nombre}</p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2"><span className="font-semibold">Stock disponible:</span> {product.cantidad_disponible}</p>

            <div className="flex flex-col mb-6">
              {discountPercentage > 0 ? (
                <>
                  <span className="text-sm font-bold text-red-600 bg-red-200 px-2 py-1 rounded-lg w-fit">-{discountPercentage}% OFF</span>
                  <span className="text-xl font-bold text-gray-500 line-through">${product.precio} COL</span>
                  <span className="text-2xl font-bold text-green-600">${finalPrice.toFixed(2)} COL</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.precio} COL</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {product.cantidad_disponible > 0 ? (
                <>
                  <input
                    type="number"
                    min="1"
                    max={product.cantidad_disponible}
                    value={cantidad}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setCantidad(isNaN(value) ? 1 : Math.max(1, Math.min(product.cantidad_disponible, value)));
                    }}
                    className="w-20 p-2 border rounded-lg text-center text-lg font-semibold"
                  />
                  <button onClick={handleAddToCart} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition duration-300">
                    🛒 Agregar al Carrito
                  </button>
                </>
              ) : (
                <span className="text-red-600 text-lg font-bold">No hay stock disponible</span>
              )}
            </div>
          </div>
        </div>

        {/* Comentarios *}
        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Comentarios</h3>

          {comentarios.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No hay comentarios aún.</p>
          ) : (
            comentarios.map((c) => (
              <div key={c.id} className="mb-4 border-b pb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-blue-600 font-semibold">{c.nombre_usuario}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i <= c.calificacion ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.182 3.64a1 1 0 00.95.69h3.822c.969 0 1.371 1.24.588 1.81l-3.088 2.244a1 1 0 00-.364 1.118l1.182 3.64c.3.921-.755 1.688-1.538 1.118L10 13.011l-3.083 2.188c-.783.57-1.838-.197-1.538-1.118l1.182-3.64a1 1 0 00-.364-1.118L3.11 9.067c-.783-.57-.38-1.81.588-1.81h3.822a1 1 0 00.95-.69l1.182-3.64z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({c.calificacion})</span>
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-100">{c.comentario}</p>
                <small className="text-gray-400">{new Date(c.fecha_comentario).toLocaleString()}</small>
                

                {userId === c.id_usuario && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEditarComentario(c)} className="text-blue-600 hover:underline text-sm">Editar</button>
                    <button onClick={() => handleEliminarComentario(c.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                  </div>
                )}
              </div>
            ))
          )}

          {userId && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{comentarioEnEdicion ? "Editando comentario" : "Escribe tu comentario"}</h4>
              <textarea
                className="w-full p-2 rounded border dark:bg-gray-900 dark:text-white"
                rows={4}
                placeholder="Tu comentario..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              />
              <div className="flex items-center gap-4 mt-2">
                <label className="text-gray-800 dark:text-white">Calificación:</label>
                <select
                  className="p-1 border rounded"
                  value={calificacion}
                  onChange={(e) => setCalificacion(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
                <button onClick={enviarComentario} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {comentarioEnEdicion ? "Actualizar" : "Enviar"}
                </button>
                {comentarioEnEdicion && (
                  <button
                    onClick={() => {
                      setComentarioEnEdicion(null);
                      setNuevoComentario("");
                      setCalificacion(5);
                    }}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

*/
 
  
 
  import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../config/api";
import { AuthContext } from "../context/authContext";
import { CartContext } from "../context/cartContext";

const ProductDetail = () => {
  const [product, setProduct] = useState({
    imagenes: [],
    nombre: '',
    precio: "",
    cantidad_disponible: "",
    categoria_nombre: '',
    tipo_nombre: '',
    discount: 0
  });

  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);
  const { addToCart, fetchCart, toggleCart, cart } = useContext(CartContext);
  const { userId } = useContext(AuthContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [comentarioEnEdicion, setComentarioEnEdicion] = useState(null);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [preview, setPreview] = useState([]);
  const [imagenesActuales, setImagenesActuales] = useState([]);
  const [imagenesConservadas, setImagenesConservadas] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };
    fetchProduct();
    fetchComentarios();
  }, [id, cart]);

  const fetchComentarios = async () => {
    try {
      const response = await api.get(`/comentarios/${id}`);
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setImagenesNuevas(files);
        setPreview(files.map((file) => URL.createObjectURL(file)));
      };

   const toggleImagen = (nombre) => {
    setImagenesConservadas((prev) =>
      prev.includes(nombre)
        ? prev.filter((img) => img !== nombre)
        : [...prev, nombre]
    );
  };

  const removeImage = (indexToRemove) => {
  setImagenesNuevas((prev) => prev.filter((_, i) => i !== indexToRemove));
  setPreview((prev) => prev.filter((_, i) => i !== indexToRemove));
  };
  const enviarComentario = async () => {
    if (!userId) return alert("Debes iniciar sesión para comentar");
    if (!nuevoComentario.trim()) return alert("Comentario vacío");

    try {
      if (comentarioEnEdicion) {
        const formData = new FormData();
          formData.append("comentario", nuevoComentario);
          formData.append("calificacion", calificacion);
          for (const file of imagenesNuevas) {
            formData.append("imagenes", file);
          }
          for (const img of imagenesConservadas) {
            formData.append("imagenesConservadas", img); // ✅ Correcto, sin espacio
          }
          await api.patch(`/comentarios/${comentarioEnEdicion}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const formData = new FormData();
        for (const file of imagenesNuevas) {
          formData.append("imagenes", file);
        }
         formData.append("comentario", nuevoComentario);
         formData.append("calificacion", calificacion);
         formData.append("id_producto", id);
         formData.append("id_usuario", userId);
        await api.post("/comentarios", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setNuevoComentario("");
      setCalificacion(5);
      setComentarioEnEdicion(null);
      fetchComentarios();
      setImagenesNuevas([]);
      setPreview([]);
      setImagenesConservadas([]);

    } catch (error) {
      console.error("Error al enviar comentario:", error);
    }
  };

  const handleEditarComentario = (comentario) => {
    setNuevoComentario(comentario.comentario);
    setCalificacion(comentario.calificacion);
    setComentarioEnEdicion(comentario.id);
    setImagenesConservadas(comentario.imagenes);
    setImagenesActuales(comentario.imagenes);
  };

  const handleEliminarComentario = async (idComentario) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar este comentario?");
    if (!confirmar) return;

    try {
      await api.delete(`/comentarios/${idComentario}`);
      fetchComentarios();
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    if (cantidad <= 0 || isNaN(cantidad)) {
      alert("La cantidad debe ser mayor a 0.");
      return;
    }

    try {
      const response2 = await api.get(`/products/${id}`);
      const updatedProduct = response2.data;

      if (updatedProduct.cantidad_disponible <= 0) {
        alert("Este producto ya no está disponible.");
        setProduct(updatedProduct);
        return;
      }

      await addToCart(userId, updatedProduct, cantidad);
      await fetchCart(userId);
      const response3 = await api.get(`/products/${id}`);
      setProduct(response3.data);
      setCantidad(1);
      setTimeout(() => {
        toggleCart();
      }, 100);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  const discountPercentage = product.discount ?? 0;
  const finalPrice = product.precio - (product.precio * (discountPercentage / 100));

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.imagenes.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.imagenes.length - 1 : prev - 1));
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Carrusel de imágenes */}
          <div className="md:w-1/2 flex relative">
            <div className="flex flex-col space-y-2 mr-4">
              {product.imagenes?.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                  alt={`Miniatura ${index}`}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${index === currentImageIndex ? "border-blue-600" : "border-transparent"}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
            <div className="relative flex-1 h-[500px] rounded-lg bg-white dark:bg-black shadow-lg flex items-center justify-center overflow-hidden">
              <img
                className={`w-full h-full object-contain rounded-lg transition duration-500 ${product.cantidad_disponible === 0 ? "opacity-50" : ""}`}
                src={`http://localhost:5000/${product.imagenes?.[currentImageIndex]?.replace(/\\/g, "/") || ""}`}
                alt={product.nombre}
              />
              {product.cantidad_disponible === 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-lg">AGOTADO</div>
              )}
              {product.imagenes?.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">‹</button>
                  <button onClick={nextImage} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full">›</button>
                </>
              )}
            </div>
          </div>

          {/* Detalles del producto */}
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{product.nombre}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2"><span className="font-semibold">Categoría:</span> {product.categoria_nombre}</p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2"><span className="font-semibold">Tipo:</span> {product.tipo_nombre}</p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2"><span className="font-semibold">Stock disponible:</span> {product.cantidad_disponible}</p>

            <div className="flex flex-col mb-6">
              {discountPercentage > 0 ? (
                <>
                  <span className="text-sm font-bold text-red-600 bg-red-200 px-2 py-1 rounded-lg w-fit">-{discountPercentage}% OFF</span>
                  <span className="text-xl font-bold text-gray-500 line-through">${product.precio} COL</span>
                  <span className="text-2xl font-bold text-green-600">${finalPrice.toFixed(2)} COL</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.precio} COL</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {product.cantidad_disponible > 0 ? (
                <>
                  <input
                    type="number"
                    min="1"
                    max={product.cantidad_disponible}
                    value={cantidad}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setCantidad(isNaN(value) ? 1 : Math.max(1, Math.min(product.cantidad_disponible, value)));
                    }}
                    className="w-20 p-2 border rounded-lg text-center text-lg font-semibold"
                  />
                  <button onClick={handleAddToCart} className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition duration-300">
                    🛒 Agregar al Carrito
                  </button>
                </>
              ) : (
                <span className="text-red-600 text-lg font-bold">No hay stock disponible</span>
              )}
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Comentarios</h3>

          {comentarios.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No hay comentarios aún.</p>
          ) : (
            comentarios.map((c) => (
              <div key={c.id} className="mb-4 border-b pb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-blue-600 font-semibold">{c.nombre_usuario}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i <= c.calificacion ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.182 3.64a1 1 0 00.95.69h3.822c.969 0 1.371 1.24.588 1.81l-3.088 2.244a1 1 0 00-.364 1.118l1.182 3.64c.3.921-.755 1.688-1.538 1.118L10 13.011l-3.083 2.188c-.783.57-1.838-.197-1.538-1.118l1.182-3.64a1 1 0 00-.364-1.118L3.11 9.067c-.783-.57-.38-1.81.588-1.81h3.822a1 1 0 00.95-.69l1.182-3.64z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({c.calificacion})</span>
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-100">{c.comentario}</p>
                {c.imagenes && c.imagenes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {c.imagenes.map((img, i) => (
                      <img
                        key={i}
                        src={`http://localhost:5000/${img}`}
                        alt={`comentario-${c.id}-${i}`}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
                <small className="text-gray-400">{new Date(c.fecha_comentario).toLocaleString()}</small>

                {userId === c.id_usuario && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEditarComentario(c)} className="text-blue-600 hover:underline text-sm">Editar</button>
                    <button onClick={() => handleEliminarComentario(c.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                  </div>
                )}
              </div>
            ))
          )}

          {userId && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{comentarioEnEdicion ? "Editando comentario" : "Escribe tu comentario"}</h4>
              <textarea
                className="w-full p-2 rounded border dark:bg-gray-900 dark:text-white"
                rows={4}
                placeholder="Tu comentario..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              />

               <div className="my-3">
                <label className="text-gray-800 dark:text-white">Imágenes nuevas:</label>
                <input type="file" multiple onChange={handleFileChange} className="block mt-1" />

                <div className="flex flex-wrap gap-2 mt-2">
                  {preview.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt={`Preview ${i}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>


               {comentarioEnEdicion && imagenesActuales.length > 0 && (
                <div className="my-3">
                  <label className="text-gray-800 dark:text-white">Imágenes actuales:</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagenesActuales.map((img, i) => (
                      <label key={i} className="flex flex-col items-center text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={imagenesConservadas.includes(img)}
                          onChange={() => toggleImagen(img)}
                        />
                        <img
                          src={`http://localhost:5000/${img}`}
                          alt={`actual-${i}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 mt-2">
                <label className="text-gray-800 dark:text-white">Calificación:</label>
                <select
                  className="p-1 border rounded"
                  value={calificacion}
                  onChange={(e) => setCalificacion(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} ★</option>
                  ))}
                </select>
                <button onClick={enviarComentario} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {comentarioEnEdicion ? "Actualizar" : "Enviar"}
                </button>
                {comentarioEnEdicion && (
                  <button
                    onClick={() => {
                      setComentarioEnEdicion(null);
                      setNuevoComentario("");
                      setCalificacion(5);
                      setImagenesNuevas([]);
                      setImagenesConservadas([]);
                      setPreview([]);
                      setImagenesActuales([]);
                    }}
                    className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail; 





