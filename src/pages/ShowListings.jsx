import Container from "react-bootstrap/Container";
import { useSelector, useDispatch } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import toast, { Toaster } from "react-hot-toast";
import {
  deleteListingFailure,
  deleteListingStart,
  deleteListingSuccess,
  getListingFailure,
  getListingStart,
  getListingSuccess,
} from "../redux/listing/listingSlice";
import axiosInstance from "../../utils/axiosUtil";
import { useEffect } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { format, formatDistance } from "date-fns";
import { FaBed } from "react-icons/fa";
import { PiBathtubBold } from "react-icons/pi";
import ListingBox from "../components/ListingBox";
import CustomModal from "../components/CustomModal";

const ShowListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.persistedReducer.auth);
  const { loadingListing, listingData, listingError, listingErrorMsg } =
    useSelector((state) => state.listing);

  const fetchListings = async () => {
    dispatch(getListingStart());
    try {
      const { data } = await axiosInstance.get(`/api/listing/getAll-listings`, {
        headers: { Authorization: token },
      });

      setTimeout(() => {
        // toast.success(data?.msg, {
        //   style: {
        //     borderRadius: "10px",
        //     backgroundColor: "rgb(51 65 85)",
        //     color: "#fff",
        //   },
        // });

        return dispatch(getListingSuccess(data?.listings));
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
    fetchListings();
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
    <Container className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Your Listings</h1>

      <ReactPlaceholder
        type="text"
        rows={10}
        showLoadingAnimation
        ready={!loadingListing}
      >
        {listingData?.map((data) => (
          <ListingBox
            data={data}
            key={data?._id}
            handleDeleteListing={handleDeleteListing}
          />
        ))}
      </ReactPlaceholder>

      <Toaster />
    </Container>
  );
};

export default ShowListings;
