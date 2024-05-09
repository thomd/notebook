import { Outlet, Form, useLoaderData, redirect, useNavigation } from "react-router-dom";
import { Search } from "../components/Search";
import Navigation from "../components/Navigation";
import { getPages, createPage } from "../pages";

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
  return (
    <>
      <div className="header">
        <div className="flex">
          <Search q={q} />
          <NewButton />
        </div>
      </div>
      <div className="navigation">
        <Navigation pages={pages} />
      </div>
      <div className={"content" + (navigation.state === "loading" ? " loading" : "")}>
        <Outlet />
      </div>
      <div className="footer">
        Footer
      </div>
    </>
  );
}

function NewButton() {
  return (
    <>
      <Form method="post">
        <button type="submit" className="ml-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">New Page</button>
      </Form>
    </>
  );
}
