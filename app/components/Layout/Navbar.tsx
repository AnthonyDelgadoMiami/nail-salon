import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50">
      {/* Left side - Mobile Dropdown + Branding */}
      <div className="navbar-start">
        <div className="dropdown">
          <button
            tabIndex={0}
            className="btn btn-ghost lg:hidden"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h12M4 18h16"
              />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/clients">Clients</Link>
            </li>
            <li>
              <Link href="/appointments">Appointments</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="btn btn-ghost text-xl font-bold normal-case text-primary"
        >
          Nail Salon Manager
        </Link>
      </div>

      {/* Center - Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          <li>
            <Link href="/clients" className="hover:text-primary font-medium">
              Clients
            </Link>
          </li>
          <li>
            <Link
              href="/appointments"
              className="hover:text-primary font-medium"
            >
              Appointments
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:text-primary font-medium">
              Services
            </Link>
          </li>
        </ul>
      </div>

      {/* Right side - Auth */}
      <div className="navbar-end">
        <button className="btn btn-primary rounded-full px-6">Login</button>
      </div>
    </div>
  );
}
