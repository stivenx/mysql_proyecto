import React, { useEffect, useState } from "react";
import api from "../config/api";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categoria/");
      setCategories(response.data);
    } catch (error) {
      console.error("Error al cargar las categorías:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-10">
        Explora por Categoría
      </h2>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No hay categorías disponibles.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              to={`/Categoryproducts/${cat.id}`}
              key={cat.id}
              className="group block bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="text-xl font-semibold text-gray-700 dark:text-white group-hover:text-primary-500 transition-colors">
                {cat.nombre}
              </div>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Ver productos
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

