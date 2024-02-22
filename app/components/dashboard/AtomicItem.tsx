import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import { NoteTable } from "~/app/db/schema";
import { FormAction } from "~/app/routes/notes/route";

type AtomicItemProps = {
  note: InferSelectModel<typeof NoteTable>;
};

const AtomicItem = ({ note }: AtomicItemProps) => {
  const fetcher = useFetcher();

  const [editable, setEditable] = useState(false);

  return (
    <div className="flex justify-between space-x-2 overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6">
      {editable ? (
        <fetcher.Form
          method="POST"
          action="/notes"
          className="w-full"
          onSubmit={() => setEditable(false)}
        >
          <input type="hidden" name="_action" value={FormAction.UpdateNote} />
          <input type="hidden" name="noteId" value={note.id} />

          <input
            type="text"
            name="content"
            defaultValue={note.content ?? ""}
            className="w-full rounded-md border border-gray-200 p-2"
          />
        </fetcher.Form>
      ) : (
        <button onClick={() => setEditable(true)} className="w-full">
          <p className="text-left">{note.content}</p>
        </button>
      )}

      <fetcher.Form method="POST" action="/notes">
        <input type="hidden" name="_action" value={FormAction.DeleteNote} />
        <input type="hidden" name="noteId" value={note.id} />

        <button type="submit" className="rounded-md bg-red-300 text-white">
          <span className="sr-only">Delete, {note.content}</span>
          <XMarkIcon className="h-4 w-4" />
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AtomicItem;
