import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../utils/axiosUtil";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, email } = values;

    if (password.length < 6) {
      return toast.error("Password is too short!", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(`/api/user/register`, {
        username: username,
        email: email,
        password: password,
      });

      console.log("sign up data ", data);
      toast.success(data?.msg, {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
      setValues({
        username: "",
        email: "",
        password: "",
      });
      setLoading(false);

      navigate("/");

      return;
    } catch (error) {
      setLoading(false);
      // console.log(error?.response?.data?.error?.message); // error message
      // console.log(error?.response?.data?.success); // error success
      return toast.error(error?.response?.data?.error?.message, {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <Form className="flex flex-col" onSubmit={handleSubmit}>
        <Form.Group className="mb-6">
          <Form.Label htmlFor="username" className="">
            Username
          </Form.Label>
          <Form.Control
            type="text"
            id="username"
            name="username"
            value={values?.username}
            placeholder="Username"
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-6">
          <Form.Label htmlFor="email">Email address</Form.Label>
          <Form.Control
            type="email"
            id="email"
            name="email"
            value={values?.email}
            placeholder="Email address"
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-6">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            name="password"
            value={values?.password}
            placeholder="Password"
            className="border p-3 rounded-lg mt-2"
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          disabled={loading}
          type={"submit"}
          title={
            loading ? <Spinner animation="grow" variant="light" /> : "Sign up"
          }
          className={
            "bg-slate-700 text-white hover:opacity-75 disabled:opacity-80 disabled:cursor-not-allowed uppercase"
          }
        />
      </Form>

      <div className="flex gap-2 my-4 justify-center">
        <p>Already have an accont?</p>
        <Link to={"/sign-in"}>
          <span className="text-slate-600 font-bold underline hover:opacity-75 transition">
            Log in
          </span>
        </Link>
      </div>

      <Toaster />
    </div>
  );
};

export default SignUp;
