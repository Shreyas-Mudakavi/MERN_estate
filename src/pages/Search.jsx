import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "../components/Button";
import ReactPlaceholder from "react-placeholder";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  searchListingFailure,
  searchListingStart,
  searchListingSuccess,
} from "../redux/listing/searchListingSlice";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../../utils/axiosUtil";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchListingData, loadingSearchListing, searchListingError } =
    useSelector((state) => state.searchListing);
  const [showMore, setShowMore] = useState(false);
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    sort: "created_At",
    order: "desc",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSearchData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_At",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      dispatch(searchListingStart());
      try {
        const searchQuery = urlParams.toString();
        const { data } = await axiosInstance.get(
          `/api/listing/getSearch?${searchQuery}`
        );

        setTimeout(() => {
          if (data?.listings?.length > 8) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
          dispatch(searchListingSuccess(data?.listings));
        }, 1200);
      } catch (error) {
        dispatch(searchListingFailure(error?.response?.data?.error?.message));
        dispatch(searchListingSuccess([]));
        return toast.error(error?.response?.data?.error?.message, {
          style: {
            borderRadius: "10px",
            backgroundColor: "rgb(51 65 85)",
            color: "#fff",
          },
        });
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchData?.searchTerm);
    urlParams.set("type", searchData?.type);
    urlParams.set("parking", searchData?.parking);
    urlParams.set("furnished", searchData?.furnished);
    urlParams.set("sort", searchData?.sort);
    urlParams.set("order", searchData?.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfListings = searchListingData?.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);

    const searchQuery = urlParams.toString();

    dispatch(searchListingStart());
    try {
      const { data } = await axiosInstance.get(
        `/api/listing/getSearch?${searchQuery}`
      );

      setTimeout(() => {
        if (data?.listings?.length < 9) {
          setShowMore(false);
        }
        dispatch(searchListingSuccess(...searchListingData, data?.listings));
      }, 1200);
    } catch (error) {
      dispatch(searchListingFailure(error?.response?.data?.error?.message));
      dispatch(searchListingSuccess([]));
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
    <Container>
      <div className="flex flex-col md:flex-row">
        <div className="border-b-2 md:border-r-2 p-7 md:min-h-screen">
          <Form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <Form.Group className="flex items-center gap-2">
              <Form.Label className="whitespace-nowrap font-semibold ">
                Search term:
              </Form.Label>
              <Form.Control
                onChange={handleChange}
                value={searchData?.searchTerm}
                name="searchTerm"
                type="text"
                id="searchTerm"
                placeholder="Search..."
                className="rounded-lg border p-3 w-full"
              />
            </Form.Group>

            <Form.Group className="flex items-center flex-wrap gap-3">
              <Form.Label className="font-semibold">Property type:</Form.Label>
              <Form.Check
                onChange={(e) => {
                  setSearchData({ ...searchData, type: e.target.name });
                }}
                checked={searchData?.type === "all"}
                type="checkbox"
                id="all"
                label="Rent & Sell"
                name="all"
                className=""
              />
              <Form.Check
                onChange={(e) => {
                  setSearchData({ ...searchData, type: e.target.name });
                }}
                checked={searchData?.type === "rent"}
                type="checkbox"
                id="rent"
                label="Rent"
                name="rent"
                className=""
              />
              <Form.Check
                onChange={(e) => {
                  setSearchData({ ...searchData, type: e.target.name });
                }}
                checked={searchData?.type === "sell"}
                type="checkbox"
                id="sell"
                label="Sell"
                name="sell"
                className=""
              />
            </Form.Group>

            <Form.Group className="flex items-center flex-wrap gap-3">
              <Form.Label className="font-semibold">Amenities:</Form.Label>
              <Form.Check
                onChange={(e) => {
                  setSearchData({ ...searchData, parking: e.target.checked });
                }}
                checked={searchData?.parking}
                type="checkbox"
                id="parking"
                label="Parking"
                name="parking"
                className=""
              />
              <Form.Check
                onChange={(e) => {
                  setSearchData({ ...searchData, furnished: e.target.checked });
                }}
                checked={searchData?.furnished}
                type="checkbox"
                id="furnished"
                label="Furnished"
                name="furnished"
                className=""
              />
            </Form.Group>

            <Form.Group className="flex items-center gap-3">
              <Form.Label className="font-semibold">Sort:</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setSearchData({
                    ...searchData,
                    sort: e.target.value.split("_")[0] || "created_at",
                    order: e.target.value.split("_")[1] || "desc",
                  });
                }}
                defaultValue={"created_at_desc"}
                id="sort_order"
                name="sort"
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </Form.Select>
            </Form.Group>

            <Button
              title={
                loadingSearchListing ? (
                  <Spinner animation="grow" variant="light" />
                ) : (
                  "Search"
                )
              }
              disabled={loadingSearchListing}
              className={
                "bg-slate-700 text-white mb-2 w-full uppercase hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
              }
              type={"submit"}
            />
          </Form>
        </div>

        <div className="flex-1">
          {/* listings results */}
          <h1 className="text-3xl text-slate-700 font-semibold border-b p-3 mt-3">
            Listing results:
          </h1>

          <div className="p-7 flex flex-wrap gap-4">
            <ReactPlaceholder
              type="text"
              rows={10}
              className="p-3"
              showLoadingAnimation
              ready={!loadingSearchListing}
            >
              {searchListingData?.map((listing) => (
                <ListingItem key={listing?._id} listing={listing} />
              ))}
            </ReactPlaceholder>
          </div>
          {showMore && (
            <Button
              type={"button"}
              title={"Show More"}
              onClick={handleShowMore}
              className={`text-green-700 hover:underline p-7 transition hover:opacity-75 w-full text-center`}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default Search;
