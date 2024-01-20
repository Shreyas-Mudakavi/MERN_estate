import { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import ReactPlaceholder from "react-placeholder";
import toast, { Toaster } from "react-hot-toast";
import "react-placeholder/lib/reactPlaceholder.css";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import { TbUserEdit } from "react-icons/tb";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
  const { isFetching } = useSelector((state) => state.auth);
  const { userData, userError, isLoading } = useSelector((state) => state.user);
  const [values, setValues] = useState({
    username: userData?.username,
    email: userData?.email,
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [formData, setFormData] = useState({});
  const fileRef = useRef(null);

  useEffect(() => {
    setFormData({
      username: userData?.username,
      email: userData?.email,
      password: "",
      photo: userData?.photo,
    });
  }, []);

  console.log("form data ", formData);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  };

  const handleFileUplaod = async (imageFile) => {
    const storage = getStorage(app);
    console.log("firebase storage ", storage);

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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>

      <ReactPlaceholder
        type="text"
        rows={7}
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
            <Form.Control
              type="password"
              id="password"
              name="password"
              value={formData?.password}
              placeholder="Password"
              className="border p-3 rounded-lg mt-2"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </Form.Group>

          <Button
            type={"submit"}
            className={
              "bg-slate-700 text-white uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
            }
            title={"Update"}
            disabled={uploadPercentage > 0 && uploadPercentage !== 100}
          />
        </Form>
        <div className="flex items-center justify-end mt-5">
          <Button
            disabled={uploadPercentage > 0 && uploadPercentage !== 100}
            title={"Delete account"}
            className={
              "bg-red-700 text-white hover:opacity-75 transition uppercase disabled:opacity-80 disabled:cursor-not-allowed"
            }
          />
        </div>
      </ReactPlaceholder>

      <Toaster />
    </div>
  );
};

export default Profile;
