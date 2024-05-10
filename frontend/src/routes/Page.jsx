import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getPage, patchPage } from "../pages";

export async function loader({ params }) {
  const page = await getPage(params.pageId);
  if (!page) {
    throw new Response("", { status: 404, statusText: "Page Not Found" });
  }
  return { page };
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return patchPage(params.pageId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Page() {
  const { page } = useLoaderData();
  return (
    <div className="page">
      <h1 className="mb-4 text-lg font-medium">
        <Title page={page} />
        <Favorite page={page} />
      </h1>
      {page.content && <p>{page.content}</p>}
      <div>
        <Form action="edit" className="inline">
          <button type="submit" className="mt-4 py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">Edit</button>
        </Form>
        <Form
          method="post"
          action="delete"
          className="inline"
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
          <button type="submit" className="mt-4 ml-4 py-1 px-3 bg-red-400 hover:bg-red-500 text-white text-base rounded outline-none">Delete</button>
        </Form>
      </div>
    </div>
  );
}

function Title({ page }) {
  return (
    <>
      {page.category ? (
        <>
          <span>{page.category}: </span>
          <span>{page.title}</span>
        </>
      ) : (
        <span>{page.title}</span>
      )}
    </>
  );
}

function Favorite({ page }) {
  const fetcher = useFetcher();
  let favorite = page.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }
  return (
    <fetcher.Form method="post" className="inline ml-4">
      <button name="favorite" value={favorite ? "false" : "true"}>
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

