import styled from "styled-components";
import { popularProducts } from "../data";
import Product from "./Product";

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    border-radius: 5px;
    //border: 1px solid lightsteelblue;
    width:100vw;
    height:100vh;
    margin-right: 50px;
    
`;

const Products = () => {
  return (
    <Container>
      {popularProducts.map((item) => (
        <Product item={item} key={item.id} />
      ))};
    </Container>
  );
};

export default Products;