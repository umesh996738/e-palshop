import React from 'react';
import styled from 'styled-components';
import { mobile } from "../responsive";



const Container = styled.div`
    width:100vw;
    height:100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Wrapper = styled.div`
    width:30vw;
    height:80vh;
    border-radius: 5px;
    border:1px solid black;
    box-shadow: 3px 2px 3px 2px lightgray;
`;
const Title = styled.h1`
    font-size:24px;
    font-weight: 800;
    color:blue;
    margin: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const From = styled.form`
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        margin: 20px ;
        display: flex;
        border:none;
        
        
`;
 const Input = styled.input`
    border-radius: 5px;
    padding: 10px;
    border: 1px solid lightgray;
`;

const Button = styled.button`
    display: flex;
    width:30%;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color:blue ;
    color:white ;
    font-weight: 800;
    font-size: 20px;
    margin-left: 10vw;
    margin-right: 10vw;
    border-radius:5px;
`;
const Aggrement = styled.p`
    margin-left:10px;
    margin-top: 8vh;
    font-size: 15px;
    font-weight: 800;
    color:blue;
`;

const Register = () => {
  return (
    <>
    <Container>
        <Wrapper>
             <Title>Create Account</Title> 
                  <From>
                      
                          <Input placeholder="First Name" />
                          
                      <br />
                      
                           <Input placeholder="Last Name" />
                      
                     
                      <br />
                      
                          <Input placeholder="Email" />
                        
                        
                      <br />
                      
                          <Input placeholder="Username" />
                    
                      
                      <br />
                    
                          <Input placeholder="Phone" />
                      
                      
                      <br />
                      
                          <Input placeholder="password" />
                      
                      
                      <br />
                      
                      <Input placeholder="confirm password" />
                      <br />

                    
                      
                  </From>
                 <Button>Submit</Button>
                 <Aggrement>Privacy</Aggrement>

        </Wrapper>          
              
    </Container>
    </>
  )
}

export default Register
