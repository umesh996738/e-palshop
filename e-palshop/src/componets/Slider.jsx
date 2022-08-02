import React,{useState} from 'react';
import styled from 'styled-components';
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import {sliderItems } from '../data';

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const handlClick = (direction) => { 
    if (direction === "left") {
      setSlideIndex(slideIndex > 0 ? slideIndex-1:2);
    }
    else { 
      setSlideIndex(slideIndex < 2 ? slideIndex+1:0);
    }

  }
  return (
    <>
      <Container>
         <Arrow direction = 'left' onClick={()=>handlClick("left")}>
          
          <ArrowLeftOutlinedIcon />

        </Arrow>
        <Wrapper slideIndex={slideIndex}>
          {
            sliderItems.map((item) => (

            <Slide bg={item.bg} key={ item.id}>
            <ImageContainer>
              <Image src={item.img} alt='image' />
              </ImageContainer>
            <InfoContainer>
                <Title>{ item.title}</Title>
              <Description>
                  <h3>{ item.description}</h3>
                <ul>
                <li>Care Instructions: Dry Clean Only </li>
                <li>Fit Type: Regular</li>
                <li>Fabric : Polyester</li>
                <li>Sleeve Type : Half Sleeve</li>
                <li>Wash Care : first wash is dry clean after that use machine wash or hand wash</li>
                <li> Color : white</li>
              </ul> </Description>
              <Button> Shop Now</Button>
            </InfoContainer>
        </Slide>
         ))}
           </Wrapper>
        <Arrow direction='right' onClick={() => handlClick("right")}>
              <ArrowRightOutlinedIcon />
          </Arrow> 
    </Container>
      
  </>
  )
}

const Container = styled.div`
      width: 100%;
      height: 100vh;
      display:flex;
      position: relative;
      overflow: hidden;
      border-radius: 5px;
      //border: 1px solid;
`;
const Arrow = styled.div`
      width: 50px;
      height: 50px;
      background-color:lightgray ;
      border-radius:50px;
      display: flex;
      align-items: center;
      justify-content: center;
      position:absolute;
      top :0;
      bottom:0;
      left:${props => props.direction === 'left' && '10px'};
      right:${props => props.direction === 'right' && '10px'};
      margin:auto;
      cursor: pointer;
      opacity:0.5;
      z-index:2;
  
`;
const Wrapper = styled.div`
          height:100%;
          display: flex;
          transition: all 1.5s ease;
          transform: translateX(${(props) => props.slideIndex * -100}vw);
`;
const Slide = styled.div`
    border-radius:5px;
    width : 100vw;
    height:100vh;
    display:flex;
    align-items: center;
    background-color:${props => props.bg} ;
`;

const ImageContainer = styled.div`
        height:80%;
        
        flex : 1;
`;

const Image = styled.img`
    //margin-left: 10px;
    height:100%;
    //border: 1px solid;
    border-radius:5px;
    
    
`;
const InfoContainer = styled.div`
    flex: 1;
    padding: 50px;

`;
const Title = styled.h1`
    font-size: 70px;
`;
const Description = styled.p`
    margin: 50px,0px;
    font-size:20px;
    font-weight: 500;
    //letter-spacing:3px;
    

`;
const Button = styled.button`
     padding: 10px;
     font-size: 20px;
     background-color: transparent;
     cursor: pointer;

`;

export default Slider;
