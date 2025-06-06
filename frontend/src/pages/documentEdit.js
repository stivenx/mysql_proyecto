import React, { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate, useParams } from "react-router-dom";

const EditarDocumento = () => {
  const { id } = useParams(); // Obtenemos el ID del documento desde la URL
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenesActuales, setImagenesActuales] = useState([]); // Todas las imágenes existentes
  const [imagenesConservadas, setImagenesConservadas] = useState([]); // Las que el usuario decide conservar
  const [nuevasImagenes, setNuevasImagenes] = useState([]); // Archivos de nuevas imágenes
  const [previewNuevas, setPreviewNuevas] = useState([]); // URLs temporales para mostrar vistas previas

  // Carga los datos del documento al montar el componente
  useEffect(() => {
    const fetchDocumento = async () => {
      try {
        const res = await api.get(`/documentos/${id}`);
        const doc = res.data;
        setTitulo(doc.titulo);
        setDescripcion(doc.descripcion);
        setImagenesActuales(doc.imagenes || []);
        setImagenesConservadas(doc.imagenes || []);
      } catch (error) {
        console.error("Error al cargar documento", error);
      }
    };

    fetchDocumento();
  }, [id]);

  // Elimina una imagen actual de las que se conservarán
  const toggleImagen = (nombre) => {
  setImagenesConservadas((prev) =>
    prev.includes(nombre) // revisa si la imagen ya está en la lista. 
      ? prev.filter((img) => img !== nombre) // Si ya está, la quita (o sea, el usuario quitó el chulo)
      : [...prev, nombre] //  Si no está, la agrega (el usuario puso el chulo)
  );
};



  // Maneja nuevas imágenes y genera vistas previas
  const handleNuevaImagen = (e) => {
    const files = Array.from(e.target.files);
    setNuevasImagenes(files);

    // Crear URLs temporales para vista previa
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewNuevas(previews);
  };

  // Envía el formulario con los datos actualizados
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);

    // Añade imágenes que se conservarán
    imagenesConservadas.forEach((img) =>
      formData.append("imagenesConservadas", img)
    );

    // Añade nuevas imágenes seleccionadas
    nuevasImagenes.forEach((file) => {
      formData.append("imagenes", file);
    });

    try {
      await api.patch(`/documentos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/documentos"); // Redirige a la lista después de editar
    } catch (error) {
      console.error("Error al actualizar documento", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Editar Documento</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo: Título */}
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título"
          className="w-full p-2 border rounded"
          required
        />

        {/* Campo: Descripción */}
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          required
        />

        {/* Imágenes actuales (con opción de eliminar) */}
        <div>
          <p className="font-semibold">Imágenes actuales:</p>
          <div className="flex flex-wrap gap-4">
            {imagenesActuales.map((img) =>
              
                <div key={img} className="relative">
                  <img
                    src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                    alt="Imagen actual"
                    className="w-24 h-24 object-cover rounded"
                  />
                <input
                type="checkbox"
                checked={imagenesConservadas.includes(img)}
                onChange={() => toggleImagen(img)}
                className="absolute top-0 right-0 w-5 h-5 accent-red-600"
                title="Quitar o volver a agregar imagen"
              />



                </div>
             
            )}
          </div>
        </div>

        {/* Campo para nuevas imágenes */}
        <div>
          <p className="font-semibold">Agregar nuevas imágenes:</p>
          <input
            type="file"
            multiple
            onChange={handleNuevaImagen}
            className="mt-2"
          />

          {/* Previsualización de nuevas imágenes */}
          {previewNuevas.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {previewNuevas.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Nueva imagen ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Botón de enviar */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditarDocumento;
