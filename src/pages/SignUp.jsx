import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../utils/axiosUtil";
import { useSelector } from "react-redux";
import {
  registerFailure,
  registerStart,
  registerSuccess,
} from "../redux/auth/authSlice";
import { useDispatch } from "react-redux";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const { isFetching, token } = useSelector(
    (state) => state.persistedReducer.auth
  );
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

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

    // setLoading(true);
    dispatch(registerStart());
    try {
      const { data } = await axiosInstance.post(`/api/user/register`, {
        username: username,
        email: email,
        password: password,
      });

      // console.log("sign up data ", data);

      if (data?.token) {
        toast.success(data?.msg, {
          style: {
            borderRadius: "10px",
            backgroundColor: "rgb(51 65 85)",
            color: "#fff",
          },
        });
      }

      setTimeout(() => {
        setValues({
          username: "",
          email: "",
          password: "",
        });
        dispatch(registerSuccess(data));
        // setLoading(false);

        navigate("/");
      }, 1500);

      return;
    } catch (error) {
      // setLoading(false);
      dispatch(registerFailure(error?.response?.data?.error?.message));
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
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          disabled={isFetching}
          type={"submit"}
          title={
            isFetching ? (
              <Spinner animation="grow" variant="light" />
            ) : (
              "Sign up"
            )
          }
          className={
            "bg-slate-700 text-white hover:opacity-75 disabled:opacity-80 disabled:cursor-not-allowed uppercase"
          }
        />
        <OAuth />
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
