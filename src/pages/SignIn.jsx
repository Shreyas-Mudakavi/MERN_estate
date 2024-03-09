import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../utils/axiosUtil";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../redux/auth/authSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const { isFetching, token } = useSelector(
    (state) => state.persistedReducer.auth
  );
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  //   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (token) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, email } = values;

    // setLoading(true);
    dispatch(loginStart());
    try {
      const { data } = await axiosInstance.post(`/api/user/login`, {
        email: email,
        password: password,
      });

      // console.log("log in data ", data);
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
          email: "",
          password: "",
        });
        dispatch(loginSuccess(data));
        // setLoading(false);
        navigate("/");
      }, 1500);

      return;
    } catch (error) {
      //   setLoading(false);
      dispatch(loginFailure(error?.response?.data?.error?.message));
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
      <h1 className="text-3xl text-center font-semibold my-7">Log In</h1>

      <Form className="flex flex-col" onSubmit={handleSubmit}>
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
            isFetching ? <Spinner animation="grow" variant="light" /> : "Log In"
          }
          className={
            "bg-slate-700 text-white hover:opacity-75 disabled:opacity-80 disabled:cursor-not-allowed uppercase"
          }
        />
        <OAuth />
      </Form>

      <div className="flex gap-2 my-4 justify-center">
        <p>Don&apos;t have an accont?</p>
        <Link to={"/sign-up"}>
          <span className="text-slate-600 font-bold underline hover:opacity-75 transition">
            Sign Up
          </span>
        </Link>
      </div>

      <Toaster />
    </div>
  );
};

export default SignIn;
