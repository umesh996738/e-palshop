import React from 'react'
// import Navbar from '../componets/Navbar';
import Header from '../componets/Header';
import Announcement from "../componets/Announcement";
import Slider from '../componets/Slider';
import Categorise from '../componets/Categories';
import Products from '../componets/Products';
import Newsletter from '../componets/Newsletter';
import Footer from '../componets/Footer';


const Home = () => {
  return (
    <div>
      <Announcement />
      <Header/>
      {/* <Navbar /> */}
      <Slider /> 
      <Categorise />
      <Products />
      <Newsletter />
      <Footer/>
    </div>
  )
}

export default Home
