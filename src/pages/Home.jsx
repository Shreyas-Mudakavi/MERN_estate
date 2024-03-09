import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlaceholder from "react-placeholder";
import toast, { Toaster } from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useEffect } from "react";
import {
  homeListingsFailure,
  homeListingsStart,
  homeListingsSuccess,
} from "../redux/listing/getHomeListings";
import axiosInstance from "../../utils/axiosUtil";
import ListingItem from "./../components/ListingItem";

const Home = () => {
  const dispatch = useDispatch();
  const { homeListingsData, loadingHomeListings, homeListingsError } =
    useSelector((state) => state.homeListings);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchHomeListings = async () => {
      dispatch(homeListingsStart());
      try {
        const { data } = await axiosInstance.get(
          `/api/listing/getHomeListing?limit=4`
        );

        setTimeout(() => {
          dispatch(homeListingsSuccess(data?.listings));
        }, 1200);
      } catch (error) {
        dispatch(homeListingsSuccess([]));
        dispatch(homeListingsFailure(error?.response?.data?.error?.message));
      }
    };

    fetchHomeListings();
  }, []);

  return (
    <>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br />{" "}
          place with ease
        </h1>

        <div className="text-gray-400 text-xs sm:text-sm">
          Shreyas Estate will help you find your home fast, easy and
          comfortable. <br /> Our expert support is always available.
        </div>

        <Link
          to={`/search`}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline transition hover:opacity-75"
        >{`Let's get Started...`}</Link>
      </div>

      {/* swiper */}
      <ReactPlaceholder
        type="text"
        rows={10}
        showLoadingAnimation
        ready={!loadingHomeListings}
      >
        <Swiper navigation>
          {homeListingsData?.discountListings?.length !== 0 &&
            homeListingsData?.discountListings?.map((discountListing) => (
              <SwiperSlide key={discountListing?._id}>
                <img
                  src={discountListing?.imageUrls[0]}
                  className="h-[500px] w-full object-cover"
                  alt="listing image"
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </ReactPlaceholder>

      {/* listing results for discounts, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <ReactPlaceholder
          type="text"
          rows={15}
          showLoadingAnimation
          ready={!loadingHomeListings}
        >
          <div className="">
            <div className="my-3">
              <h2 className="text-xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                to={`/search`}
                className="text-sm text-blue-800 hover:underline hover:opacity-75 transition"
              >
                Show more offers
              </Link>
            </div>

            <div className="flex flex-wrap gap-4">
              {homeListingsData?.discountListings?.length === 0 && (
                <p className="text-sm text-blue-800 text-center w-full">
                  No listings!
                </p>
              )}
              {homeListingsData?.discountListings?.map((discountListing) => (
                <ListingItem
                  key={discountListing?._id}
                  listing={discountListing}
                />
              ))}
            </div>
          </div>

          <div className="">
            <div className="my-3">
              <h2 className="text-xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                to={`/search?type=rent`}
                className="text-sm text-blue-800 hover:underline hover:opacity-75 transition"
              >
                Show more places for rent
              </Link>
            </div>

            <div className="flex flex-wrap gap-4">
              {homeListingsData?.rentListings?.length === 0 && (
                <p className="text-sm text-blue-800 text-center w-full">
                  No listings!
                </p>
              )}

              {homeListingsData?.rentListings?.map((rentListing) => (
                <ListingItem key={rentListing?._id} listing={rentListing} />
              ))}
            </div>
          </div>

          <div className="">
            <div className="my-3">
              <h2 className="text-xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                to={`/search?type=sell`}
                className="text-sm text-blue-800 hover:underline hover:opacity-75 transition"
              >
                Show more places for sale
              </Link>
            </div>

            <div className="flex flex-wrap gap-4">
              {homeListingsData?.sellListings?.length === 0 && (
                <p className="text-sm text-blue-800 text-center w-full">
                  No listings!
                </p>
              )}

              {homeListingsData?.sellListings?.map((sellListing) => (
                <ListingItem key={sellListing?._id} listing={sellListing} />
              ))}
            </div>
          </div>
        </ReactPlaceholder>
      </div>
    </>
  );
};

export default Home;
