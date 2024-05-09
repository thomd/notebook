import { Outlet, NavLink, Form, useLoaderData, redirect, useNavigation } from "react-router-dom";
import { Search } from "../components/Search";
import { getPages, createPage } from "../pages";
import { useEffect } from "react";

export async function action() {
  const page = await createPage();
  return redirect(`/pages/${page.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const pages = await getPages(q);
  return { pages, q };
}

export default function Decorator() {
  const { pages, q } = useLoaderData();
  const navigation = useNavigation();

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="header" className="header">
        <div className="flex">
          <Search />
          <Form method="post">
            <button type="submit" className="ml-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">New Page</button>
          </Form>
        </div>
      </div>
      <div id="navigation" className="navigation">
        <nav>
          {pages.length ? (
            <ul>
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
      </div>
      <div id="content" className={"content" + (navigation.state === "loading" ? " loading" : "")}>
        <Outlet />
      </div>
      <div id="footer" className="footer">
        Footer
      </div>
    </>
  );
}

