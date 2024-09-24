import { AtomicReminderFrequency } from "~/app/utils/misc";

export type NoteStructure = {
  data: {
    content: string;
  };
};

export type ContactStructure = {
  data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    notes: string;
  };
};

export type ReminderStructure = {
  data: {
    content: string;
    frequency: AtomicReminderFrequency;
    startingAt: string;
  };
};

export const enum AtomType {
  Note = "note",
  Contact = "contact",
  Reminder = "reminder",
}

export type AtomStructure<
  T = NoteStructure | ContactStructure | ReminderStructure,
> = {
  _id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  type: AtomType;
} & T;

export class Atom {
  private static _baseUrl =
    "";

  static create = async (apiKey: string, userId: string, document: object) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        document: {
          userId,
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
          ...document,
        },
      });

      const newAtom = await fetch(`${this._baseUrl}/action/insertOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey,
        },
        body,
      });

      return {
        ok: newAtom.ok,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static get = async (apiKey: string, userId: string) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        filter: {
          userId,
          deletedAt: {
            $exists: false,
          },
        },
        sort: {
          createdAt: 1,
        },
      });

      const atoms = await fetch(`${this._baseUrl}/action/find`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey,
        },
        body,
      });

      const atomsJson: { documents: AtomStructure[] } = await atoms.json();
      return atomsJson.documents;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  static update = async (
    apiKey: string,
    userId: string,
    _id: string,
    document: object,
  ) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        filter: {
          _id: {
            $oid: _id,
          },
          userId,
        },
        update: {
          $set: {
            updatedAt: new Date().getTime(),
            ...document,
          },
        },
      });

      const updatedAtom = await fetch(`${this._baseUrl}/action/updateOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey,
        },
        body,
      });

      return {
        ok: updatedAtom.ok,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static softDelete = async (apiKey: string, userId: string, _id: string) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        filter: {
          _id: {
            $oid: _id,
          },
          userId,
        },
        update: {
          $set: {
            deletedAt: new Date().getTime(),
          },
        },
      });

      const deletedAtom = await fetch(`${this._baseUrl}/action/updateOne`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey,
        },
        body,
      });

      return {
        ok: deletedAtom.ok,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  static count = async (apiKey: string, userId: string) => {
    try {
      const body = JSON.stringify({
        dataSource: "jittter-product-cluster",
        database: "jittter-product-cluster",
        collection: "atom",
        pipeline: [
          {
            $match: {
              userId,
              deletedAt: {
                $exists: false,
              },
            },
          },
          {
            $group: {
              _id: null,
              count: {
                $sum: 1,
              },
            },
          },
        ],
      });

      const atoms = await fetch(`${this._baseUrl}/action/aggregate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Request-Headers": "*",
          apiKey,
        },
        body,
      });

      const data: { documents: { _id?: string; count?: number }[] } =
        await atoms.json();
      return Number(data?.documents?.[0]?.count ?? 0);
    } catch (err) {
      console.error(err);
      return 0;
    }
  };
}
