import {
  AtomStructure,
  AtomType,
  ContactStructure,
  DrawingStructure,
  NoteStructure,
  ReminderStructure,
} from "~/app/db.server/mongodb/atom";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import AtomicContact from "./AtomicContact";
import AtomicDrawing from "./AtomicDrawing";
import AtomicNote from "./AtomicNote";
import AtomicReminder from "./AtomicReminder";

type AtomicItemProps = {
  atom: AtomStructure;
};

const AtomicItem = ({ atom }: AtomicItemProps) => {
  switch (atom.type) {
    case AtomType.Note:
      return <AtomicNote atom={atom as AtomStructure<NoteStructure>} />;
    case AtomType.Contact:
      return <AtomicContact atom={atom as AtomStructure<ContactStructure>} />;
    case AtomType.Reminder:
      return <AtomicReminder atom={atom as AtomStructure<ReminderStructure>} />;
    case AtomType.Drawing:
      return <AtomicDrawing atom={atom as AtomStructure<DrawingStructure>} />;
    default: {
      exhaustiveMatchingGuard(atom.type);
      return null;
    }
  }
};

export default AtomicItem;
