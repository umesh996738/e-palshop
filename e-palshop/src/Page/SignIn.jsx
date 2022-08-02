import styled from 'styled-components';
import { mobile } from "../responsive";

const SignIn = () => {
    return (
        <>
            <Container>
                <Wrapper>
                    <Title> Sign In</Title>
                    <Form>
                        <Input placeholder="Enter your email address" />
                        <br />
                        <Input placeholder=" Enter your password" />
                    </Form>
                    <Button>Login</Button>
                    <Register>Create Account</Register>
                </Wrapper>
            </Container>
        </>
    )
};
const Container = styled.div`
      width: 100VW;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;

`;

const Wrapper = styled.div`
    width: 30vw;
    height: 60vh;
    border-radius: 5px;
    border:1px solid blue;
    display: flex;
    flex-direction: column;
    margin:20px;
    ${mobile({ width: "75%" })};
`;
const Title = styled.h1`
      
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top:20px;
      margin-bottom: 20px;
      color:blue;
`;
const Form = styled.form`
    display: flex;
    margin :20px;
    flex-direction: column; 
`;

const Input = styled.input`
    display: flex;
    
    padding: 20px;
    border-radius: 5px;
    border:1px solid gray;
    cursor: pointer;
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: blue;
    font-size: 25px;
    font-weight: 800;
    padding: 10px;
    margin-top: 10px;
    margin-left: 10vw;
    margin-right: 10vw;
    border: 1px solid white;
    border-radius: 5px;
    color:white;
    cursor: pointer;
    
`;
const Register = styled.h4`
    margin-top: 100px;
    color:blue;
    margin-left:20px;
    cursor: pointer;
`;

export default SignIn