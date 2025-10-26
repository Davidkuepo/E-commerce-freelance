import { Link } from "react-router";

export default function AppHeader() {
  const closeUserMenu = () => {
    console.log("closeUserMenu");
  };

  const logout = () => {
    console.log("logout");
  };

  const toggleCollapse = () => {
    console.log("toggleCollapse");
  };

  const toggleUserMenu = () => {
    console.log("toggleUserMenu");
  };

  return (
    <header>
      <nav className="bg-white border-gray-200">
        <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            {/*<mat-icon color="primary">storefront</mat-icon>*/}
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              E-Commerce
            </span>
          </Link>

          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="relative">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                onClick={toggleUserMenu}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  src="getAvatar((user$ | async)!)"
                  className="w-8 h-8 rounded-full"
                  alt="user photo"
                />
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 text-white">
                  (user$ | async)?.name?.[0] || (user$ | async)?.email?.[0] ||
                  'U'
                </span>
              </button>

              <div className="absolute right-0 top-full mt-2 z-50 w-56 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg border border-gray-100">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900">
                    user$ | async)?.name || (user$ | async)?.email
                  </span>
                  <span className="block text-sm text-gray-500 truncate">
                    (user$ | async)?.email
                  </span>
                </div>
                <ul className="py-2">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeUserMenu}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cart"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={closeUserMenu}
                    >
                      Panier
                    </Link>
                  </li>
                  <li>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={logout}
                    >
                      Déconnexion
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              onClick={toggleCollapse}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className="items-center justify-between w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-700 md:p-0"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-700 md:p-0"
                >
                  Produits
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="relative block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-700 md:p-0"
                >
                  Panier
                  <span className="absolute -top-1 -right-2 text-xs rounded-full bg-amber-500 text-white px-2">
                    cartCount
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
