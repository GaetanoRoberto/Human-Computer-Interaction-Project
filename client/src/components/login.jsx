import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';

function Login() {
    const [username, setUsername] = useState('user');

    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        /*if(valid)
        {
          doLogIn(credentials);
        } */
    };


    return (
        <>
            <Header />
            <Row>
                <h2>Choose your status</h2>
            </Row>
            <Row xs={3}><Button className='my-2' >User</Button></Row>
            <Row xs={3}><Button className='my-2 mx-2' variant='danger' onClick={() => navigate('/')}>Restaurant</Button></Row> 
        </>
    )
}

export { Login };