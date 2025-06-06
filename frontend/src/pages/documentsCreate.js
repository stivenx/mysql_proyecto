import { useState } from "react";
import api from "../config/api"; // Axios preconfigurado
import { useNavigate } from "react-router-dom";

export default function CreateDocumento() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [preview, setPreview] = useState([]);
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
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    for (const file of imagenes) {
      formData.append("imagenes", file); // este nombre debe coincidir con el backend
    }

    try {
      await api.post("/documentos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/documentos");
    } catch (err) {
      console.error("Error al crear documento:", err);
      alert("Hubo un error al subir el documento.");
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear Documento</h1>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        className="w-full border p-2"
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full border p-2"
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block"
      />

      <div className="flex flex-wrap gap-2 mt-2">
        {preview.map((src, idx) => (
        <div key={idx} className="relative">
          <img
            src={src}
            alt={`preview-${idx}`}
            className="w-24 h-24 object-cover rounded"
          />
          <button
            type="button"
            onClick={() => removeImage(idx)} // <--- Cambiado: usamos el índice
            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>
       ))}
      </div>

      <button
        type="button"
        className="bg-red-600 text-white px-4 py-2 rounded"
        onClick={() => {
          setImagenes([]);
          setPreview([]);
        }}
      >
        Borrar todas las imágenes
      </button>


      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Crear documento
      </button>
    </form>
  );
}
