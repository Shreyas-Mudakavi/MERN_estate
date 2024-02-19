import Modal from "react-bootstrap/Modal";
import Button from "./Button";
import { IoIosCloseCircle } from "react-icons/io";

function CustomModal({
  handleShow,
  handleConfDelModal,
  handleClose,
  show,
  modalheading,
  modalBody,
}) {
  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <div className="flex items-center justify-between">
            <Modal.Title>{modalheading}</Modal.Title>
            <IoIosCloseCircle
              className="text-slate-400 hover:opacity-75 transition cursor-pointer"
              onClick={handleClose}
              size={30}
            />
          </div>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>
          <Button
            title={"Close"}
            className={
              "bg-slate-700 text-white hover:opacity-75 disabled:opacity-80 disabled:cursor-not-allowed uppercase"
            }
            onClick={handleClose}
          />

          <Button
            title={"Yes"}
            className={
              "bg-red-700 text-white hover:opacity-75 disabled:opacity-80 disabled:cursor-not-allowed uppercase"
            }
            onClick={handleConfDelModal ? handleConfDelModal : handleClose}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomModal;
