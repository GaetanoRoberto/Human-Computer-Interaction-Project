import { Button, Navbar, Container, Row, FormControl, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';




function Header() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg='success' variant='dark' >
        <Container fluid >
          <Button style={{ visibility: 'hidden', pointerEvents: 'none' }}></Button>
          <Button variant="warning" className='justify-content-between' onClick={() => navigate('/')}>Gluten-Hub</Button>
          <Navbar.Brand  onClick={() => navigate('/restaurants/1/reviews')} className="bi bi-person-circle  justify-content-end" style={{ fontSize: "2rem", marginRight: "0px" }}  />
        </Container>
      </Navbar >
    </>
  );
}



export { Header };
