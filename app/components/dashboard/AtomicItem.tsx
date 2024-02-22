import {
  AtomStructure,
  ContactStructure,
  NoteStructure,
} from "~/app/db/mongodb/atom.server";
import AtomicContact from "./AtomicContact";
import AtomicNote from "./AtomicNote";

type AtomicItemProps = {
  atom: AtomStructure;
};

const AtomicItem = ({ atom }: AtomicItemProps) => {
  switch (atom.type) {
    case "note": {
      return <AtomicNote atom={atom as AtomStructure<NoteStructure>} />;
    }
    case "contact":
      return <AtomicContact atom={atom as AtomStructure<ContactStructure>} />;
    default:
      // TODO: Render a default component for unknown atom types (e.g. AtomicUnknown) with a way to delete the atom
      return null;
  }
};

export default AtomicItem;
