import { Outlet, Form, useLoaderData, redirect, useNavigation } from "react-router-dom";
import { Search } from "../components/Search";
import Navigation from "../components/Navigation";
import { NewButton, NewModal } from "../components/NewPage";
import { getPages, createPage } from "../pages";

export async function action() {
  //const page = await createPage();
  //return redirect(`/pages/${page.id}/edit`);
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
      <div className="header flex flex-nowrap justify-between items-center">
        <Search q={q} />
        <NewButton />
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

