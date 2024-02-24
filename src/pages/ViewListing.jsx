import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import Container from "react-bootstrap/Container";
import ReactPlaceholder from "react-placeholder";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axiosInstance from "../../utils/axiosUtil";
import {
  getListingFailure,
  getListingStart,
  getListingSuccess,
} from "../redux/listing/getListingSlice";

const ViewListing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.persistedReducer.auth);
  const { getListingData, loadingGetListing, getListingError } = useSelector(
    (state) => state.getListing
  );

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
  }, [params.id]);

  return (
    <ReactPlaceholder
      type="text"
      rows={10}
      className="p-3"
      showLoadingAnimation
      ready={!loadingGetListing}
    >
      <>
        <Swiper navigation>
          {getListingData?.imageUrls?.map((image, i) => (
            <SwiperSlide key={i}>
              <img
                src={image}
                className="w-full h-[550px]"
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
      <Container>
        <Toaster />
      </Container>
    </ReactPlaceholder>
  );
};

export default ViewListing;
