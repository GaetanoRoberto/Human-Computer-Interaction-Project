import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ConfirmModal(props) {
    const {text,show,setShow,action,parameter} = props;
    const handleClose = () => setShow(false);
    
    const perform_action = () => {
        if(parameter == undefined){
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
                <Modal.Title>Confirm Operation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you Sure to {text} ?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={perform_action}>Ok</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;