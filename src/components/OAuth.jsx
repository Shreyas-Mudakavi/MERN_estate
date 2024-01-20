import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Spinner from "react-bootstrap/Spinner";
import Button from "./Button";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { app } from "../firebase";
import axiosInstance from "../../utils/axiosUtil";
import { useDispatch, useSelector } from "react-redux";
import {
  registerFailure,
  registerStart,
  registerSuccess,
} from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const { isFetching } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      dispatch(registerStart());
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const res = await signInWithPopup(auth, provider);

      const { data } = await axiosInstance.post("/api/user/google", {
        name: res.user.displayName,
        email: res.user.email,
        photo: res.user.photoURL,
      });

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
        dispatch(registerSuccess(data));
        navigate("/");
      }, 1500);
    } catch (error) {
      dispatch(registerFailure(error?.response?.data?.error?.message));
      return toast.error("Something went wrong.", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }
  };

  return (
    <Button
      disabled={isFetching}
      title={
        isFetching ? (
          <Spinner animation="grow" variant="dark" />
        ) : (
          <div className="flex items-center justify-center gap-x-2">
            <p>
              <FcGoogle size={24} />
            </p>
            <p>Continue with google</p>
          </div>
        )
      }
      className={
        "mt-3 uppercase hover:opacity-75 transition border border-slate-800 bg-slate-300"
      }
      onClick={handleGoogleClick}
    />
  );
};

export default OAuth;
