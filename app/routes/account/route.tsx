import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/cloudflare";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { User } from "~/app/db.server/postgresql/models/user";
import { redirectIfNotAuthenticated } from "~/app/sessions";
import { exhaustiveMatchingGuard } from "~/app/utils/misc";
import {
  UpdateNameSchema,
  UpdatePasswordSchema,
  validateUpdateName,
  validateUpdatePassword,
} from "./validate";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Account Settings - General",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await redirectIfNotAuthenticated(request, "/signin");

  return json({
    user,
  });
};

const enum AtomFormAction {
  UpdateName = "update-name",
  UpdatePassword = "update-password",
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const {
    user: { id: userId },
  } = await redirectIfNotAuthenticated(request, "/signin");

  const formData = await request.formData();
  const _action = formData.get("_action") as AtomFormAction;

  switch (_action) {
    case AtomFormAction.UpdateName: {
      const validateResult = await validateUpdateName(formData);
      if (!validateResult) return null;

      const { firstName, lastName } = validateResult;

      await User.update(userId, {
        firstName,
        lastName,
      });

      return null;
    }
    case AtomFormAction.UpdatePassword: {
      const validateResult = await validateUpdatePassword(formData);
      if (!validateResult) return null;

      const { newPassword } = validateResult;

      await User.updateAuthentication(userId, newPassword);

      return null;
    }
    default:
      return exhaustiveMatchingGuard(_action);
  }
};

const primaryNavigation = [
  { name: "Account Settings", to: "#", current: true },
];

const secondaryNavigation = [
  { name: "General", to: "#", icon: UserCircleIcon, current: true },
];

const AccountRoute = () => {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 flex h-16 border-b border-gray-900/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center gap-x-6">
            <button
              type="button"
              className="-m-3 p-3 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-5 w-5 text-gray-900" aria-hidden="true" />
            </button>

            <img
              className="h-8 w-auto"
              src="/android-chrome-192x192.png"
              alt="Jittter"
            />
          </div>

          <nav className="hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700">
            {primaryNavigation.map((item, itemIdx) => (
              <Link
                key={itemIdx}
                to={item.to}
                className={clsx(
                  item.current
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-700 hover:text-blue-600",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-x-8">
            <Link
              to="/dashboard"
              className="-m-1.5 rounded-md p-1.5 text-gray-700 hover:bg-gray-100"
            >
              <span>My Dashboard</span>
            </Link>
          </div>
        </div>

        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />

          <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
            <div className="-ml-0.5 flex h-16 items-center gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="-ml-0.5">
                <Link to="#" className="-m-1.5 block p-1.5">
                  <span className="sr-only">Jittter</span>
                  <img
                    className="h-8 w-auto"
                    src="/android-chrome-192x192.png"
                    alt=""
                  />
                </Link>
              </div>
            </div>

            <div className="mt-2 space-y-2">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={clsx(
                    "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50",
                    item.current
                      ? "text-blue-600"
                      : "text-gray-900 hover:text-blue-600",
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
        <h1 className="sr-only">General Settings</h1>

        <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
            <ul className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className={clsx(
                      "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6",
                      item.current
                        ? "bg-gray-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
                    )}
                  >
                    <item.icon
                      className={clsx(
                        "h-6 w-6 shrink-0",
                        item.current
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-blue-600",
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Profile
                </h2>

                <span className="text-sm text-gray-700">({user.email})</span>
              </div>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Full name
                  </dt>

                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <fetcher.Form method="POST">
                      <div className="mx-auto flex w-full justify-start">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          autoComplete="given-name"
                          className="mr-2 w-1/2 rounded border px-4 py-2"
                          defaultValue={user.firstName || ""}
                          maxLength={
                            UpdateNameSchema.shape.firstName.maxLength ??
                            undefined
                          }
                          required
                        />

                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          autoComplete="family-name"
                          className="w-1/2 rounded border px-4 py-2"
                          defaultValue={user.lastName || ""}
                          maxLength={
                            UpdateNameSchema.shape.lastName.maxLength ??
                            undefined
                          }
                          required
                        />
                      </div>

                      <input
                        type="hidden"
                        name="_action"
                        value={AtomFormAction.UpdateName}
                      />

                      <input
                        type="submit"
                        value={
                          fetcher.state !== "idle" &&
                          fetcher.formData?.get("_action") ===
                            AtomFormAction.UpdateName
                            ? "Updating Name..."
                            : "Update Name"
                        }
                        className="mx-auto my-1 w-fit cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                      />
                    </fetcher.Form>
                  </dd>
                </div>
              </dl>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                <div className="pt-6 sm:flex">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Password
                  </dt>

                  <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <fetcher.Form method="POST">
                      <div className="mx-auto flex w-full justify-start">
                        <input
                          type="password"
                          name="newPassword"
                          placeholder="New password"
                          autoComplete="new-password"
                          className="mr-2 w-1/2 rounded border px-4 py-2"
                          defaultValue=""
                          minLength={
                            UpdatePasswordSchema._def.schema.shape.newPassword
                              .minLength ?? undefined
                          }
                          maxLength={
                            UpdatePasswordSchema._def.schema.shape.newPassword
                              .maxLength ?? undefined
                          }
                          required
                        />

                        <input
                          type="password"
                          name="confirmNewPassword"
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                          className="w-1/2 rounded border px-4 py-2"
                          defaultValue=""
                          minLength={
                            UpdatePasswordSchema._def.schema.shape
                              .confirmNewPassword.minLength ?? undefined
                          }
                          maxLength={
                            UpdatePasswordSchema._def.schema.shape
                              .confirmNewPassword.maxLength ?? undefined
                          }
                          required
                        />
                      </div>

                      <input
                        type="hidden"
                        name="_action"
                        value={AtomFormAction.UpdatePassword}
                      />

                      <input
                        type="submit"
                        value={
                          fetcher.state !== "idle" &&
                          fetcher.formData?.get("_action") ===
                            AtomFormAction.UpdatePassword
                            ? "Updating Password..."
                            : "Update Password"
                        }
                        className="mx-auto my-1 w-fit cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                      />
                    </fetcher.Form>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AccountRoute;
