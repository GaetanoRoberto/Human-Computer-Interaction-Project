import { Button, Navbar, Container, Row, FormControl, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext ,useState} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UserContext } from './userContext';

function Header(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  //const user = useContext(UserContext);
  const user = useContext(UserContext);
  const isRestaurateur = user && user.isRestaurateur; //se è definito prendo isRestaurater
  const location = useLocation();
  const detailsMenuReviews = location.pathname == `/restaurants/${id}/details` || location.pathname == `/restaurants/${id}/menu` || location.pathname == `/restaurants/${id}/reviews`
  //console.log("header",detailsMenuReviews,location.pathname)
  const userIcon = <FontAwesomeIcon icon="fa-solid fa-user" onClick={() => navigate('/settings')} style={{
    borderRadius: '50%',
    border: '2px solid white',
    fontSize: 'rem',
    color: 'white',
    padding: '0.3rem',
    paddingLeft: '0.35rem',
    paddingRight: '0.35rem',         marginRight: '10px',

  }} />
  const restaurantIcon = <FontAwesomeIcon icon="fa-solid fa-utensils" onClick={() => navigate('/settings')} style={{
    borderRadius: '50%',
    border: '2px solid white',
    fontSize: '1rem',
    color: 'white',
    padding: '0.3rem',
    paddingLeft: '0.35rem',
    paddingRight: '0.35rem',        marginRight: '10px',

  }} />

  const handleOptionSelect = async (option) => {
    if (option != props.selectedStatus) {
      await props.handleLogout(); // Log out from the current session
      props.setSelectedStatus(option); // Update the selected status
      props.doLogIn(); // Log in with new credentials based on the selected status
    }
  };
  
  return (
    <>
      <Navbar bg='success' variant='dark' style={{ height: 54 }}>
        <Container fluid>
          {location.pathname != "/" ?
            <FontAwesomeIcon style={{ fontSize: "2rem", color: "white" }} icon="fa-regular fa-circle-left" onClick={detailsMenuReviews ? () => navigate("/") : () => navigate(-1)} />
            :
            <Button style={{ visibility: 'hidden', marginLeft: "2%", pointerEvents: 'none' }}></Button>
          }
          <div className="d-flex flex-grow-1 justify-content-center">
            <Button variant="warning" onClick={() => navigate('/')}>Gluten-Hub</Button>
          </div>
            {/* <Col xs="auto">
          <Dropdown >
              <Dropdown.Toggle size="sm" variant="success" className="d-flex align-items-center" >
                {selectedStatus=="User" ? 
                  <Col className="d-flex align-items-center">
                    {userIcon}
                    <> USER</>

                  </Col> 
                  :
                  <Col className="d-flex align-items-center"> 
                  {restaurantIcon}
                    <p style={{marginTop: 14, marginLeft: 8, fontSize: '0.85rem'}}>Restaurater</p>
                  </Col>
                }
              </Dropdown.Toggle>

              <Dropdown.Menu >
                <Col>
                  {selectedStatus=="Restaurater" ?
                  <Dropdown.Item   variant="success"  /*onClick={handleStatusSelection('User')} className="profile-dropdown-item d-flex align-items-center" style={{borderTop: "1px solid lightgray", borderBottom: "1px solid lightgray"}}> }
                  {userIcon}
                      <p style={{marginTop: 14, marginLeft: 8, fontSize: '0.85rem',color:"white"}}>User</p>
                  </Dropdown.Item>
                  : <></>
                  }
                </Col>
                <Col>
                  {selectedStatus=="User" ?
                  <Dropdown.Item /*onClick={handleStatusSelection('Restaurater')} className="profile-dropdown-item d-flex align-items-center bg-success" >
                    {restaurantIcon}
                      <>RESTAURATER</>
                  </Dropdown.Item>
                  : <></>
                  }
                </Col>
              </Dropdown.Menu>
          </Dropdown>
          </Col>
                */}
                      {location.pathname === "/settings" ?

            <Dropdown drop= "down"  align="end">
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {props.selectedStatus === 'User' ? (
                  <FontAwesomeIcon icon="fa-solid fa-user"  style={{borderRadius: '50%',
    border: '1.5px solid white',
    fontSize: '1rem',
    color: 'white',
    padding: '0.3rem',
    paddingLeft: '0.35rem',
    paddingRight: '0.35rem',
    
  }} />                ) : (
<FontAwesomeIcon icon="fa-solid fa-utensils"  style={{
    borderRadius: '50%',
    border: '1.5px solid white',
    fontSize: '1rem',
    color: 'white',
    padding: '0.3rem',
    paddingLeft: '0.35rem',
    paddingRight: '0.35rem',

  }} />                )}
                {/*selectedOption*/}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handleOptionSelect('User')} className={ 'bg-success text-light'}
                >
                  {userIcon}
                  User
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleOptionSelect('Restaurant')} className={ 'bg-success text-light'}
                >
                  {restaurantIcon}
                  Restaurant
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

        :
        isRestaurateur ?
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
    </Navbar >
    </>
  );
}



export { Header };
