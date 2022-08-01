import React from 'react';
import Newsletter from '../componets/Newsletter';
import Footer from '../componets/Footer';
import Header from '../componets/Header';
import Announcement from "../componets/Announcement";
import Products from '../componets/Products';
import styled from "styled-components"
const Container = styled.div``;
const Title = styled.h1`
    margin : 20px;
`;
const FilterContainer = styled.div`
      display : flex;
      justify-content:space-between;
`;
const Filter = styled.div`
      margin: 20px;
`;
const FilterText = styled.span`
      font-size: 20px;
      font-weight:600;

`;
const Select = styled.select`
      padding: 20px;
      font-weight: 600;
      margin:20px;
      font-size: 15px;
      
    

`;
const Option = styled.option``;

const ProductList = () => {
  return (
    <>
      <Container>
        <Header />
        <Announcement />
        <Title>Dresess</Title>
        <FilterContainer>
          <Filter><FilterText>Filter Product:</FilterText>
            <Select>
              <Option disabled selected>Color</Option>
              <Option>white</Option>
              <Option>Black</Option>
              <Option>Red</Option>
              <Option>Green</Option>
              <Option>Blue</Option>
              <Option>Yellow</Option>
            </Select>
            <Select>
              <Option disabled selected>Size</Option>
              <Option>XS</Option>
              <Option>S</Option>
              <Option>M</Option>
              <Option>L</Option>
              <Option>XL</Option>
              <Option>XXL</Option>
            </Select>
          </Filter>
          <Filter><FilterText>Sort Product:</FilterText>
            <Select>
              <Option selected>Newest</Option>
              <Option>price (asc)</Option>
              <Option>price (dese)</Option>
              
            </Select>
          </Filter>
        </FilterContainer>
        <Products />
        <Newsletter/>
      <Footer />
      </Container>
    </>
  )
}

export default ProductList;