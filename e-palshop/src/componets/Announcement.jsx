import styled from "styled-components";



const Announcement = () => {
  return <Container>Super Deal! Get Discount Every Product up to 5% </Container>;
};

const Container = styled.div`
  height: 30px;
  background-color: teal;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: 500;
`;

export default Announcement;