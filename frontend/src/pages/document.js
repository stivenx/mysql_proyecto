import ProductGallery from "../context/documentGaleri"; // Ajusta la ruta
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../config/api";

const DetailProduct = () => {
  const { id } = useParams();
  const [documento, setDocumento] = useState(null);

  useEffect(() => {
    const fetchDocumento = async () => {
      const res = await api.get(`/documentos/${id}`);
      setDocumento(res.data);
    };

    fetchDocumento();
  }, [id]);

  if (!documento) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{documento.titulo}</h1>
      <ProductGallery images={documento.imagenes} />
      <p className="mt-6">{documento.descripcion}</p>
    </div>
  );
};

export default DetailProduct;
