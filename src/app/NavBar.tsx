'use client'

import Link from "next/link";
import { useState } from "react";

export default function NavBar(){
  const [searchInput, setSearchInput] = useState('');
  console.log("navbar reader");
  console.log(searchInput);
  const searchLinkQuery = searchInput !== "" ? {q: searchInput} : {};
  

  return <div className="navbar bg-base-100 shadow-sm">
  <div className="flex-1">
    <Link href={"/"} className="btn btn-ghost text-xl">Home</Link>
  </div>
  <div className="flex gap-2">
    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" onChange = {(e) =>{
      setSearchInput(e.target.value)
    }}/>
    <Link href={{pathname: "/search", query: searchLinkQuery}} 
    className="btn btn-ghost text-xl">Search</Link>
    <div className="dropdown dropdown-end">
    </div>
  </div>
</div>
};



