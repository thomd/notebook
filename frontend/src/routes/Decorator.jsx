import { Outlet, NavLink, Form, useLoaderData, redirect, useNavigation, useSubmit } from "react-router-dom";
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
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    <>
      <div id="header" className="header">
        <Search />
      </div>
      <div id="navigation" className="navigation">
        <div className="flex-1 flex-col">
          <Form id="search-form" className="relative">
            <input
              id="q"
              className={"block w-full border-0 py-1 pr-2 pl-8 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none" + (searching ? " loading" : "")}
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div id="search-spinner" hidden={!searching} />
          </Form>
          <Form method="post" className="my-4">
            <button type="submit" className="py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">New Page</button>
          </Form>
        </div>
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

