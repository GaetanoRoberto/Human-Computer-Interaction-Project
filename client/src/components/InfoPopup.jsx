import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function getHappinessSolidClass(index) {
    switch (index) {
        case 1:
            return "fa-solid fa-face-dizzy";
        case 2:
            return "fa-solid fa-face-tired";
        case 3:
            return "fa-solid fa-face-meh";
        case 4:
            return "fa-solid fa-face-smile";
        case 5:
            return "fa-solid fa-face-grin-stars";
    }
}
function getHappinessColor(index) {
    switch (index) {
        case 1:
            return "#ff3300" // Faccina arrabbiata
        case 2:
            return "#ff8300"; // Faccina triste
        case 3:
            return "#FFD700"; // Faccina neutra
        case 4:
            return "#00ff5b"; // Faccina sorridente
        case 5:
            return "green"; // Faccina che ride
        default:
            return " ";
    }
}

function InfoPopup(props) {
    const { show, setShow, action, parameter } = props;
    const handleClose = () => setShow(false);

    const perform_action = () => {
        if (parameter == undefined) {
            action();
            setShow(false);
        } else {
            action(parameter);
            setShow(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Help and Info</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Row  className="mb-1">
                <Col>
                According to users reviews:
                </Col>
                </Row>
                <Row >
                    <Col style={{ textAlign: "start" }}>
                        <i className="bi bi-star-fill" style={{ color: '#FFD700', fontSize: "1.25em" }}></i> indicates the <b>Average Quality</b>
                    </Col>
                </Row>
                <Row className="mb-2">
                <Col style={{textAlign: "start"}}>
                <i className="bi bi-currency-euro" style={{fontSize:"1.25em"}} ></i> indicates the <b>Average Price</b>, based on how much users spent (per person).
                </Col>
                </Row>
                <Row className="mb-3 " >
                    <Col>
                    <b>Average Safety</b> refers to the degree of security perceived by customers after eating Gluten-Free dishes in restaurants.<br/>
                     These are the metrics:
                    </Col>
                </Row>
                {Array.from({ length: 5 }, (_, index) => (
                    <Row key={index} className="mb-2">
                        <Col style={{ textAlign: "end" }} >
                            <FontAwesomeIcon key={index} icon={getHappinessSolidClass(index + 1)} style={{ color: getHappinessColor(index + 1), marginRight: "5px", fontSize: "1.5em" }} />
                        </Col>
                        <Col>
                            {
                                (() => {
                                    switch (index) {
                                        case 0:
                                            return '1.0 - 1.4';
                                        case 1:
                                            return '1.5 - 2.4';
                                        case 2:
                                            return '2.5 - 3.4';
                                        case 3:
                                            return '3.5 - 4.4';
                                        case 4:
                                            return '4.5 - 5.0';
                                        default:
                                            return null; // or whatever you want to render for other cases
                                    }
                                })()
                            }
                        </Col>
                    </Row>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="warning" onClick={perform_action}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InfoPopup;