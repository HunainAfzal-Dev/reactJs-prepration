import React from "react";

const Navbar = () => {
  return (
    <nav  className="flex w-full justify-between items-center p-4 bg-gray-800 text-white">
      <div>Logo</div>
      <div>
        <ul className="flex space-x-4">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
