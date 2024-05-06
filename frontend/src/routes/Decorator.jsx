import { Outlet, NavLink, Form, useLoaderData, redirect, useNavigation, useSubmit } from "react-router-dom";
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
      <div id="navigation">
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
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
          <Form method="post">
            <button type="submit">New Page</button>
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
      <div id="content" className={navigation.state === "loading" ? "loading" : ""}>
        <Outlet />
      </div>
    </>
  );
}

