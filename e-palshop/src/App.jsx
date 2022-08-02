import React from 'react';
import Home from './Page/Home';
import ProductList from './Page/ProductList';
import Product from './Page/Product';
import Register from './Page/Register';
import SignIn from './Page/SignIn';
import Cart from './Page/Cart';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


const App = () => {
  return (
    <>
        <Router>
    
        <Routes>
        <Route path="/" element={<Home />} /> 
          <Route path="/ProductList" element={<ProductList />} /> 
          <Route path="/Product" element={<Product />} /> 
          <Route path="/Register" element={<Register />} /> 
          <Route path="/SignIn" element={<SignIn />} /> 
          <Route path="/Cart" element={<Cart />} />
        </Routes>
        </Router>
        
      
      {/* <ProductList/>  */}
      {/* <Product/> */}
     {/* <Register/>  */}
      {/* <SignIn/>  */}
      {/* <Cart/> */}
      
      </>
  )
}

export default App
