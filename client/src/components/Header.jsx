import { Button, Navbar, Container, Row, FormControl, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { UserContext } from './userContext';
import ConfirmModal from './ConfirmModal';
function Header(props) {
  const navigate = useNavigate();
  //const { id } = useParams();
  const user = useContext(UserContext);
  const isRestaurateur = user && user.isRestaurateur; //se è definito prendo isRestaurater
  const location = useLocation();
  const detailsMenuReviews = location.pathname.endsWith('/details') || location.pathname.endsWith('/menu') || location.pathname.endsWith('/reviews')
  const afterSettings = location.pathname.startsWith('/addInfo') || location.pathname.startsWith('/editInfo');
  const formPages = location.pathname.includes("add") || location.pathname.includes("edit");
  const dishView = location.pathname.includes("menu/dish");
  const settings = location.pathname === ("/settings");
  //console.log(formPages)
  //console.log("header", detailsMenuReviews, afterSettings, location.pathname)

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const userIcon = <FontAwesomeIcon icon="fa-solid fa-user" onClick={() => navigate('/settings')} style={{
    borderRadius: '50%',
    border: '2px solid white',
    fontSize: 'rem',
    color: 'white',
    padding: '0.3rem',
    paddingLeft: '0.35rem',
    paddingRight: '0.35rem', marginRight: '10px',

  }} />
  const restaurantIcon = <FontAwesomeIcon icon="fa-solid fa-utensils" onClick={() => navigate('/settings')} style={{
    borderRadius: '50%',
    border: '2px solid white',
    fontSize: '1rem',
    color: 'white',
    padding: '0.3rem',
    paddingLeft: '0.35rem',
    paddingRight: '0.35rem', marginRight: '10px',

  }} />

  const handleOptionSelect = async (option) => {
    if (option != props.selectedStatus) {
      //props.handleLogout(); // Log out from the current session
      props.setSelectedStatus(option); // Update the selected status
      //props.doLogIn(); // Log in with new credentials based on the selected status
    }
  };

  return (
    <>
      <Navbar bg='success' variant='dark' style={{ height: 54 }} >
        <ConfirmModal text={'go Home'} show={show} setShow={setShow} action={() => {
          navigate('/')
        }} />
        <ConfirmModal text={afterSettings?"go to Settings":'go Back'} show={show2} setShow={setShow2} action={() => {
                      afterSettings ? navigate("/settings", { state: { previousLocationPathname: location.pathname } }) : navigate(-1)
          
        }} />

        <Container fluid style={{fontFamily: "Comic Sans MS"}}>
          {location.pathname != "/" ?
            <FontAwesomeIcon style={{ fontSize: "2rem", color: "white" }} icon="fa-regular fa-circle-left" onClick={detailsMenuReviews ? () => navigate("/") : formPages ? () => setShow2(true) : (dishView && location.state && location.state.previousLocationPathname === '/') ? () => navigate(-1) : (dishView && !location.state) ? () => navigate(location.pathname.split("/dish")[0]) : (settings && location.state && location.state.previousLocationPathname.includes("editInfo" || "addInfo")) ? () => navigate('/') : () => navigate(-1)} />
            :
            <Button style={{ visibility: 'hidden', marginLeft: "2%", pointerEvents: 'none' }}></Button>
          }
          {
            location.pathname === "/settings"?
            <Button style={{ marginLeft: "23px" }}  variant="warning" onClick={() => formPages ? setShow(true) : navigate('/')}>GLUTEN-HUB</Button>
            :
            <Button   variant="warning" onClick={() => formPages ? setShow(true) : navigate('/')}>GLUTEN-HUB</Button>
          }
         
          {location.pathname === "/settings" ?

            <Dropdown className='headerDropdown' drop="down" align="end" style={{ marginRight: "-12px" }}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                {props.selectedStatus === 'User' ? (
                  <FontAwesomeIcon icon="fa-solid fa-user" style={{
                    borderRadius: '50%',
                    border: '1.5px solid white',
                    fontSize: '1rem',
                    color: 'white',
                    padding: '0.3rem',
                    paddingLeft: '0.35rem',
                    paddingRight: '0.35rem',

                  }} />) : (
                  <FontAwesomeIcon icon="fa-solid fa-utensils" style={{
                    borderRadius: '50%',
                    border: '1.5px solid white',
                    fontSize: '1rem',
                    color: 'white',
                    padding: '0.3rem',
                    paddingLeft: '0.35rem',
                    paddingRight: '0.35rem',

                  }} />)}
                {/*selectedOption*/}
              </Dropdown.Toggle >

              <Dropdown.Menu className={'bg-success  '}>
                <Dropdown.Item /*style={{    borderBottom: '1px solid white'}}*/
                  onClick={() => handleOptionSelect('User')} className={'bg-success text-light d-flex align-items-center'}
                >
                  {userIcon}
                  User
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleOptionSelect('Restaurant')} className={'bg-success text-light d-flex align-items-center '}
                >
                  {restaurantIcon}
                  Restaurant
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            :
            isRestaurateur ?
              <FontAwesomeIcon icon="fa-solid fa-utensils" onClick={formPages ? () => setShow2(true) : () => navigate("/settings")}  style={{
                borderRadius: '50%',
                border: '2px solid white',
                fontSize: '1.25rem',
                color: 'white',
                padding: '0.3rem',
                paddingLeft: '0.35rem',
                paddingRight: '0.35rem',

              }} />
              :
              <FontAwesomeIcon icon="fa-solid fa-user" onClick={formPages ? () => setShow2(true) : () => navigate("/settings")}  style={{
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
