import { useState } from "react";
import Form from "react-bootstrap/Form";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import { useSelector } from "react-redux";
import Button from "../components/Button";

const Profile = () => {
  const { isFetching } = useSelector((state) => state.auth);
  const { userData, userError, isLoading } = useSelector((state) => state.user);
  const [values, setValues] = useState({
    username: userData?.username,
    email: userData?.email,
    password: "",
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold sm:my-7 my-10">
        Profile
      </h1>

      <ReactPlaceholder
        type="text"
        rows={5}
        showLoadingAnimation
        ready={!isFetching && !isLoading}
      >
        <Form className="flex flex-col" onSubmit={handleFormSubmit}>
          <img
            src={userData?.photo}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer hover:opacity-75 transition self-center mt-2"
          />

          <Form.Group className="mb-6">
            <Form.Label htmlFor="username" className="font-semibold">
              Username
            </Form.Label>
            <Form.Control
              type="text"
              id="username"
              name="username"
              value={values?.username}
              placeholder="Username"
              className="border p-3 rounded-lg mt-2"
              // onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-6">
            <Form.Label htmlFor="email" className="font-semibold">
              Email address
            </Form.Label>
            <Form.Control
              type="email"
              id="email"
              name="email"
              value={values?.email}
              placeholder="Email address"
              className="border p-3 rounded-lg mt-2"
              // onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-6">
            <Form.Label htmlFor="password" className="font-semibold">
              Password
            </Form.Label>
            <Form.Control
              type="password"
              id="password"
              name="password"
              value={values?.password}
              placeholder="Password"
              className="border p-3 rounded-lg mt-2"
              // onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            type={"submit"}
            className={
              "bg-slate-700 text-white uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
            }
            title={"Update"}
          />
        </Form>
        <div className="flex items-center justify-end mt-5">
          <Button
            title={"Delete account"}
            className={
              "bg-red-700 text-white hover:opacity-75 transition uppercase"
            }
          />
        </div>
      </ReactPlaceholder>
    </div>
  );
};

export default Profile;
