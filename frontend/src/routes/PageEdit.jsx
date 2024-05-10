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
    <Form method="post" className="grid grid-cols-2 gap-8">
      <div>
        <input placeholder="Title" type="text" name="title" defaultValue={page?.title} className="block w-full border-0 px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-300 outline-none" />
      </div>
      <div>
        <input placeholder="Category" type="text" name="category" defaultValue={page?.category} className="block w-full border-0 px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-300 outline-none" />
      </div>
      <div className="col-span-2">
        <textarea name="notes" defaultValue={page?.notes} rows={16} className="block w-full border-0 px-2 py-1 text-gray-900 shadow-sm ring-1 ring-gray-300 outline-none" />
      </div>
      <div className="col-span-2">
        <button type="submit" className="py-1 px-3 bg-gray-400 hover:bg-gray-500 text-white text-base rounded outline-none">Save</button>
        <button type="button" onClick={() => {navigate(-1);}} className="ml-4 py-1 px-3 bg-white text-gray-500 text-base rounded border border-gray-400">Cancel</button>
      </div>
    </Form>
  );
}

