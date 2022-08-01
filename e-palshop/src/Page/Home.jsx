import React from 'react'
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
      <Slider /> 
      <Categorise />
      <Products />
      <Newsletter />
      <Footer/>
    </div>
  )
}

export default Home
