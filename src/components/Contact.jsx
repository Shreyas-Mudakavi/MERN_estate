import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

const Contact = ({ getListingData }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full my-4">
      <p>
        Contact{" "}
        <span className="font-semibold">{getListingData?.user?.username}</span>{" "}
        for <span className="font-semibold">{getListingData?.name}</span>
      </p>

      <Form.Control
        as={"textarea"}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message here..."
        value={message}
        name="message"
        className="rounded-md mb-3"
      />

      <Link
        to={`mailto:${getListingData?.user?.email}?subject=Regarding ${getListingData?.name}&body=${message}`}
        className="bg-slate-700 text-white my-2 flex items-center justify-center uppercase w-full hover:opacity-75 transition px-3 py-2 rounded-md"
      >
        Send Message
      </Link>
    </div>
  );
};

export default Contact;
