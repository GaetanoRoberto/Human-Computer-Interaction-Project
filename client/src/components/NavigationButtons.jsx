import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListGroup, Card, Col, Row, Button, Navbar, Container, FormControl } from 'react-bootstrap';

const NavigationButtons = () => {
    const navigate = useNavigate();

    return (
        <>
            <Col className='fixed-position'>
                <Button variant="primary" className="sharp-border" onClick={() => { navigate(`/restaurants/${1}/details/`) }}>Details</Button>
                <Button variant="primary" className="sharp-border" onClick={() => { navigate(`/restaurants/${1}/menu/`) }}>Menu</Button>
                <Button variant="primary" className="sharp-border" onClick={() => { navigate(`/restaurants/${1}/reviews/`) }}>Review</Button>
            </Col>
        </>
    );
}

export { NavigationButtons };
