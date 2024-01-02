import { Button, Navbar, Container, Row, FormControl, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from './userContext';
function Header() {
  const navigate = useNavigate();
  //const user = useContext(UserContext);
  const user = useContext(UserContext);
  const isRestaurateur = user && user.isRestaurateur; //se è definito prendo isRestaurater
  const location = useLocation();
  const regexDetails = /\/details$/;
  const regexMenu = /\/menu$/;
  const regexReviews = /\/reviews$/;
//  console.log("header",user && user.isRestaurateur)
  return (
    <>
      <Navbar bg='success' variant='dark' style={{height: 54}}>
        <Container fluid>
          {location.pathname !== "/" ?
          <FontAwesomeIcon style={{ fontSize: "2rem", color: "white" }} icon="fa-regular fa-circle-left" onClick={() => {
            (regexDetails.test(location.pathname) || regexMenu.test(location.pathname) || regexReviews.test(location.pathname)) ?
                navigate('/')
            :
            navigate(-1);
          }} />
          :
          <Button style={{ visibility: 'hidden', marginLeft: "2%", pointerEvents: 'none' }}></Button>
          }
          <div className="d-flex flex-grow-1 justify-content-center">
            <Button variant="warning" onClick={() => navigate('/')}>Gluten-Hub</Button>
          </div>
          {isRestaurateur? 
                    <FontAwesomeIcon icon="fa-solid fa-utensils" onClick={() => navigate('/settings')} style={{
                      borderRadius: '50%',
                      border: '2px solid white',
                      fontSize: '1.25rem',
                      color: 'white',
                      padding: '0.3rem',
                      paddingLeft: '0.35rem',
                      paddingRight: '0.35rem'
                    }} />
              :
              <FontAwesomeIcon icon="fa-solid fa-user" onClick={() => navigate('/settings')} style={{
                borderRadius: '50%',
                border: '2px solid white',
                fontSize: '1.25rem',
                color: 'white',
                padding: '0.3rem',
                paddingLeft: '0.35rem',
                paddingRight: '0.35rem'
              }} />
                  }
        </Container>
      </Navbar>
    </>
  );
}



export { Header };
