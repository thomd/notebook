import { NavLink } from "react-router-dom";

export default function Navigation({ pages }) {
  return (
    <nav>
      {pages.length ? (
        <ul>
          <li className="mb-4">
            <NavLink to={''}>Home</NavLink>
          </li>
          {pages.map((page) => (
            <li key={page.id}>
              <NavLink
                to={`pages/${page.id}`}
                className={({ isActive, isPending }) =>
                    isActive
                    ? "active"
                      : isPending
                      ? "pending"
                    : ""
                }
              >
                {page.title ? (
                  <>
                    {page.title}
                  </>
                ) : (
                  <span>No Title</span>
                )}{" "}
                {page.favorite && <span>★</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <p>No Pages</p>
      )}
    </nav>
  );
}

