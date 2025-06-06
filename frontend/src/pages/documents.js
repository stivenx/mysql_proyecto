import api from "../config/api";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [activeImage, setActiveImage] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documentos/");
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (docId) => {
    try {
      const response = await api.delete(`/documentos/${docId}`);
      if (response.status === 200) {
        setDocuments(documents.filter((doc) => doc.id !== docId));
        alert("El documento se ha eliminado correctamente");
      } else {
        console.error("Error al eliminar el documento:", response.data);
      }
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }
  };

// Botón anterior: imagen previa
  const prevImage = (docId, maxIndex) => {
    setActiveImage((prev) => {
      const currentIndex = prev[docId] ?? 0;
      return {
        ...prev,
        [docId]: currentIndex === 0 ? maxIndex : currentIndex - 1,
      };
    });
  };

  // Botón siguiente: imagen siguiente
  const nextImage = (docId, maxIndex) => {
    setActiveImage((prev) => {
      const currentIndex = prev[docId] ?? 0;
      return {
        ...prev,
        [docId]: currentIndex === maxIndex ? 0 : currentIndex + 1,
      };
    });
  };


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Documentos</h2>
      {documents.map((doc) => {
        const total = doc.imagenes?.length || 0;
        const currentIndex = activeImage[doc.id] || 0;

        return (
          <div key={doc.id} className="mb-8 border p-4 rounded-xl shadow bg-white">
            <h3 className="text-lg font-semibold mb-2">{doc.titulo}</h3>
            <p className="text-gray-600 mb-4">{doc.descripcion}</p>
            <Link
              to={`/documentosedit/${doc.id}`}
              className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Editar Documento
            </Link>

            <Link
              to={`/documentodetalle/${doc.id}`}
              className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Ver Documento
            </Link>

            <button
              onClick={() => handleDelete(doc.id)}
              className="inline-block mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Eliminar Documento
            </button>

            {total > 0 && (
              <div className="relative mb-4">
                {/* Imagen actual */}
                <img
                  src={`http://localhost:5000/${doc.imagenes[currentIndex].replace(/\\/g, "/")}`}
                  alt={`Imagen ${currentIndex + 1}`}
                  className="w-full h-60 object-cover rounded-lg"
                />
                
                {/* Flechas de navegación */}
                {total > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(doc.id, doc.imagenes.length -1)}
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => nextImage(doc.id, doc.imagenes.length -1)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                    >
                      ›
                    </button>

                    

                    {/* Burbujas */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {doc.imagenes.map((_, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setActiveImage((prev) => ({
                              ...prev,
                              [doc.id]: index,
                            }))
                          }
                          className={`w-3 h-3 rounded-full border ${
                            index === currentIndex
                              ? "bg-white border-white"
                              : "bg-gray-400 border-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Documents;

/*


const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [activeImage, setActiveImage] = useState({});

  // Obtener documentos al montar
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/documentos/");
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Botón anterior: imagen previa
  const prevImage = (docId, maxIndex) => {
    setActiveImage((prev) => {
      const currentIndex = prev[docId] ?? 0;
      return {
        ...prev,
        [docId]: currentIndex === 0 ? maxIndex : currentIndex - 1,
      };
    });
  };

  // Botón siguiente: imagen siguiente
  const nextImage = (docId, maxIndex) => {
    setActiveImage((prev) => {
      const currentIndex = prev[docId] ?? 0;
      return {
        ...prev,
        [docId]: currentIndex === maxIndex ? 0 : currentIndex + 1,
      };
    });
  };

  // Carrusel automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => {
        const updated = { ...prev };
        documents.forEach((doc) => {
          const total = doc.imagenes?.length || 0;
          if (total > 1) {
            const current = prev[doc.id] ?? 0;
            updated[doc.id] = current === total - 1 ? 0 : current + 1;
          }
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [documents]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Documentos</h2>

      {documents.map((doc) => {
        const total = doc.imagenes?.length || 0;
        const currentIndex = activeImage[doc.id] ?? 0;

        return (
          <div key={doc.id} className="mb-8 border p-4 rounded-xl shadow bg-white">
            <h3 className="text-lg font-semibold mb-2">{doc.titulo}</h3>
            <p className="text-gray-600 mb-4">{doc.descripcion}</p>

            <Link
              to={`/documentosedit/${doc.id}`}
              className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Ver Documento
            </Link>

            {total > 0 && (
              <div className="relative mb-4 h-60 overflow-hidden rounded-lg">
                {/* Imágenes con transición *}
                {doc.imagenes.map((img, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                    alt={`Imagen ${index + 1}`}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                      index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  />
                ))}

                {/* Botones de navegación izquierda / derecha *}
                {total > 1 && (
                  <>
                    <button
                      onClick={() => prevImage(doc.id, total - 1)}
                      className="absolute z-20 top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:scale-110 transition"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => nextImage(doc.id, total - 1)}
                      className="absolute z-20 top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:scale-110 transition"
                    >
                      ›
                    </button>

                    { Burbujas de navegación }
                    <div className="absolute z-20 bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {doc.imagenes.map((_, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setActiveImage((prev) => ({
                              ...prev,
                              [doc.id]: index,
                            }))
                          }
                          className={`w-3 h-3 rounded-full border transition ${
                            index === currentIndex
                              ? "bg-white border-white scale-110"
                              : "bg-gray-400 border-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Documents; */
