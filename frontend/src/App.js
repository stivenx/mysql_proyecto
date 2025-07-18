import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import "./index.css";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext";
import { RolProvider } from "./context/rolContext";

import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import ProductDetail from './pages/productDetail';
import Login from './pages/login';
import Register from './pages/register';
import Products from './pages/products';
import ProductCreate from "./pages/productsCreate";
import ProductEdit from './pages/productsEdit';
import Users from './pages/users';
import UserEdit from './pages/userEdit';
import Categoryslist from './pages/categoryListen';
import CategoryCreate from './pages/categoryCreate';
import CategoryEdit from './pages/categoryEdit';
import ProductSearch from './pages/searchProducts';
import CartPage from './pages/cartPage';
import Categoryproducts from "./pages/categoryproducts"
import CartModal from './context/cartModal';
import Documents from './pages/documents';
import Documentscreate from './pages/documentsCreate';
import EditarDocumento from './pages/documentEdit';
import  DocumentoDetalle  from './pages/document';
import Categories from './pages/categorys';
import Types from './pages/types';
import TypeCreate from './pages/typesCreate';
import TypeEdit from './pages/typesEdit';
import  ProductsNews from './pages/productsNews';

function App() {
  return (

    <AuthProvider>
    <CartProvider>
    <RolProvider>
    <Router>
      <Navbar />
      <CartModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/ProductCreate" element={<ProductCreate />} />
        <Route path="/ProductEdit/:id" element={<ProductEdit />} />
        <Route path="/Users" element={<Users />} />
        <Route path="/UserEdit/:iduser" element={<UserEdit />} />
        <Route path="/Categorys" element={<Categoryslist />} />
        <Route path="/CategoryCreate" element={<CategoryCreate />} />
        <Route path="/CategoryEdit/:id" element={<CategoryEdit />} />
        <Route path="/ProductSearch" element={<ProductSearch />} />
        <Route path="/Cart" element={<CartPage />} />
        <Route path="/Categoryproducts/:id" element={<Categoryproducts />} />
        <Route path="/documentos" element={<Documents />} />
        <Route path="/documentoscreate" element={<Documentscreate />} />   
        <Route path="/documentosedit/:id" element={<EditarDocumento />} /> 
        <Route path="/documentodetalle/:id" element={<DocumentoDetalle />} />
        <Route path='/categories' element={<Categories/>} />
        <Route path='/types' element={<Types/>} />
        <Route path='/typescreate' element={<TypeCreate/>} />
        <Route path='/typesedit/:id' element={<TypeEdit/>} />
        <Route path='/productsnews' element={<ProductsNews/>} />


      </Routes>
      <Footer />
    </Router>
    </RolProvider>
    </CartProvider>
    </AuthProvider>
  );
}


export default App;
