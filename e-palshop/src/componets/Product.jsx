import React from 'react';
import styled from 'styled-components';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';






const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const Container = styled.div`
  //flex: 1;
  margin: 5px;
  width: 300px;
  height: 300px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;
  &:hover ${Info}{
    opacity: 1;
  }
  border-radius: 5px;
  border: 1px solid greenyellow;
  object-fit: cover;
  margin:0px;
`;


const Image = styled.img`
  height: 85%;
  
  object-fit: cover;
  overflow:hidden;
  
  
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  };





const Product = ({ item }) => {
  return (
    <>
    <Container>
      <Image src={item.image} />
      <Info>
        <Icon>
          <ShoppingCartOutlinedIcon />
        </Icon>
        <Icon>
          <SearchOutlinedIcon/>
        </Icon>
        <Icon>
          <FavoriteBorderOutlinedIcon/>
        </Icon>
      </Info>
      </Container>
    </>
  );
};

export default Product;