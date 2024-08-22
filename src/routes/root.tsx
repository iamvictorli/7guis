import { Outlet, NavLink } from "react-router-dom";

const navLinks = [
  "counter",
  "temperature-converter",
  "flight-booker",
  "timer",
  "crud",
  "circle-drawer",
  "cells",
];

export default function Root() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">7gui</h1>
      {navLinks.map((link) => {
        return (
          <NavLink
            key={link}
            to={link}
            className={({ isActive }) => (isActive ? "underline" : "")}
          >
            {link}
          </NavLink>
        );
      })}
      <Outlet />
    </>
  );
}
