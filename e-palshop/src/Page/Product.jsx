import styled from "styled-components";
import Newsletter from '../componets/Newsletter';
import Footer from '../componets/Footer';
import Header from '../componets/Header';
import Announcement from "../componets/Announcement";
import { mobile } from "../responsive";
import { Add, Remove } from "@mui/icons-material";




const Container = styled.div``;

const Wrapper = styled.div`
    padding: 50px;
    display: flex;
`;

const ImageContainer = styled.div`
        flex:1;
`;

const Image = styled.img`
        width: 100%;
        height: 90vh;
        object-fit: cover;
`;

const InfoContainer = styled.div`
        flex:1;
        padding: 0px 50px;
`;

const Title = styled.h1`
    font-weight: 600;
    margin: 20px 0px;
`;

const Desc = styled.p`
    margin: 20px 0px;
`;

const Price = styled.span`
    font-weight:800;
    font-size: 40px;
`;


const FilterContainer = styled.div`
  width: 50%;
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterTitle = styled.span`
  font-size: 20px;
  font-weight: 400;
`;

const FilterColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
`;

const FilterSize = styled.select`
  margin-left: 10px;
  padding: 5px;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ width: "100%" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const Button = styled.button`
  padding: 15px;
  border: 2px solid teal;
  background-color: white;
  cursor: pointer;
  font-weight: 500;
  &:hover{
      background-color: #f8f4f4;
  }`;

const Product = () => {
  return (
      <>
          <Container>
              <Header />
              <Announcement />
              <Wrapper>
                  <ImageContainer>
                      <Image src = "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1635&q=80" alt = "image"/>
                  </ImageContainer>
                  <InfoContainer>
                      <Title>Lymio Women's Dress</Title>
                      <Desc>
                        <h3>Description:</h3>
                        <ul>
                            <li>Care Instructions: Dry Clean Only </li>
                            <li>Fit Type: Regular</li>
                            <li>Fabric : Polyester</li>
                            <li>Sleeve Type : Half Sleeve</li>
                            <li>Wash Care : first wash is dry clean after that use machine wash or hand wash</li>
                            <li> Color : white</li>
                        </ul> 
                      </Desc>
                      <Price>$199.99</Price>
                     <FilterContainer>
                    <Filter>
                        <FilterTitle>Color</FilterTitle>
                        <FilterColor color="black" />
                        <FilterColor color="darkblue" />
                        <FilterColor color="gray" />
                    </Filter>
                    <Filter>
                        <FilterTitle>Size</FilterTitle>
                    <FilterSize>
                        <FilterSizeOption>XS</FilterSizeOption>
                        <FilterSizeOption>S</FilterSizeOption>
                        <FilterSizeOption>M</FilterSizeOption>
                        <FilterSizeOption>L</FilterSizeOption>
                        <FilterSizeOption>XL</FilterSizeOption>
                    </FilterSize>
                    </Filter>
                     </FilterContainer>
                    <AddContainer>
                        <AmountContainer>
                        <Remove />
                        <Amount>1</Amount>
                        <Add />
                        </AmountContainer>
                        <Button>ADD TO CART</Button>
                        </AddContainer>
        
                </InfoContainer>
              </Wrapper>
            <Newsletter />
            <Footer />
        </Container>
    </>
  )
}

export default Product