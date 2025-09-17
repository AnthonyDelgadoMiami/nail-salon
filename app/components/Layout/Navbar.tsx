"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div className="navbar-start">
        {/* branding */}
        <Link href="/" className="btn btn-ghost text-xl font-bold text-primary">
          Nail Salon Manager
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          <li><Link href="/clients">Clients</Link></li>
          <li><Link href="/appointments">Appointments</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/employees">Employees</Link></li>
        </ul>
      </div>

      <div className="navbar-end">
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="btn btn-outline rounded-full px-6"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" className="btn btn-primary rounded-full px-6">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
