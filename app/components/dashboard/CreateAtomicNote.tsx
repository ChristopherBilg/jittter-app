import { Form, useSubmit } from "@remix-run/react";
import { AtomType } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { CreateNoteAtomSchema } from "~/app/routes/atoms/validate";

const CreateAtomicNote = () => {
  const submit = useSubmit();

  return (
    <Form
      method="POST"
      action="/atoms"
      className="flex flex-col overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.set("_createdAt", new Date().getTime().toString());

        submit(formData, {
          method: "POST",
          action: "/atoms",
          navigate: false,
          unstable_flushSync: true,
        });

        e.currentTarget.reset();
        e.currentTarget.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <input type="hidden" name="_action" value={AtomFormAction.CreateAtom} />
      <input type="hidden" name="_type" value={AtomType.Note} />

      <input
        type="text"
        name="content"
        placeholder="Add a note"
        className="rounded-md border border-gray-200 p-2"
        maxLength={CreateNoteAtomSchema.shape.content.maxLength ?? undefined}
        required
      />
    </Form>
  );
};

export default CreateAtomicNote;
