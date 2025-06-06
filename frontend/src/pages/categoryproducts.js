import React, { useEffect, useState } from "react";
import api from '../config/api';
import ProductCard from "../components/productcard";


 const  Categoryproducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selecCategory,setSelectCategory] = useState('')
  
  
  useEffect(() => {
    

    
    fetchCategories()
    fetchProducts();
  }, []);
  const fetchCategories = async () =>{
    try {
        const response = await api.get("/categoria")
        setCategory(response.data)
    } catch (error) {
        console.error("error al obtener las categorias:",error)
    }
  }
  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  useEffect(() => {
    if(selecCategory){
        fetchProductsByCategory(selecCategory);
    }
    else{
        fetchProducts()
    }
   },[selecCategory]);


   const fetchProductsByCategory = async (selecCategory) => {

    try {
        const response = await api.get(`/products/categoria/${selecCategory}`)
        setProducts(response.data)
    } catch (error) {
        console.error("error al cargar los productos",error)
    }
   };
    
   const selectedCategory = category.find(cat => cat.id === parseInt(selecCategory));

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      {/* Selector de tipo de producto */}
      <div className="flex justify-center mb-6">
        <select
          value={selecCategory}
          onChange={(event) => setSelectCategory(event.target.value)}
          className="p-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="">Todos los tipos</option>
          {category.map((categoria)=> (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">{selectedCategory ? selectedCategory.nombre : ""}</h1>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No hay productos de este tipo</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} className="shadow-md rounded-md" />
          ))
        )}
      </div>
    </section>
  );




}


export default Categoryproducts