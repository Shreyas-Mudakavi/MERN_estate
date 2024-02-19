import Form from "react-bootstrap/Form";
import toast, { Toaster } from "react-hot-toast";
import Container from "react-bootstrap/Container";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const CreateListing = () => {
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
    regulaPrice: 0,
    discountPrice: 0,
    price: 0,
    imageUrls: [],
  });
  const [propertyType, setPropertyType] = useState("");
  const [imageFiles, setImageFiles] = useState(null);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handlePropertyType = (e) => {
    setPropertyType(e.target.value);
  };

  console.log(formData);
  console.log(propertyType);
  console.log(imageFiles);

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

          if (downloadLink) {
            resolve(downloadLink);
          }
        }
      );
    });
  };

  const handleFilesUpload = async () => {
    if (imageFiles?.length > 0 && imageFiles?.length < 7) {
      const promises = [];

      for (let i = 0; i < imageFiles?.length; i++) {
        promises.push(storeImage(imageFiles[i]));
      }

      const urls = await Promise.all(promises);
      console.log(urls);
      setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
    }

    if (imageFiles?.length === 0) {
      return toast.error("Atleast 1 image is required!", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }

    if (imageFiles?.length > 7) {
      return toast.error("Only 6 images can be uploaded!", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
    }
  };

  //   useEffect(() => {
  //     if (imageFiles) {
  //       handleFilesUpload(imageFiles);
  //     }
  //   }, [imageFiles]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!imageFiles) {
      return toast.error("Atleast 1 image is required!", {
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
        Listing Details
      </h1>

      <Form className=" gap-x-6 mb-7" onSubmit={handleFormSubmit}>
        <div className=" ">
          <Form.Group className="my-2">
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
              min="10"
              value={formData?.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Name"
            />
          </Form.Group>

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
              value={formData?.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
            />
          </Form.Group>

          <Form.Group className="my-2">
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

          <div className="flex gap-2 flex-col my-2">
            <Form.Label className="font-semibold">Property type</Form.Label>
            <div>
              <Form.Select
                aria-label="Property type"
                onChange={handlePropertyType}
                value={propertyType}
              >
                <option value={""}>Select type</option>
                <option value="Rent">Rent</option>
                <option value="Sell">Sell</option>
              </Form.Select>
            </div>
            {/* <div>
              <Form.Check type="radio" id="sale" name="sale" label="Sale" />
            </div>
            <div>
              <Form.Check type="radio" id="rent" name="rent" label="Rent" />
            </div> */}
            <div className="my-2">
              <Form.Label className="font-semibold">Features</Form.Label>
              <div>
                <Form.Check
                  value={formData?.furnished}
                  onChange={(e) =>
                    setFormData({ ...formData, furnished: e.target.checked })
                  }
                  type="checkbox"
                  id="furnished"
                  name="furnished"
                  label="Furnished"
                />
              </div>
              <div>
                <Form.Check
                  value={formData?.hydro}
                  onChange={(e) =>
                    setFormData({ ...formData, hydro: e.target.checked })
                  }
                  type="checkbox"
                  id="hydro"
                  name="hydro"
                  label="Hydro"
                />
              </div>

              <div>
                <Form.Check
                  value={formData?.water}
                  onChange={(e) =>
                    setFormData({ ...formData, water: e.target.checked })
                  }
                  type="checkbox"
                  id="water"
                  name="water"
                  label="Water"
                />
              </div>

              <div>
                <Form.Check
                  value={formData?.heat}
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
                  onChange={(e) =>
                    setFormData({ ...formData, internet: e.target.checked })
                  }
                  type="checkbox"
                  id="internet"
                  name="internet"
                  label="Internet"
                />
              </div>

              <div>
                <Form.Check
                  value={formData?.parking}
                  onChange={(e) =>
                    setFormData({ ...formData, parking: e.target.checked })
                  }
                  type="checkbox"
                  id="parking"
                  name="parking"
                  label="Parking"
                />
              </div>

              <div>
                <Form.Check
                  value={formData?.petsAllowed}
                  onChange={(e) =>
                    setFormData({ ...formData, petsAllowed: e.target.checked })
                  }
                  type="checkbox"
                  id="petsAllowed"
                  name="petsAllowed"
                  label="Pets Allowed"
                />
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
                <Form.Label htmlFor="bedrooms" className="font-semibold">
                  Bedroom(s)
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
                <Form.Label htmlFor="bathrooms" className="font-semibold">
                  Bathroom(s)
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
                      value={formData?.regulaPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          regulaPrice: parseFloat(e.target.value),
                        })
                      }
                      min={1}
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
                      min={1}
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
                  min={1}
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
                  disabled={uploadPercentage > 0 && uploadPercentage !== 100}
                  title={
                    uploadPercentage > 0 && uploadPercentage !== 100
                      ? "Upload"
                      : "Upload..."
                  }
                />
              </div>
            </Form.Group>
          </div>
        </div>
        <Button
          type={"submit"}
          className={
            "bg-slate-700 text-white mb-2  w-full uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
          }
          disabled={uploadPercentage > 0 && uploadPercentage !== 100}
          title={"Create Listing"}
        />
      </Form>

      <Toaster />
    </Container>
  );
};

export default CreateListing;
