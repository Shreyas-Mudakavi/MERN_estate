import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import { AiOutlineClose } from "react-icons/ai";
import { RiMenuUnfoldLine } from "react-icons/ri";

import Button from "./Button";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);

  return (
    <header className="bg-slate-200 shadow-md transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between mx-auto max-w-6xl p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap cursor-pointer hover:opacity-75 transition">
            <span className="text-slate-500">Shreyas</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            name="search"
            placeholder="Search..."
            className="bg-transparent w-24 sm:w-64 focus:outline-none"
            autoComplete="off"
          />
          <FaSearch className="text-slate-600 cursor-pointer hover:opacity-75 transition" />
        </form>

        <ul className="flex gap-4 items-center">
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

          {/* for mobile hamburger menu */}
          <li className="inline sm:hidden">
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
                    <h1 className="font-semibold text-xl flex flex-wrap cursor-pointer hover:opacity-75 transition">
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
                  <div className="p-3 flex flex-col items-center gap-y-2 mt-4">
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
                  </div>
                </ul>
              </Offcanvas.Body>
            </Offcanvas>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
