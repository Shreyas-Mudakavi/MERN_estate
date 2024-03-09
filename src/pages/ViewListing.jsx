import { useParams, useNavigate } from "react-router-dom";
import { GiSofa } from "react-icons/gi";
import { MdPets, MdWifiPassword } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import Container from "react-bootstrap/Container";
import ReactPlaceholder from "react-placeholder";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosUtil";
import {
  getListingFailure,
  getListingStart,
  getListingSuccess,
} from "../redux/listing/getListingSlice";
import {
  FaHouseCircleCheck,
  FaLocationDot,
  FaSquareParking,
} from "react-icons/fa6";
import { format, formatDistance } from "date-fns";
import { PiBathtubBold } from "react-icons/pi";
import { FaBed, FaCalendarCheck } from "react-icons/fa";
import Button from "../components/Button";
import Contact from "../components/Contact";
import {
  deleteListingFailure,
  deleteListingStart,
  deleteListingSuccess,
} from "../redux/listing/listingSlice";

const ViewListing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const { token, user } = useSelector((state) => state.persistedReducer.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getListingData, loadingGetListing, getListingError } = useSelector(
    (state) => state.getListing
  );
  const [contactLandlord, setContactLandlord] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchListing = async () => {
    dispatch(getListingStart());
    try {
      const { data } = await axiosInstance.get(
        `/api/listing/get-listing/${params.id}`,
        { headers: { Authorization: token } }
      );

      //   toast.success(data?.msg, {
      //     style: {
      //       borderRadius: "10px",
      //       backgroundColor: "rgb(51 65 85)",
      //       color: "#fff",
      //     },
      //   });

      setTimeout(() => {
        dispatch(getListingSuccess(data?.listing));
      }, 1200);
    } catch (error) {
      dispatch(getListingFailure(error?.response?.data?.error?.message));
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
    fetchListing();
  }, []);

  const handleDeleteListing = async (deleteId) => {
    dispatch(deleteListingStart());

    try {
      const { data } = await axiosInstance.delete(
        `/api/listing/delete-listing/${deleteId}`,
        { headers: { Authorization: token } }
      );

      setTimeout(() => {
        dispatch(deleteListingSuccess(data?.listings));
      }, 1200);
    } catch (error) {
      dispatch(deleteListingFailure(error?.response?.data?.error?.message));
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
    <ReactPlaceholder
      type="text"
      rows={10}
      className="p-3"
      showLoadingAnimation
      ready={!loadingGetListing}
    >
      {getListingError && (
        <p className="text-xl text-blue-800 text-center w-full">
          Something went wrong!
        </p>
      )}
      <>
        <Swiper navigation>
          {getListingData?.imageUrls?.map((image, i) => (
            <SwiperSlide key={i}>
              <img
                src={image}
                className="w-full md:h-[600px]"
                alt={"listing image"}
              />
              {/* <div
                  className="h-[550px]"
                  style={{
                    background: `url(${image}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div> */}
            </SwiperSlide>
          ))}
        </Swiper>
      </>
      <Container className="my-4">
        <div className="bg-white shadow-md p-3 rounded-md">
          <div className="flex items-center mb-3 justify-between text-slate-700">
            <p className="text-xl font-semibold">{getListingData?.name}</p>
            <div className="flex items-center gap-x-2 flex-col sm:flex-row">
              <p
                className={`text-green-700 text-lg font-semibold ${
                  getListingData?.type === "Rent" &&
                  getListingData?.discountPrice > 0 &&
                  "line-through"
                }`}
              >
                {getListingData?.type === "Rent"
                  ? "$" + getListingData?.regularPrice?.toFixed(2)
                  : "$" + getListingData?.price?.toFixed(2)}
              </p>
              <p className={`text-red-700 text-xl font-semibold`}>
                {getListingData?.type === "Rent" &&
                  getListingData?.discountPrice > 0 &&
                  "$" + getListingData?.discountPrice?.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="my-2 font-semibold text-lg text-slate-700">
            <div className="flex gap-x-2 items-center">
              <p>
                <FaLocationDot />
              </p>
              <p>{getListingData?.address}</p>
            </div>

            <div className="font-normal ml-7 text-gray-400 text-sm">
              <p>
                {getListingData?.createdAt &&
                  "Posted " +
                    formatDistance(getListingData?.createdAt, new Date()) +
                    " ago"}
              </p>
            </div>
          </div>

          <div className="flex justify-end flex-col sm:flex-row sm:items-center gap-x-4 my-3 text-gray-500 ml-2">
            <p className="">{"For " + getListingData?.type}</p>
            <p className="hidden sm:block">|</p>
            <p className="flex items-center gap-x-4 ">
              <FaBed />
              Bedroom(s): {getListingData?.bedrooms}
            </p>
            <p className="hidden sm:block">|</p>
            <p className="flex items-center gap-x-4">
              <PiBathtubBold /> Bathroom(s): {getListingData?.bathrooms}
            </p>
          </div>
        </div>

        <div className="my-3 bg-white shadow-md rounded-md p-3 text-slate-700">
          <p className="text-xl font-semibold text-slate-700">Overview</p>

          <div className="flex gap-x-12 md:justify-between flex-col sm:flex-row flex-wrap">
            <div>
              <div className="flex items-center gap-x-2 mt-3">
                <p>
                  <FaHouseCircleCheck />
                </p>
                <p>Features / Utilities Included</p>
              </div>
              <div className="ml-5 text-gray-500">
                {getListingData?.features?.hydro ? (
                  <p className="flex items-center">
                    <TiTick /> Hydro
                  </p>
                ) : (
                  <p className="flex items-center">
                    <RxCross2 /> Hydro
                  </p>
                )}

                {getListingData?.features?.heat ? (
                  <p className="flex items-center">
                    <TiTick /> Heat
                  </p>
                ) : (
                  <p className="flex items-center">
                    <RxCross2 /> Heat
                  </p>
                )}

                {getListingData?.features?.water ? (
                  <p className="flex items-center">
                    <TiTick /> Water
                  </p>
                ) : (
                  <p className="flex items-center">
                    <RxCross2 /> Water
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-x-2 mt-3">
                <p>
                  <MdWifiPassword />
                </p>
                <p>Internet</p>
              </div>
              <div className="ml-5 text-gray-500">
                {getListingData?.features?.internet ? (
                  <p className="flex items-center">
                    <TiTick /> Internet
                  </p>
                ) : (
                  <p className="flex items-center">
                    <RxCross2 /> Internet
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-x-2 mt-3">
                <p>
                  <FaCalendarCheck />
                </p>
                <p>Available from</p>
              </div>
              <div className="ml-6 text-gray-500">
                <p className="">
                  {getListingData?.availableFrom &&
                    format(
                      new Date(
                        new Date(getListingData?.availableFrom).valueOf() +
                          new Date(
                            getListingData?.availableFrom
                          ).getTimezoneOffset() *
                            60 *
                            1000
                      ),
                      "MMMM dd, yyyy"
                    )}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-x-2 mt-3">
                <p>
                  <MdPets />
                </p>
                <p>Pet Friendly</p>
              </div>
              <div className="ml-5 text-gray-500">
                <p className="">
                  {getListingData?.features?.petsAllowed ? (
                    <p className="flex items-center">
                      <TiTick /> Yes
                    </p>
                  ) : (
                    <p className="flex items-center">
                      <RxCross2 /> No
                    </p>
                  )}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-x-2 mt-3">
                <p>
                  <FaSquareParking />
                </p>
                <p>Parking</p>
              </div>
              <div className="ml-5 text-gray-500">
                <p className="">
                  {getListingData?.features?.parking ? (
                    <p className="flex items-center">
                      <TiTick /> Yes
                    </p>
                  ) : (
                    <p className="flex items-center">
                      <RxCross2 /> No
                    </p>
                  )}
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-x-2 mt-3">
                <p>
                  <GiSofa />
                </p>
                <p>Furnished</p>
              </div>
              <div className="ml-5 text-gray-500">
                <p className="">
                  {getListingData?.features?.furnished ? (
                    <p className="flex items-center">
                      <TiTick /> Yes
                    </p>
                  ) : (
                    <p className="flex items-center">
                      <RxCross2 /> No
                    </p>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-3 bg-white shadow-md rounded-md p-3 text-slate-700">
          <p className="text-xl font-semibold">Description</p>

          <div>
            <p className="text-gray-500">{getListingData?.description}</p>
          </div>
        </div>

        {getListingData?.user?._id !== user ? (
          <div>
            {!contactLandlord && (
              <Button
                type={"button"}
                title={"Contact Landlord"}
                onClick={() => setContactLandlord(true)}
                className={
                  "bg-slate-700 text-white my-2 w-full uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
                }
              />
            )}

            {contactLandlord && <Contact getListingData={getListingData} />}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-x-12 flex-col sm:flex-row">
            <Button
              type={"button"}
              onClick={() => {
                navigate(`/update-listing/${getListingData?._id}`);
              }}
              title={"Update Listing"}
              className={
                "bg-green-700 text-white my-2 w-full uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
              }
            />

            <Button
              type={"button"}
              onClick={() => handleDeleteListing(data?._id)}
              title={"Delete Listing"}
              className={
                "bg-red-700 text-white my-2 w-full uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
              }
            />
          </div>
        )}

        <Toaster />
      </Container>
    </ReactPlaceholder>
  );
};

export default ViewListing;
