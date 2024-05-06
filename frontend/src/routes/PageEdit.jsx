import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updatePage } from "../pages";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updatePage(params.pageId, updates);
  return redirect(`/pages/${params.pageId}`);
}

export default function PageEdit() {
  const { page } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="page-form">
      <p>
        <span>Title</span>
        <input placeholder="Title" type="text" name="title" defaultValue={page?.title} />
      </p>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={page?.notes} rows={16} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={() => {navigate(-1);}}>Cancel</button>
      </p>
    </Form>
  );
}

