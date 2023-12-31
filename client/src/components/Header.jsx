import { Button, Navbar, Container, Row, FormControl, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



function Header() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar bg='success' variant='dark'>
        <Container fluid>

          <FontAwesomeIcon style={{ fontSize: "2rem", color: "white" }} icon="fa-regular fa-circle-left" onClick={() => navigate(-1)}/>
          <div className="d-flex flex-grow-1 justify-content-center">
            <Button variant="warning" onClick={() => navigate('/')}>
              Gluten-Hub
            </Button>
          </div>
          <Navbar.Brand onClick={() => navigate('/restaurants/1/reviews')} className="bi bi-person-circle" style={{ fontSize: "2rem", marginRight: "0px"  }} />
        </Container>
      </Navbar>
    </>
  );
}



export { Header };
