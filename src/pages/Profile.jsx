import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ReactPlaceholder from "react-placeholder";
import toast, { Toaster } from "react-hot-toast";
import "react-placeholder/lib/reactPlaceholder.css";
import { useSelector, useDispatch } from "react-redux";
import Button from "../components/Button";
import { TbUserEdit } from "react-icons/tb";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { FaLock, FaUnlockAlt } from "react-icons/fa";
import {
  userDeleteFailure,
  userDeleteStart,
  userDeleteSuccess,
  userUpdateFailure,
  userUpdateStart,
  userUpdateSuccess,
} from "../redux/user/userSlice";
import axiosInstance from "../../utils/axiosUtil";
import CustomModal from "../components/CustomModal";
import { useNavigate } from "react-router-dom";
import { logOut } from "../redux/auth/authSlice";

const Profile = () => {
  const navigate = useNavigate();
  const { isFetching, user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [passwordShow, setPasswordShow] = useState(false);
  const { userData, userError, isLoading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [formData, setFormData] = useState({
    username: userData?.username,
    email: userData?.email,
    password: "",
    photo: userData?.photo,
  });
  const fileRef = useRef(null);
  const [showDelModal, setShowDelModal] = useState(false);

  useEffect(() => {
    setFormData({
      username: userData?.username,
      email: userData?.email,
      password: "",
      photo: userData?.photo,
    });
  }, [userData]);

  const handleDelete = async (delConf) => {
    if (delConf === "Yes") {
      dispatch(userDeleteStart());
      try {
        const { data } = await axiosInstance.delete(
          `/api/user/delete-user/${user}`,
          { headers: { Authorization: token } }
        );

        setTimeout(() => {
          toast.success(data?.msg, {
            style: {
              borderRadius: "10px",
              backgroundColor: "rgb(51 65 85)",
              color: "#fff",
            },
          });

          dispatch(logOut());
          dispatch(userDeleteSuccess());
          navigate("/");
        }, 1000);
      } catch (error) {
        dispatch(userDeleteFailure(error?.response?.data?.error?.message));
        return toast.error(error?.response?.data?.error?.message, {
          style: {
            borderRadius: "10px",
            backgroundColor: "rgb(51 65 85)",
            color: "#fff",
          },
        });
      }

      return;
    }
    return;
  };

  const handleShowDelModal = () => {
    setShowDelModal(true);
  };

  const handleConfDelModal = () => {
    handleDelete("Yes");
    setShowDelModal(false);
  };

  const handleCloseDelModal = () => {
    handleDelete("No");
    setShowDelModal(false);
  };

  const handleFileUplaod = async (imageFile) => {
    const storage = getStorage(app);
    // console.log("firebase storage ", storage);

    const fileName = new Date().getTime().toString() + "-" + imageFile?.name;
    const storageRef = ref(storage, fileName);

    // this gives us the percentage uploaded
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // to give percentage =  * 100
        // console.log("uplaod prog ", progress);
        setUploadPercentage(Math.round(progress));
      },
      (error) => {
        // console.log("upload err ", error.message, error.status);

        if (error.status === 403) {
          return toast.error("There was a error uploading image.", {
            style: {
              borderRadius: "10px",
              backgroundColor: "rgb(51 65 85)",
              color: "#fff",
            },
          });
        }
      },
      async () => {
        const downloadLink = await getDownloadURL(uploadTask.snapshot.ref);

        // console.log("downloadLink ", downloadLink);
        if (downloadLink) {
          setFormData({ ...formData, photo: downloadLink });
        }
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      handleFileUplaod(imageFile);
    }
  }, [imageFile]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, photo } = formData;

    if (username?.trim()?.length <= 0) {
      return toast.error("Username is invalid!", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }

    if (email?.trim()?.length <= 0) {
      return toast.error("Email is invalid!", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }

    dispatch(userUpdateStart());
    try {
      const { data } = await axiosInstance.put(
        `/api/user/update-user/${user}`,
        { username: username, password: password, photo: photo, email: email },
        { headers: { Authorization: token } }
      );

      setTimeout(() => {
        toast.success(data?.msg, {
          style: {
            borderRadius: "10px",
            backgroundColor: "rgb(51 65 85)",
            color: "#fff",
          },
        });

        dispatch(userUpdateSuccess(data?.user));

        setUploadPercentage(0);
        setImageFile(null);
      }, 1000);

      return;
    } catch (error) {
      dispatch(userUpdateFailure(error?.response?.data?.error?.message));
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
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>

      <ReactPlaceholder
        type="media"
        rows={10}
        showLoadingAnimation
        ready={!isFetching && !isLoading}
      >
        <Form className="flex flex-col" onSubmit={handleFormSubmit}>
          <input
            type="file"
            name="imageFile"
            ref={fileRef}
            hidden
            onChange={(e) => setImageFile(e.target.files[0])}
            accept=".png, .jpeg, .jpg"
          />
          <div className="flex items-center justify-center my-8">
            <img
              onClick={() => fileRef.current.click()}
              src={formData?.photo}
              alt="profile"
              className="rounded-full h-24 w-24 absolute object-cover hover:opacity-75 transition cursor-pointer"
            />
            <TbUserEdit
              onClick={() => fileRef.current.click()}
              className="relative top-9 left-6 z-[1] p-1 bg-slate-700 text-white hover:bg-slate-600 transition rounded-full cursor-pointer"
              size={30}
            />
          </div>
          <p className="self-center my-4 text-sm font-semibold">
            {uploadPercentage > 0 && uploadPercentage < 100 ? (
              <span className="text-slate-700">{`Uploading ${uploadPercentage}%...`}</span>
            ) : uploadPercentage === 100 ? (
              <span className="text-green-700">{`Image successfully uploaded!`}</span>
            ) : (
              ""
            )}
          </p>

          <Form.Group className="mb-6">
            <Form.Label htmlFor="username" className="font-semibold">
              Username
            </Form.Label>
            <Form.Control
              type="text"
              id="username"
              name="username"
              value={formData?.username}
              placeholder="Username"
              className="border p-3 rounded-lg mt-2"
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
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
              value={formData?.email}
              placeholder="Email address"
              className="border p-3 rounded-lg mt-2"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-6">
            <Form.Label htmlFor="password" className="font-semibold">
              Password
            </Form.Label>
            <InputGroup>
              <Form.Control
                type={passwordShow ? "text" : "password"}
                id="password"
                name="password"
                value={formData?.password}
                placeholder="Password"
                className="border p-3 rounded-lg mt-2"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <InputGroup.Text
                onClick={() => {
                  setPasswordShow(!passwordShow);
                }}
                className="mt-2 cursor-pointer hover:opacity-75 transition"
              >
                {passwordShow ? <FaUnlockAlt /> : <FaLock />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button
            type={"submit"}
            className={
              "bg-slate-700 text-white mb-2 uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
            }
            title={"Update"}
            disabled={
              (uploadPercentage > 0 && uploadPercentage !== 100) || isLoading
            }
          />
          <Button
            type={"button"}
            className={
              "bg-green-700 text-white uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
            }
            onClick={() => navigate("/create-listing")}
            title={"Create Listing"}
            disabled={
              (uploadPercentage > 0 && uploadPercentage !== 100) || isLoading
            }
          />
        </Form>
        <div className="flex items-center justify-end mt-5">
          <Button
            disabled={
              (uploadPercentage > 0 && uploadPercentage !== 100) || isLoading
            }
            onClick={handleShowDelModal}
            title={"Delete account"}
            className={
              "bg-red-700 text-white hover:opacity-75 transition uppercase disabled:opacity-80 disabled:cursor-not-allowed"
            }
          />
        </div>
      </ReactPlaceholder>

      <Toaster />

      <CustomModal
        handleShow={handleShowDelModal}
        handleClose={handleCloseDelModal}
        show={showDelModal}
        modalheading={"Are you sure you want to delete your account?"}
        modalBody={
          <>
            <p>
              <b>Note:</b>
            </p>
            <p>All the data associated with your account will be delete!</p>
          </>
        }
        handleConfDelModal={handleConfDelModal}
      />
    </div>
  );
};

export default Profile;
