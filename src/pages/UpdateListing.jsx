import Form from "react-bootstrap/Form";
import ReactPlaceholder from "react-placeholder";
import Spinner from "react-bootstrap/Spinner";
import toast, { Toaster } from "react-hot-toast";
import Container from "react-bootstrap/Container";
import Button from "../components/Button";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { FaBed } from "react-icons/fa";
import { FaHouseCircleCheck } from "react-icons/fa6";
import { PiBathtubBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import {
  getSingleListingFailure,
  getSingleListingStart,
  getSingleListingSuccess,
  updateListingFailure,
  updateListingStart,
  updateListingSuccess,
} from "../redux/listing/listingSlice";
import axiosInstance from "../../utils/axiosUtil";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.persistedReducer.auth);
  const { loadingListing } = useSelector((state) => state.listing);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    furnished: false,
    hydro: false,
    heat: false,
    water: false,
    internet: false,
    parking: false,
    petsAllowed: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    price: 0,
    imageUrls: [],
    availableFrom: "",
  });
  const params = useParams();
  const [propertyType, setPropertyType] = useState("");
  const [imageFiles, setImageFiles] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handlePropertyType = (e) => {
    setPropertyType(e.target.value);
  };

  const fetchListing = async () => {
    dispatch(getSingleListingStart());
    try {
      const { data } = await axiosInstance.get(
        `/api/listing/get-listing/${params?.id}`,
        { headers: { Authorization: token } }
      );

      setTimeout(() => {
        dispatch(getSingleListingSuccess(data?.listing));

        setFormData({
          name: data?.listing?.name,
          description: data?.listing?.description,
          address: data?.listing?.address,
          furnished: data?.listing?.features?.furnished,
          hydro: data?.listing?.features?.hydro,
          heat: data?.listing?.features?.heat,
          water: data?.listing?.features?.water,
          internet: data?.listing?.features?.internet,
          parking: data?.listing?.features?.parking,
          petsAllowed: data?.listing?.features?.petsAllowed,
          bedrooms: data?.listing?.bedrooms,
          bathrooms: data?.listing?.bathrooms,
          regularPrice: data?.listing?.regularPrice,
          discountPrice: data?.listing?.discountPrice,
          price: data?.listing?.price,
          imageUrls: data?.listing?.imageUrls,
          availableFrom: data?.listing?.availableFrom,
        });

        setPropertyType(data?.listing?.type);
      }, 1200);
    } catch (error) {
      dispatch(getSingleListingFailure(error?.response?.data?.error?.message));
      return toast.error(error?.response?.data?.error?.message, {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchListing();
  }, []);

  const storeImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().toString() + "-" + imageFile?.name;

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setUploadPercentage(Math.round(progress));
        },
        (error) => {
          if (error.status === 403) {
            reject(error);
            return toast.error("There was an error uploading image.", {
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

          if (downloadLink) {
            resolve(downloadLink);
          }
        }
      );
    });
  };

  const handleFilesUpload = async () => {
    if (
      imageFiles?.length > 0 &&
      imageFiles?.length + formData?.imageUrls?.length < 7
    ) {
      const promises = [];

      for (let i = 0; i < imageFiles?.length; i++) {
        promises.push(storeImage(imageFiles[i]));
      }

      const urls = await Promise.all(promises);
      //   console.log(urls);
      if (urls) {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        return toast.success("Image(s) have been uploaded.", {
          style: {
            borderRadius: "10px",
            backgroundColor: "rgb(51 65 85)",
            color: "#fff",
          },
        });
      } else {
        return toast.error("Image upload failed (max 2mb per image).", {
          style: {
            borderRadius: "10px",
            backgroundColor: "rgb(51 65 85)",
            color: "#fff",
          },
        });
      }
    }

    if (imageFiles === null) {
      return toast.error("Select images to upload.", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }

    if (imageFiles?.length > 7 || formData?.imageUrls?.length > 7) {
      return toast.error("Only 6 images can be uploaded.", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData?.imageUrls?.length === 0) {
      return toast.error("Atleast 1 image is required.", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }

    if (formData?.description?.length < 10) {
      return toast.error("Description is too short.", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }

    const {
      address,
      bathrooms,
      bedrooms,
      description,
      discountPrice,
      furnished,
      heat,
      hydro,
      imageUrls,
      internet,
      name,
      parking,
      petsAllowed,
      price,
      water,
      regularPrice,
      availableFrom,
    } = formData;

    dispatch(updateListingStart());
    try {
      const { data } = await axiosInstance.put(
        `/api/listing/update-listing/${params?.id}`,
        {
          address,
          bathrooms,
          bedrooms,
          description,
          discountPrice,
          furnished,
          heat,
          hydro,
          imageUrls,
          internet,
          name,
          parking,
          petsAllowed,
          price,
          water,
          regularPrice,
          propertyType,
          availableFrom,
        },
        { headers: { Authorization: token } }
      );

      toast.success(data?.msg, {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
      setTimeout(() => {
        dispatch(updateListingSuccess(data?.listing));
        setUploadPercentage(0);
        setImageFiles(null);
        setPropertyType("");
        setFormData({
          name: "",
          description: "",
          address: "",
          furnished: false,
          hydro: false,
          heat: false,
          water: false,
          internet: false,
          parking: false,
          petsAllowed: false,
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 0,
          discountPrice: 0,
          price: 0,
          imageUrls: [],
          availableFrom: "",
        });

        navigate("/my-listings", { replace: true });
      }, 1200);
    } catch (error) {
      dispatch(updateListingFailure(error?.response?.data?.error?.message));
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
    <Container className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing Details
      </h1>

      <ReactPlaceholder
        type="text"
        rows={10}
        showLoadingAnimation
        ready={!loadingListing}
      >
        <Form className="gap-x-6 mb-7" onSubmit={handleFormSubmit}>
          <div className=" ">
            <div className="flex items-center justify-between gap-x-2">
              <Form.Group className="my-2 flex-1">
                <Form.Label htmlFor="name" className="font-semibold">
                  Name
                </Form.Label>
                <Form.Control
                  type="text"
                  className="border p-3 rounded-lg "
                  name="name"
                  id="name"
                  required
                  maxLength="62"
                  value={formData?.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Name"
                />
              </Form.Group>

              <Form.Group className="my-2 flex-1">
                <Form.Label htmlFor="address" className="font-semibold">
                  Address
                </Form.Label>
                <Form.Control
                  type="text"
                  className="border p-3 rounded-lg "
                  name="address"
                  id="address"
                  required
                  value={formData?.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Address"
                />
              </Form.Group>
            </div>
            <Form.Group className="my-2">
              <Form.Label htmlFor="description" className="font-semibold">
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                className="border p-3 rounded-lg "
                name="description"
                id="description"
                required
                minLength="10"
                value={formData?.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
              />
            </Form.Group>

            <div className="flex gap-2 flex-col my-2">
              <div className="flex items-center w-full gap-x-2">
                <div className="flex-1">
                  <Form.Label className="font-semibold">
                    Property type
                  </Form.Label>
                  <Form.Select
                    required
                    aria-label="Property type"
                    onChange={handlePropertyType}
                    value={propertyType}
                  >
                    <option value={""}>Select type</option>
                    <option value="Rent">Rent</option>
                    <option value="Sell">Sell</option>
                  </Form.Select>
                </div>

                <div className="flex-1">
                  <Form.Label className="font-semibold flex items-center gap-x-2">
                    Available from{" "}
                    {formData?.availableFrom !== "" && (
                      <p className="text-sm font-normal text-gray-700">
                        {format(
                          new Date(
                            new Date(formData?.availableFrom).valueOf() +
                              new Date(
                                formData?.availableFrom
                              ).getTimezoneOffset() *
                                60 *
                                1000
                          ),
                          "MMMM dd, yyyy"
                        )}
                      </p>
                    )}
                  </Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={formData?.availableFrom}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        availableFrom: e.target.value,
                      })
                    }
                    onKeyDown={(e) => e.preventDefault()}
                    //   min={new Date().setTime()}
                    min={new Date(
                      new Date().getTime() -
                        new Date().getTimezoneOffset() * 60000
                    )
                      .toJSON() // this will subtract the time from the utc time and returns it
                      .slice(0, 10)}
                  />
                </div>
              </div>

              {/* <div>
              <Form.Check type="radio" id="sale" name="sale" label="Sale" />
            </div>
            <div>
              <Form.Check type="radio" id="rent" name="rent" label="Rent" />
            </div> */}
              <div className="my-2">
                <Form.Label className="font-semibold flex items-center gap-x-2">
                  <FaHouseCircleCheck />
                  <p>Features / Utilities</p>
                </Form.Label>
                <div className="flex justify-between">
                  <div>
                    <Form.Check
                      checked={formData?.hydro}
                      value={formData?.hydro}
                      onChange={(e) =>
                        setFormData({ ...formData, hydro: e.target.checked })
                      }
                      type="checkbox"
                      id="hydro"
                      name="hydro"
                      label="Hydro"
                    />
                    <Form.Check
                      checked={formData?.water}
                      value={formData?.water}
                      onChange={(e) =>
                        setFormData({ ...formData, water: e.target.checked })
                      }
                      type="checkbox"
                      id="water"
                      name="water"
                      label="Water"
                    />
                    <Form.Check
                      value={formData?.heat}
                      checked={formData?.heat}
                      onChange={(e) =>
                        setFormData({ ...formData, heat: e.target.checked })
                      }
                      type="checkbox"
                      id="heat"
                      name="heat"
                      label="Heat"
                    />
                  </div>

                  <div>
                    <Form.Check
                      value={formData?.internet}
                      checked={formData?.internet}
                      onChange={(e) =>
                        setFormData({ ...formData, internet: e.target.checked })
                      }
                      type="checkbox"
                      id="internet"
                      name="internet"
                      label="Internet"
                    />
                    <Form.Check
                      value={formData?.parking}
                      checked={formData?.parking}
                      onChange={(e) =>
                        setFormData({ ...formData, parking: e.target.checked })
                      }
                      type="checkbox"
                      id="parking"
                      name="parking"
                      label="Parking"
                    />
                    <Form.Check
                      value={formData?.furnished}
                      checked={formData?.furnished}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          furnished: e.target.checked,
                        })
                      }
                      type="checkbox"
                      id="furnished"
                      name="furnished"
                      label="Furnished"
                    />
                  </div>

                  <div>
                    <Form.Check
                      value={formData?.petsAllowed}
                      checked={formData?.petsAllowed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          petsAllowed: e.target.checked,
                        })
                      }
                      type="checkbox"
                      id="petsAllowed"
                      name="petsAllowed"
                      label="Pets Allowed"
                    />
                  </div>
                </div>
              </div>

              {/* <div>
              <Form.Check
                type="checkbox"
                id="offer"
                name="offer"
                label="Offer"
              />
            </div> */}
            </div>

            <div className="flex gap-x-4 flex-col sm:flex-row">
              <div className="flex-1">
                <Form.Group className="my-2">
                  <Form.Label
                    htmlFor="bedrooms"
                    className="font-semibold flex items-center gap-x-2"
                  >
                    <FaBed /> <p>Bedroom(s)</p>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData?.bedrooms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bedrooms: parseFloat(e.target.value),
                      })
                    }
                    min={1}
                    className="border p-3 rounded-lg "
                    name="bedrooms"
                    id="bedrooms"
                    required
                  />
                </Form.Group>
              </div>

              <div className="flex-1">
                <Form.Group className="my-2">
                  <Form.Label
                    htmlFor="bathrooms"
                    className="font-semibold flex items-center gap-x-2"
                  >
                    <PiBathtubBold /> <p>Bathroom(s)</p>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData?.bathrooms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bathrooms: parseFloat(e.target.value),
                      })
                    }
                    min={1}
                    className="border p-3 rounded-lg"
                    name="bathrooms"
                    id="bathrooms"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="flex  gap-x-4 flex-col sm:flex-row">
              {propertyType === "Rent" && (
                <>
                  <div className="flex-1">
                    <Form.Group className="my-2">
                      <Form.Label
                        htmlFor="regularPrice"
                        className="font-semibold"
                      >
                        Regular Price
                        <p className="text-sm">
                          <span>($CAD / month)</span>
                        </p>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={formData?.regularPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            regularPrice: parseFloat(e.target.value),
                          })
                        }
                        min={0}
                        className="border p-3 rounded-lg"
                        name="regularPrice"
                        id="regularPrice"
                        required
                      />
                    </Form.Group>
                  </div>

                  <div className="flex-1">
                    <Form.Group className="my-2">
                      <Form.Label
                        htmlFor="discountPrice"
                        className="font-semibold"
                      >
                        Discount Price
                        <p className="text-sm">
                          <span>($CAD / month)</span>
                        </p>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        value={formData?.discountPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discountPrice: parseFloat(e.target.value),
                          })
                        }
                        min={0}
                        className="border p-3 rounded-lg"
                        name="discountPrice"
                        id="discountPrice"
                      />
                    </Form.Group>
                  </div>
                </>
              )}
            </div>

            {propertyType === "Sell" && (
              <div className="flex-1">
                <Form.Group className="my-2">
                  <Form.Label htmlFor="price" className="font-semibold">
                    Price
                    <p className="text-sm">
                      <span>($CAD)</span>
                    </p>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData?.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    min={0}
                    className="border p-3 rounded-lg"
                    name="price"
                    id="price"
                    required
                  />
                </Form.Group>
              </div>
            )}
          </div>

          <div className=" my-2">
            <div className="my-4">
              <Form.Group className="gap-x-3">
                <Form.Label>
                  <p className="font-semibold mb-2">
                    Images:{" "}
                    <span className="font-normal text-gray-700 ml-2 text-sm">
                      The first image will be the cover (max 6)
                    </span>
                  </p>
                </Form.Label>
                <div className="flex gap-x-3 items-center">
                  <Form.Control
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={(e) => setImageFiles(e.target.files)}
                  />
                  <Button
                    type={"button"}
                    onClick={() => handleFilesUpload()}
                    className={
                      "bg-green-700 text-white mb-2 uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
                    }
                    disabled={
                      (uploadPercentage > 0 && uploadPercentage !== 100) ||
                      loadingListing
                    }
                    title={
                      (uploadPercentage > 0 && uploadPercentage !== 100) ||
                      loadingListing ? (
                        <Spinner animation="grow" variant="" />
                      ) : (
                        "Upload"
                      )
                    }
                  />
                </div>
                {formData?.imageUrls?.length > 0 && (
                  <p className="font-semibold my-2">
                    Uploaded Images{" "}
                    {/* <span className="font-normal text-gray-700 ml-2 text-sm">
                    Click on image to remove it
                  </span> */}
                  </p>
                )}
                <div className="flex gap-y-4 my-2 flex-col">
                  {formData?.imageUrls?.length > 0 &&
                    formData?.imageUrls?.map((image, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-slate-200 p-3 rounded-lg border shadow-md border-slate-600"
                      >
                        <img
                          src={image}
                          alt="Uploaded image"
                          className="w-40 h-40 object-cover rounded-lg hover:opacity-75 cursor-pointer transition"
                        />

                        <Button
                          type={"button"}
                          onClick={() => {
                            const imgIndex = formData?.imageUrls?.findIndex(
                              (img, index) => index === i
                            );

                            setFormData({
                              ...formData,
                              imageUrls: formData.imageUrls.filter(
                                (img, i) => i !== imgIndex
                              ),
                            });
                          }}
                          title={"Delete"}
                          className={
                            "text-white bg-red-700 mb-2 uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
                          }
                        />
                      </div>
                    ))}
                </div>
              </Form.Group>
            </div>
          </div>
          <Button
            type={"submit"}
            className={
              "bg-slate-700 text-white mb-2  w-full uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
            }
            disabled={
              (uploadPercentage > 0 && uploadPercentage !== 100) ||
              loadingListing
            }
            title={
              (uploadPercentage > 0 && uploadPercentage !== 100) ||
              loadingListing ? (
                <Spinner animation="grow" variant="light" />
              ) : (
                "Update Listing"
              )
            }
          />
        </Form>
      </ReactPlaceholder>

      <Toaster />
    </Container>
  );
};

export default UpdateListing;
