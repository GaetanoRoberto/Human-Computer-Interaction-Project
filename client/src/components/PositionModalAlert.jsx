import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function PositionModalAlert(props) {
    const {text,show,setShow,modal2WithErrors} = props;
    const handleClose = () => setShow(false);

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title style={{fontSize: "1.3rem"}}>{text ? "Location updated correctly" : "Error in updating the location"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {text ? <>Your location has been set to: <br/>{text}. <br/><br/> Go to your profile if you want to modify it.</> : <>The system was not able to retrieve your location!<br/><br/>Nearby Button and Max Distance field have been temporarily disabled.<br/><br/>To enable them, try selecting again a location on your profile page.</>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PositionModalAlert;