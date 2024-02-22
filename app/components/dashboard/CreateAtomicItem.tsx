import { useFetcher } from "@remix-run/react";
import { FormAction } from "~/app/routes/notes/route";
import { CreateNoteSchema } from "~/app/routes/notes/validate";

const CreateAtomicItem = () => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="POST"
      className="flex flex-col overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
      action="/notes"
    >
      <input type="hidden" name="_action" value={FormAction.CreateNote} />

      <input
        type="text"
        name="content"
        placeholder="Add a note"
        className="rounded-md border border-gray-200 p-2"
        maxLength={CreateNoteSchema.shape.content.maxLength ?? undefined}
        required
        // TODO: Use optimistic add, clear out the input field on submission, and scroll to this form
      />
    </fetcher.Form>
  );
};

export default CreateAtomicItem;
