import React from 'react';
import styled from "styled-components";
import Header from '../componets/Header';
import Announcement from "../componets/Announcement";
import Newsletter from '../componets/Newsletter';
import Footer from '../componets/Footer';
import { mobile } from "../responsive";
import { Add, Remove } from '@mui/icons-material';


const Cart = () => {
    return (
        <>
            <Container>
                <Header />
                <Announcement />
                <Wrapper>
                    <Title>YOUR BAG</Title>
                    <Top>
                        <TopButton >Continous Shopping </TopButton>
                        <TopTexts>
                            <TopText>Shopping Bag(2)</TopText>
                            <TopText> Your WishList(0)</TopText>
                        </TopTexts>
                        <TopButton >CheckOut Now</TopButton>
                    </Top>
                    <Bottom>
                        <Info>
                            <Products>
                                <ProductDetails>
                                
                                    <Image src="https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1614188818-TD1MTHU_SHOE_ANGLE_GLOBAL_MENS_TREE_DASHERS_THUNDER_b01b1013-cd8d-48e7-bed9-52db26515dc4.png?crop=1xw:1.00xh;center,top&resize=480%3A%2A" />

                                    <Details>
                                        <ProductName><b>Product:</b>Nike Shoes</ProductName>
                                        <ProductId><b>ID:</b>7876646464646</ProductId>
                                        <ProductColor color="black" />
                                        <ProductSize><b>Size:</b> 37.8</ProductSize>
                                    </Details>
                                </ProductDetails>
                                <PriceDetails>
                                    <PriceAmountContainer>
                                        <Add />
                                        <PriceAmount>1</PriceAmount>
                                        <Remove />
                                      
                                    </PriceAmountContainer>
                                    <ProductPrice>$40</ProductPrice>
                                </PriceDetails>
                              
                            </Products>
                            <Hr />
                          
                            <Products>
                                <ProductDetails>
                                
                                    <Image src="https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1614188818-TD1MTHU_SHOE_ANGLE_GLOBAL_MENS_TREE_DASHERS_THUNDER_b01b1013-cd8d-48e7-bed9-52db26515dc4.png?crop=1xw:1.00xh;center,top&resize=480%3A%2A" />

                                    <Details>
                                        <ProductName><b>Product:</b>Nike Shoes</ProductName>
                                        <ProductId><b>ID:</b>7876646464646</ProductId>
                                        <ProductColor color="black" />
                                        <ProductSize><b>Size:</b> 37.8</ProductSize>
                                    </Details>
                                </ProductDetails>
                                <PriceDetails>
                                    <PriceAmountContainer>
                                        <Add />
                                        <PriceAmount>1</PriceAmount>
                                        <Remove />
                                      
                                    </PriceAmountContainer>
                                    <ProductPrice>$40</ProductPrice>
                                </PriceDetails>
                              
                            </Products>
                        </Info>
                        <Summary>
                            <SummaryTitle>Oder Summary </SummaryTitle>
                            <SummaryItem>
                                <SummaryItemText>Subtotal</SummaryItemText>
                                <SummaryItemPrice>$ 80</SummaryItemPrice>
                            </SummaryItem>
                            <SummaryItem>
                                <SummaryItemText>Estimated Shipping</SummaryItemText>
                                <SummaryItemPrice>$5.90</SummaryItemPrice>
                            </SummaryItem>
                            <SummaryItem>
                                <SummaryItemText>Shipping Discount</SummaryItemText>
                                <SummaryItemPrice>-$5.90</SummaryItemPrice>
                            </SummaryItem>
                            <SummaryItem type="total">
                                <SummaryItemText >Total</SummaryItemText>
                                <SummaryItemPrice>$80</SummaryItemPrice>
                            </SummaryItem>
                            <Button>CHECKOUT NOW</Button>

                        </Summary>
                    </Bottom>
                  
                  
                </Wrapper>
                <Newsletter />
                <Footer />
            </Container>
        </>
    )
}


const Container = styled.div`
        width :100vw;
        height: 100vh;
        

`;
const Wrapper = styled.div`
        width :100vw;
        height: 100vh;
        border: 1px solid blue;
        border-radius: 5px;
        margin-top: 2px;
        ${mobile({ padding: "10px" })};
`;
const Title = styled.h1`
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    align-items: center;
    justify-content: center;
`;
const Top = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
`;
const TopButton = styled.button`
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        padding: 20px;
        font-size: 25px;
        font-weight: 700;
        color: white;
        border-radius: 8px;
        cursor: pointer;
        background-color: blue;
`;
const TopTexts = styled.div`
    display: flex;
    font-size: 18px;
    ${mobile({ display: "none" })};
`;
const TopText = styled.span`
        margin: 0px 10px;
        font-weight: 800;
        font-size: 27px;
        cursor: pointer;
        text-decoration: underline;
`;
const Bottom = styled.div`
    
    display: flex;
    justify-content: space-between;
    ${mobile({ flexDirection: "column" })};

`;
const Info = styled.div`
        flex: 3;
`;
const Summary = styled.div`
        flex:1;
        width: 25vw;
        border: 1px solid lightgrey;
        //background-color: red;
        border-radius:10px;
        height:50vh;
        padding: 20px;
`;
const Products = styled.div`
    display: flex;
    justify-content: space-between;
      ${mobile({ flexDirection: "column" })};
`;

const Image = styled.img`
    width: 200px;
`;

const Details = styled.div`
    padding: 20px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

const ProductName = styled.span``;

const ProductId = styled.div``;


const ProductColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50px;
    background-color: ${props=>props.color};
`;

const ProductSize = styled.div``;

const ProductDetails = styled.div`
        display: flex;
        flex:2; 
`;

const PriceDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const PriceAmountContainer = styled.div`
        display: flex;
        align-items: center;
        margin-bottom: 20px;
`;

const PriceAmount = styled.div`
        font-size:24px;
        margin: 10px;
        ${mobile({ margin: "5px 15px" })};
        ${mobile({ flexDirection: "column" })};
`;

const ProductPrice = styled.div`
        font-size:30px;
        font-weight:400;
        ${mobile({ marginBottom: "20px" })};
        /* ${mobile({ flexDirection: "column" })}; */
`;

const Hr = styled.hr`
        background-color: white;
        border: 0.1px  solid lightgrey;
        border-radius: 1px;
        height:1px;
`;

const SummaryTitle = styled.h1`
        font-size:25px;
        font-weight:500;

`;
const SummaryItem = styled.div`
    margin:30px 0px;
    display:flex;
    font-size:18px;
    font-weight: 600;
    justify-content: space-between;
    font-weight: ${(props) => props.type === "total" && "800"};
    font-size:${(props)=>props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;
const SummaryItemPrice = styled.span``;


const Button = styled.button`
        display: flex;
        font-size:24px;
        font-weight:800;
        justify-content: center;
        padding:10px;
        align-items: center;
        margin-left:7vw;
        margin-right:7vw;
        border-radius: 5px;
        background-color: orangered;
        color: white;
        cursor: pointer;
`;

export default Cart