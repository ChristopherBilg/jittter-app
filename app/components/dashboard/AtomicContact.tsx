import { AtomStructure, ContactStructure } from "~/app/db/models/atom.server";

type AtomicContactProps = {
  atom: AtomStructure<ContactStructure>;
};

const AtomicContact = ({ atom }: AtomicContactProps) => {
  return <p>{atom.data.fullName}</p>;
};

export default AtomicContact;
