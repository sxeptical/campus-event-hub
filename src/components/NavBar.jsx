import { NavLink, Link } from "react-router";

function NavBar({ notificationCount = 0 }) {
  const linkClass = ({ isActive }) =>
    [
      "text-base font-medium px-4 py-2 transition-colors",
      isActive ? "bg-white/15 text-white" : "text-white/80 hover:text-white hover:bg-white/10",
    ].join(" ");

  return (
    <nav className="bg-purple-700 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="text-white font-bold text-xl md:text-2xl tracking-tight">
          Campus Event Hub
        </Link>
        <div className="hidden sm:flex gap-3">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          className="relative bg-transparent text-white text-2xl cursor-pointer p-2 hover:bg-white/10 rounded-full"
          aria-label="Notifications"
        >
          🔔
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[11px] leading-[18px] text-white text-center">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
