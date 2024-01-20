import { FaSearch } from "react-icons/fa";
import ReactPlaceholder from "react-placeholder";
import "react-placeholder/lib/reactPlaceholder.css";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import { AiOutlineClose } from "react-icons/ai";
import { RiMenuUnfoldLine } from "react-icons/ri";

import Button from "./Button";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../utils/axiosUtil";
import { getUserStart, getUserSuccess } from "../redux/user/userSlice";
import { logOut } from "../redux/auth/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const { token, isFetching, user } = useSelector((state) => state.auth);
  const { isLoading, userData, userError } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const fetchUser = async () => {
    dispatch(getUserStart());
    try {
      const { data } = await axiosInstance.get(`/api/user/get-user/${user}`, {
        headers: { Authorization: token },
      });

      dispatch(getUserSuccess(data?.user));
    } catch (error) {
      toast.error("User not found!", {
        style: {
          borderRadius: "10px",
          backgroundColor: "rgb(51 65 85)",
          color: "#fff",
        },
      });
      // TODO: logout user
      dispatch(getUserSuccess(error?.response?.data?.error?.message));
      return;
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);

  return (
    <header className="fixed w-full bg-slate-200 shadow-md transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between mx-auto max-w-6xl p-3">
        <div className="inline sm:hidden">
          <RiMenuUnfoldLine
            onClick={handleShowMenu}
            size={26}
            className="mr-2"
          />

          <Offcanvas
            show={showMenu}
            onHide={handleCloseMenu}
            placement="start"
            name="start"
            responsive="sm"
          >
            <Offcanvas.Header closeButton={false}>
              <Offcanvas.Title className="flex items-center justify-between w-full border-b pb-2 border-slate-700">
                <Link to={"/"}>
                  <h1
                    className="font-semibold text-xl flex flex-wrap cursor-pointer hover:opacity-75 transition"
                    onClick={handleCloseMenu}
                  >
                    <span className="text-slate-300">Shreyas</span>
                    <span className="text-slate-800">Estate</span>
                  </h1>
                </Link>
                <AiOutlineClose
                  className="text-slate-300 cursor-pointer"
                  onClick={handleCloseMenu}
                />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ul className="gap-y-5 transition flex flex-col px-3">
                <Link to={"/"}>
                  <li
                    onClick={handleCloseMenu}
                    className="text-slate-900 border-b border-slate-500 pb-2 text-lg hover:opacity-75 transition cursor-pointer font-semibold"
                  >
                    Home
                  </li>
                </Link>
                <Link to={"/about"}>
                  <li
                    onClick={handleCloseMenu}
                    className="text-slate-900 border-b border-slate-500 pb-2 text-lg hover:opacity-75 transition cursor-pointer font-semibold"
                  >
                    About
                  </li>
                </Link>
                <div
                  className={`p-3 flex flex-col items-center ${
                    token ? "gap-y-8" : "gap-y-2"
                  } mt-4`}
                >
                  <ReactPlaceholder
                    type="media"
                    showLoadingAnimation
                    ready={!isFetching && !isLoading}
                  >
                    {token ? (
                      <>
                        <Link to={"/profile"}>
                          <li
                            onClick={handleCloseMenu}
                            className="cursor-pointer flex flex-col items-center justify-center border-b border-slate-500 pb-2"
                          >
                            <img
                              className="rounded-full h-12 w-12 object-cover hover:opacity-75 transition"
                              src={userData?.photo}
                              alt="profile"
                            />
                            <p className="text-slate-900 font-semibold">
                              Welcome back,{" "}
                              <span className="text-slate-300">
                                {userData?.username}
                              </span>
                            </p>
                          </li>
                        </Link>

                        <li>
                          <Button
                            title={"Logout"}
                            className={
                              "bg-slate-700 text-white hover:opacity-75 font-semibold"
                            }
                            onClick={() => {
                              handleCloseMenu();
                              dispatch(logOut());
                            }}
                          />
                        </li>
                      </>
                    ) : (
                      <>
                        <Link to={"/sign-in"}>
                          <li
                            onClick={handleCloseMenu}
                            className="text-slate-900 text-lg hover:opacity-75 transition cursor-pointer font-semibold"
                          >
                            Sign In
                          </li>
                        </Link>
                        <li>
                          <Button
                            onClick={() => {
                              navigate("/sign-up");
                              handleCloseMenu();
                            }}
                            title={"Create account"}
                            className={
                              "bg-slate-700 text-white hover:opacity-75 font-semibold text-lg"
                            }
                          />
                        </li>
                      </>
                    )}
                  </ReactPlaceholder>
                </div>
              </ul>
            </Offcanvas.Body>
          </Offcanvas>
        </div>

        <Link to={"/"}>
          <h1 className="font-bold text-lg sm:text-2xl flex flex-wrap cursor-pointer hover:opacity-75 transition">
            <span className="text-slate-500">Shreyas</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        <form className="hidden sm:flex bg-slate-100 p-3 rounded-lg items-center">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            className="bg-transparent w-24 sm:w-64 focus:outline-none"
            autoComplete="off"
          />
          <FaSearch className="text-slate-600 cursor-pointer hover:opacity-75 transition" />
        </form>

        <ul className="flex sm:gap-4 items-center">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 hover:opacity-75 transition cursor-pointer font-semibold">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-slate-700 hover:opacity-75 transition cursor-pointer font-semibold">
              About
            </li>
          </Link>
          <li className="hidden sm:inline text-slate-700">|</li>

          <div className="hidden sm:flex items-center gap-4">
            <ReactPlaceholder
              type="media"
              className="hidden sm:inline w-7 h-7 ml-2"
              showLoadingAnimation
              ready={!isFetching && !isLoading}
            >
              {token ? (
                <>
                  <Link to={"/profile"}>
                    <li className="hidden sm:inline cursor-pointer">
                      <img
                        className="rounded-full h-8 w-8 object-cover hover:opacity-75 transition"
                        src={userData?.photo}
                        alt="profile"
                      />
                    </li>
                  </Link>

                  <li>
                    <Button
                      title={"Logout"}
                      className={
                        "hidden sm:inline bg-slate-700 text-white hover:opacity-75 font-semibold"
                      }
                      onClick={() => {
                        dispatch(logOut());
                      }}
                    />
                  </li>
                </>
              ) : (
                <>
                  <Link to={"/sign-in"}>
                    <li className="hidden sm:inline text-slate-700 hover:opacity-75 transition cursor-pointer font-semibold">
                      Sign In
                    </li>
                  </Link>
                  <li>
                    <Button
                      title={"Create account"}
                      className={
                        "hidden sm:inline bg-slate-700 text-white hover:opacity-75 font-semibold"
                      }
                      onClick={() => {
                        navigate("/sign-up");
                      }}
                    />
                  </li>
                </>
              )}
            </ReactPlaceholder>
          </div>

          {/* for mobile hamburger menu */}
          {token ? (
            <Link to={"/profile"}>
              <li className="sm:hidden inline cursor-pointer">
                <img
                  className="rounded-full h-8 w-8 object-cover hover:opacity-75 transition"
                  src={userData?.photo}
                  alt="profile"
                />
              </li>
            </Link>
          ) : (
            <div className="sm:hidden inline">
              <ReactPlaceholder
                type="text"
                rows={1}
                showLoadingAnimation
                ready={!isFetching && !isLoading}
              >
                <Link to={"/sign-in"}>
                  <li className="text-slate-700 hover:opacity-75 transition cursor-pointer font-semibold">
                    Sign In
                  </li>
                </Link>
              </ReactPlaceholder>
            </div>
          )}
        </ul>
      </div>

      <form className="bg-slate-100 p-3 rounded-lg flex sm:hidden items-center">
        <input
          type="text"
          name="search"
          placeholder="Search..."
          className="bg-transparent w-full focus:outline-none"
          autoComplete="off"
        />
        <FaSearch className="text-slate-600 cursor-pointer hover:opacity-75 transition" />
      </form>

      <Toaster />
    </header>
  );
};

export default Header;
