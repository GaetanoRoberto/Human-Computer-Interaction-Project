import { useRef,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, ListGroup, Col, Row } from 'react-bootstrap';
import { PLACEHOLDER } from './Costants';
import { TimePicker } from '@hilla/react-components/TimePicker.js';
import 'react-phone-number-input/style.css'
import { StandaloneSearchBox } from '@react-google-maps/api';
import ConfirmModal from './ConfirmModal';

const handleImageChange = (event, setImage, setFileName) => {
    const file = event.target.files[0];
    setFileName(file.name);
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

const address_string_to_object = (addr) => {
    const main_infos = addr.split(';');
    const lat = parseFloat(main_infos[1].split(':')[1]);
    const lng = parseFloat(main_infos[2].split(':')[1]);
    return {
        text: main_infos[0],
        lat: lat,
        lng: lng
    };
};

const address_object_to_string = (addr) => {
    return addr.text + ';lat:' + addr.lat + ";lng:" + addr.lng;
};

/**
 * React state to use and pass to this component as props:
 * const [image, setImage] = useState(PLACEHOLDER);
 * const [fileName, setFileName] = useState('No File Chosen');
 * PLACEHOLDER is a costant declared in Costants.jsx to import 
 */
function ImageViewer(props) {
    const { width, height, image, setImage, fileName, setFileName } = props;
    const fileInputRef = useRef(null);
    return (
        <>
            <Container className="d-flex flex-column align-items-center">
                <img height={height} width={width} style={{ marginBottom: '5%' }} src={image} />
                {(image === PLACEHOLDER || (Array.isArray(image) && image.includes(PLACEHOLDER))) ? '' : <Button variant='danger' style={{ marginBottom: '5%' }} onClick={() => { setImage(PLACEHOLDER); setFileName('No File Chosen'); }}>Remove Current Image</Button>}
            </Container>
            <Container className="d-flex align-items-center custom-input">
                <Button variant='secondary' onClick={() => { fileInputRef.current.click() }}>Choose File</Button><span style={{ marginLeft: '5%' }}>{fileName}</span>
                <Form.Control style={{ display: 'none' }} type='file' ref={fileInputRef} onChange={(event) => handleImageChange(event, setImage, setFileName)} accept="image/*" />
            </Container>
        </>
    );
}

function DishItem(props) {
    const { dish, deleteDish } = props;
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    
    return (
        //border-0 to remove the border
        <ListGroup.Item className="border-0">
            <Row>
                <Col xs={8}>{dish.name}</Col>
                <Col xs={2}>
                    <Button size='sm' variant="success" onClick={() => { navigate(`/editDish/${dish.id}`) }}>
                        <i className="bi bi-pencil-square"></i>
                    </Button>
                </Col>
                <Col xs={2}>
                    <Button size='sm' variant="danger" onClick={() => { setShow(true); }}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </Col>
                <ConfirmModal text={'Delete the Dish'} show={show} setShow={setShow} action={deleteDish} parameter={dish.id}/>
            </Row>
        </ListGroup.Item>
    );
}

/**
 * React state to use and pass to this component as props:
 * const [address, setAddress] = useState({ text: '', lat: 0.0, lng: 0.0, invalid: false });
 */
function AddressSelector(props) {
    const { address, setAddress } = props;
    const inputRef = useRef();

    const handlePlaceChanged = () => {
        const [place] = inputRef.current.getPlaces();
        if (place) {
            setAddress({
                text: place.formatted_address,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                invalid: address.invalid
            });
        }
    };

    return (
        <StandaloneSearchBox onLoad={(ref) => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
            <>
                <Form.Control
                    isInvalid={address.invalid}
                    type="text"
                    placeholder="Enter The Location"
                    // HERE NOT TO AVOID CALL TOO MUCH THE API onChange={(event) => addressValidation({text: event.target.value, lat:address.lat, lng:address.lng, invalid: address.invalid},setAddress)}
                    onChange={(event) => { setAddress({ text: event.target.value, lat: address.lat, lng: address.lng, invalid: address.invalid }); }}
                    defaultValue={address.text}
                />
                <Form.Control.Feedback type="invalid">Please Insert a Valid Address</Form.Control.Feedback>
            </>
        </StandaloneSearchBox>
    );
}

function TimeSelector(props) {
    const { n_times, time, addTime, saveTime, deleteTime, checkTime } = props;

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5%', flexWrap: 'wrap' }}>
            <TimePicker invalid={time.invalid} style={{ width: "30%", marginRight: "2%" }} value={time.first} step={60 * 30} onChange={(event) => {
                const new_time = { id: time.id, first: event.target.value, last: time.last, invalid: time.invalid };
                saveTime(new_time);
                checkTime(new_time);
            }} onKeyDown={(event) => { event.preventDefault() }} />
            <TimePicker invalid={time.invalid} style={{ width: "30%", marginRight: "5%" }} value={time.last} step={60 * 30} onChange={(event) => {
                const new_time = { id: time.id, first: time.first, last: event.target.value, invalid: time.invalid };
                saveTime(new_time);
                checkTime(new_time);
            }} onKeyDown={(event) => { event.preventDefault() }} />
            <Button size='sm' variant="success" onClick={() => { addTime() }} style={{ marginRight: "2%" }}><i className="bi bi-plus-lg"></i></Button>
            {(n_times > 1) ? <Button size='sm' variant="danger" onClick={() => { deleteTime(time.id) }}><i className="bi bi-trash"></i></Button> : ''}
            <p style={{ display: 'block', color: '#dc3545' }} className='small'>{(time.invalid === true) ? 'Choose a valid time interval' : ''}</p>
        </div>
    );
}

export { ImageViewer, DishItem, TimeSelector, AddressSelector, address_string_to_object, address_object_to_string };
