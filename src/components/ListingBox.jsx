import { format, formatDistance } from "date-fns";
import Button from "./Button";
import { FaBed } from "react-icons/fa";
import { PiBathtubBold } from "react-icons/pi";
import { useNavigate, Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

const ListingBox = ({ data, handleDeleteListing }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white my-3 p-3 shadow-md rounded-lg">
      <div className="flex flex-col sm:flex-row items-center gap-x-4 gap-y-4">
        <img
          src={data?.imageUrls[0]}
          onClick={() => navigate(`listing/${data?._id}`)}
          alt={data?.name + " listing image"}
          className="h-40 self-start rounded-lg object-contain cursor-pointer hover:opacity-75 transition"
        />
        <div className="">
          <div>
            <div className="flex items-start gap-x-3 mb-3">
              <p
                className={`text-green-700 text-lg font-semibold ${
                  data?.type === "Rent" &&
                  data?.discountPrice > 0 &&
                  "line-through"
                }`}
              >
                {data?.type === "Rent"
                  ? "$" + data?.regularPrice?.toFixed(2)
                  : "$" + data?.price?.toFixed(2)}
              </p>
              <p className={`text-red-700 text-xl font-semibold`}>
                {data?.type === "Rent" &&
                  data?.discountPrice > 0 &&
                  "$" + data?.discountPrice?.toFixed(2)}
              </p>
            </div>
            <Link
              to={`/listing/${data?._id}`}
              className="transition text-lg text-slate-700 font-semibold hover:underline hover:opacity-75"
            >
              {data?.name}
            </Link>

            {/* TODO: also add location here */}
            <div className="text-gray-400 my-2 text-sm font-semibold flex items-center gap-x-2">
              <div className="flex items-center gap-x-1">
                <p>
                  <FaLocationDot />
                </p>
                <p>{data?.address}</p>
              </div>
              <p>|</p>
              <p className="">
                {"Posted " +
                  formatDistance(data?.createdAt, new Date()) +
                  " ago"}
              </p>
            </div>

            <p className="text-gray-400 font-semibold">
              {data?.description?.slice(0, 60) + "..."}
            </p>
          </div>

          <div className="flex font-semibold items-center gap-x-2 text-gray-400 my-3 flex-wrap">
            <FaBed /> <p>{data?.bedrooms}</p>
            <PiBathtubBold /> <p>{data?.bathrooms}</p>
            <p>|</p>
            <p>{"For " + data?.type}</p>
            <p className="hidden sm:block">|</p>
            <p className="my-2 sm:my-0">
              {"Available from " +
                format(
                  new Date(
                    new Date(data?.availableFrom).valueOf() +
                      new Date(data?.availableFrom).getTimezoneOffset() *
                        60 *
                        1000
                  ),
                  "MMMM dd, yyyy"
                )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-end my-2">
        <Button
          type={"button"}
          onClick={() => handleDeleteListing(data?._id)}
          title={"Delete"}
          className={
            "bg-transparent w-auto font-semibold text-red-700 border-none hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
          }
        />
        <Button
          title={"Update"}
          type={"button"}
          onClick={() => navigate(`/update-listing/${data?._id}`)}
          className={
            "bg-transparent w-auto text-green-700 font-semibold border-none hover:opacity-75 transition disabled:opacity-80 disabled:cursor-not-allowed"
          }
        />
      </div>
    </div>
  );
};

export default ListingBox;
