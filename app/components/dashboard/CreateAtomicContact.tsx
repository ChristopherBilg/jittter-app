import { Form, useSubmit } from "@remix-run/react";
import { AtomType } from "~/app/db.server/mongodb/atom";
import { AtomFormAction } from "~/app/routes/atoms/route";
import { CreateContactAtomSchema } from "~/app/routes/atoms/validate";

const CreateAtomicContact = () => {
  const submit = useSubmit();

  return (
    <Form
      method="POST"
      action="/atoms"
      className="flex flex-col space-y-2 overflow-hidden bg-white px-4 py-4 shadow-lg sm:rounded-md sm:px-6"
      onSubmit={(e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        formData.set("_createdAt", new Date().getTime().toString());

        submit(formData, { method: "POST", action: "/atoms", navigate: false });

        e.currentTarget.reset();
      }}
    >
      <input type="hidden" name="_action" value={AtomFormAction.CreateAtom} />
      <input type="hidden" name="_type" value={AtomType.Contact} />

      <input
        type="text"
        name="fullName"
        placeholder="Full name"
        className="rounded-md border border-gray-200 p-2"
        maxLength={
          CreateContactAtomSchema.shape.fullName.maxLength ?? undefined
        }
        required
      />

      <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          className="rounded-md border border-gray-200 p-2 md:w-1/2"
          maxLength={CreateContactAtomSchema.shape.email.maxLength ?? undefined}
        />

        <input
          type="tel"
          name="phoneNumber"
          placeholder="Phone number"
          className="rounded-md border border-gray-200 p-2 md:w-1/2"
          maxLength={
            CreateContactAtomSchema.shape.phoneNumber.maxLength ?? undefined
          }
        />
      </div>

      <textarea
        name="notes"
        placeholder="Notes"
        className="min-h-32 rounded-md border border-gray-200 p-2"
        maxLength={CreateContactAtomSchema.shape.notes.maxLength ?? undefined}
      />

      <input type="submit" className="hidden" />
    </Form>
  );
};

export default CreateAtomicContact;
