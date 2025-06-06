import React,{useContext, useEffect, useState} from "react";
import api from "../config/api";
import ProductCard from "../components/productcard";
import { CartContext} from "../context/cartContext"



const Home = () => {
    const [products, setProducts] = useState([]);
    const {cart} = useContext(CartContext)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products/");
                setProducts(response.data);
                console.log(response.data);  
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
            }
            , [cart]);
            return (
                <section className="bg-gray-50 dark:bg-gray-900 py-16">
                  <div className="flex flex-wrap items-center justify-center">
                       <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">Productos</h1>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} className="shadow-md rounded-md" />
                        ))}
                    </div>
                </section>
            )
};

/*

import React, { useContext, useEffect, useState } from "react";
import api from "../config/api";
import ProductCard from "../components/productcard";
import { CartContext } from "../context/cartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { cart } = useContext(CartContext);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/");
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchcategorias = async () => {
    try {
      const response = await api.get("/categoria/");
      setCategorias(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchproductsCategory = async (selectedCategory) => {
    try {
      const response = await api.get(`/products/categoria/${selectedCategory}`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchcategorias();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchproductsCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  }, [selectedCategory]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <div className="flex flex-wrap items-center justify-center">
        <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">Productos</h1>
        <select
          className="w-full md:w-1/3 p-4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todos</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} className="shadow-md rounded-md" />
        ))}
      </div>
    </section>
  );
};

   */

export default Home;
