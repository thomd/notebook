import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getPage, updatePage } from "../pages";

export async function loader({ params }) {
  const page = await getPage(params.pageId);
  if (!page) {
    throw new Response("", { status: 404, statusText: "Page Not Found" });
  }
  return { page };
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updatePage(params.pageId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Page() {
  const { page } = useLoaderData();
  return (
    <div id="page">
      <div>
        <h1>{page.title ? (<>{page.title}</>) : (<>No Title</>)}{" "}<Favorite page={page} /></h1>
        {page.notes && <p>{page.notes}</p>}
        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (
                !window.confirm(
                  "Please confirm you want to delete this page."
                )
              ) {
                event.preventDefault();
              }
              }}
            >
              <button type="submit">Delete</button>
            </Form>
          </div>
        </div>
      </div>
  );
}

function Favorite({ page }) {
  const fetcher = useFetcher();
  let favorite = page.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post">
      <button name="favorite" value={favorite ? "false" : "true"}>
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

