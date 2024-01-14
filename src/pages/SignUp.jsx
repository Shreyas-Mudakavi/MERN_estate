import Form from "react-bootstrap/Form";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <Form className="flex flex-col">
        <Form.Group className="mb-6">
          <Form.Label htmlFor="username" className="">
            Username
          </Form.Label>
          <Form.Control
            type="text"
            id="username"
            name="username"
            value=""
            placeholder="Username"
            className="border p-3 rounded-lg mt-2"
          />
        </Form.Group>
        <Form.Group className="mb-6">
          <Form.Label htmlFor="email">Email address</Form.Label>
          <Form.Control
            type="email"
            id="email"
            name="email"
            value=""
            placeholder="Email address"
            className="border p-3 rounded-lg mt-2"
          />
        </Form.Group>
        <Form.Group className="mb-6">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            id="password"
            name="password"
            value=""
            placeholder="Password"
            className="border p-3 rounded-lg mt-2"
          />
        </Form.Group>

        <Button
          title={"Sign up"}
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
    </div>
  );
};

export default SignUp;
