import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ listing }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[250px]">
      <Link to={`/listing/${listing?._id}`}>
        <img
          src={listing?.imageUrls[0]}
          alt={listing?.name}
          className="h-[320px] sm:h-[200px] w-full object-cover hover:scale-105 transition"
        />

        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing?.name}
          </p>

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing?.address}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing?.description}
          </p>

          {listing?.type === "Rent" ? (
            <p className="text-slate-500 mt-2 font-semibold">
              {listing?.discountPrice > 0 ? (
                <div className="flex items-center gap-2">
                  <p className="line-through text-sm text-red-700">
                    ${listing?.regularPrice?.toLocaleString("en-US")}{" "}
                  </p>

                  <p>
                    ${listing?.discountPrice?.toLocaleString("en-US")}{" "}
                    {listing?.type === "Rent" && " / month"}
                  </p>
                </div>
              ) : (
                <p>
                  ${listing?.regularPrice?.toLocaleString("en-US")}
                  {listing?.type === "Rent" && " / month"}
                </p>
              )}
            </p>
          ) : (
            <p className="text-slate-500 mt-2 font-semibold">
              ${listing?.price?.toLocaleString("en-US")}
            </p>
          )}

          <div className="text-slate-700 flex items-center gap-4">
            <div className="font-bold text-xs">
              {listing?.bedrooms > 1
                ? `${listing?.bedrooms} beds`
                : `${listing?.bedrooms} bed`}
            </div>

            <div className="font-bold text-xs">
              {listing?.bathrooms > 1
                ? `${listing?.bathrooms} baths`
                : `${listing?.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
