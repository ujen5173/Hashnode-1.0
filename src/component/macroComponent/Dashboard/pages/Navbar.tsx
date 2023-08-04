import { useSession } from "next-auth/react";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { Add, Pen, Plus, Times } from "~/svgs";
import { api } from "~/utils/api";
import { isValidURL } from "~/utils/miniFunctions";

const Navbar = () => {
  const { data: user } = useSession();
  const [addNewItem, setAddNewItem] = useState(false);

  const { data, isLoading, refetch } = api.handles.getNavbarData.useQuery(
    {
      handle: user?.user?.handle?.handle as string,
    },
    {
      enabled: !!user?.user.handle?.handle,
      refetchOnWindowFocus: false,
    }
  );

  const [navbarItems, setNavbarItems] = useState<
    {
      id: string;
      label: string;
      type: string;
      value: string;
      priority: number;
      createdAt: Date;
      updatedAt: Date;
      handleId: string;
    }[]
  >([]);

  useEffect(() => {
    if (data) {
      setNavbarItems(data);
    }
  }, [data]);

  const refetchData = async () => {
    const res = await refetch();
    if (res.data) {
      setNavbarItems(res.data);
      setAddNewItem(false);
    }
  };

  return (
    <section className="relative w-full">
      <h1 className="mb-8 text-4xl font-semibold text-gray-700 dark:text-text-secondary">
        General Settings
      </h1>

      {isLoading ? (
        <div className="flex flex-col items-center px-4 py-16">
          <h1 className="mb-4 text-3xl font-semibold text-gray-700 dark:text-text-secondary">
            Loading...
          </h1>
        </div>
      ) : addNewItem || (navbarItems && navbarItems?.length > 0) ? (
        <NavBarItem
          data={navbarItems}
          addNewItem={addNewItem}
          refetchData={refetchData}
          setAddNewItem={setAddNewItem}
        />
      ) : (
        <div className="flex flex-col items-center px-4 py-16">
          <h1 className="mb-4 text-3xl font-semibold text-gray-700 dark:text-text-secondary">
            You haven&apos;t created any Nav Item.
          </h1>
          <button
            type="button"
            onClick={() => setAddNewItem(true)}
            className="btn-outline flex items-center gap-2"
          >
            <Plus className="h-4 w-4 fill-secondary" />
            <span>Add an itesm</span>
          </button>
        </div>
      )}
    </section>
  );
};
export default Navbar;

const NavBarItem: FC<{
  data: {
    id: string;
    label: string;
    type: string;
    value: string;
    priority: number;
  }[];
  refetchData: () => Promise<void>;
  addNewItem: boolean;
  setAddNewItem: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ addNewItem, setAddNewItem, data, refetchData }) => {
  const { mutateAsync } = api.handles.newNavbarData.useMutation();

  const [newItemData, setNewItemData] = useState<{
    label: string;
    type: string;
    value: string;
    priority: number;
  }>({
    label: "",
    type: "LINK",
    value: "https://",
    priority: 0,
  });

  const { data: user } = useSession();

  const saveNavbar = async () => {
    // add new nav item
    const userHandle = user?.user?.handle?.handle;

    if (!userHandle) return;

    const urlChecking = isValidURL(newItemData.value);
    if (!urlChecking) {
      toast.error("Invalid URL");
      return;
    }

    const res = await mutateAsync({
      handle: userHandle,
      tab: newItemData,
    });

    setNewItemData({
      label: "",
      type: "LINK",
      value: "",
      priority: 0,
    });
    if (res) {
      void refetchData();
    }
  };

  const { mutateAsync: deleteItem } =
    api.handles.deleteNavbarData.useMutation();

  const { mutateAsync: updateItem, isLoading: isUpdating } =
    api.handles.updateNavbarData.useMutation();

  const [editing, setEditing] = useState({
    status: false,
    id: "",
  });

  const editItem = async () => {
    const urlChecking = isValidURL(newItemData.value);
    if (!urlChecking) {
      toast.error("Invalid URL");
      return;
    }
    await updateItem({
      handle: editing.id,
      tab: newItemData,
    });

    void refetchData();
    setEditing({
      status: false,
      id: "",
    });
    setAddNewItem(false);
  };

  const removeItem = async (id: string) => {
    await deleteItem({
      tabId: id,
    });

    void refetchData();
  };

  return (
    <div className="md rounded border border-border-light dark:border-border">
      <header className="flex flex-row items-center border-b px-4 py-4 font-medium leading-none text-slate-600 dark:border-slate-800 dark:text-slate-400">
        <div className="w-1/4 pr-4">Label</div>
        <div className="w-1/4 pr-4">Type</div>
        <div className="w-1/4 pr-4">Value</div>
        <div className="flex-1 pr-4">Priority</div>
      </header>
      <main>
        {addNewItem && (
          <div className="flex items-center border-b border-border-light bg-light-bg px-4 py-4 text-slate-900 dark:border-border dark:bg-primary-light dark:text-slate-200">
            <div className="w-1/4 pr-4 text-left">
              <input
                type="text"
                className="w-full rounded-md border border-border-light bg-light-bg px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border dark:bg-primary"
                placeholder="Label"
                value={newItemData.label}
                autoFocus
                onChange={(e) =>
                  setNewItemData({ ...newItemData, label: e.target.value })
                }
              />
            </div>
            <div className="w-1/4 pr-4 text-left">
              <div className="w-full cursor-not-allowed rounded-md border border-border-light bg-slate-100 px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border dark:bg-border">
                LINK
              </div>
            </div>
            <div className="w-1/4 break-words pr-4 text-left font-medium text-secondary">
              <input
                type="text"
                className="w-full rounded-md border border-border-light bg-light-bg px-4 py-3 text-gray-700 outline-none focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border dark:bg-primary dark:text-text-secondary"
                placeholder="Value"
                value={newItemData.value}
                onChange={(e) =>
                  setNewItemData({ ...newItemData, value: e.target.value })
                }
              />
            </div>
            <div className="flex-1 pr-4 text-left">
              <input
                type="number"
                className="w-full rounded-md border border-border-light bg-light-bg px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border dark:bg-primary"
                placeholder="Priority"
                value={newItemData.priority}
                onChange={(e) =>
                  setNewItemData({
                    ...newItemData,
                    priority: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        )}

        {data.map((e) =>
          editing.status && editing.id === e.id ? (
            <div
              key={e.id}
              className="flex items-center border-b border-border-light bg-light-bg px-4 py-4 text-slate-900 dark:border-border dark:bg-primary-light dark:text-slate-200"
            >
              <div className="w-1/4 pr-4 text-left">
                <input
                  type="text"
                  className="w-full rounded-md border border-border-light bg-light-bg px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border dark:bg-primary"
                  placeholder="Label"
                  value={newItemData.label}
                  autoFocus
                  onChange={(e) =>
                    setNewItemData({ ...newItemData, label: e.target.value })
                  }
                />
              </div>
              <div className="w-1/4 pr-4 text-left">
                <div className="w-full cursor-not-allowed rounded-md border border-border-light bg-slate-100 px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border dark:bg-border">
                  LINK
                </div>
              </div>
              <div className="w-1/4 break-words pr-4 text-left font-medium text-secondary">
                <input
                  type="text"
                  className="w-full rounded-md border border-border-light bg-light-bg px-4 py-3 text-gray-700 outline-none focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border dark:bg-primary dark:text-text-secondary"
                  placeholder="Value"
                  value={newItemData.value}
                  onChange={(e) =>
                    setNewItemData({ ...newItemData, value: e.target.value })
                  }
                />
              </div>
              <div className="flex-1 pr-4 text-left">
                <input
                  type="number"
                  className="w-full rounded-md border border-border-light bg-light-bg px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-secondary dark:border-border dark:bg-primary"
                  placeholder="Priority"
                  value={newItemData.priority}
                  onChange={(e) =>
                    setNewItemData({
                      ...newItemData,
                      priority: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <div
              className="flex flex-row items-center border-b bg-white px-4 py-4 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              key={e.id}
            >
              <div className="w-1/4 pr-4 text-left">{e.label}</div>
              <div className="w-1/4 pr-4 text-left">{e.type}</div>
              <div className="w-1/4 break-words pr-4 text-left font-medium text-secondary">
                <a href={e.value} target="_blank">
                  {e.value}
                </a>
              </div>
              <div className="flex-1 pr-4 text-left">{e.priority}</div>
              <button
                onClick={() => {
                  setEditing({
                    status: true,
                    id: e.id,
                  });
                  const { id, ...rest } = e;
                  setNewItemData(rest);
                }}
                className="btn-icon-large flex items-center gap-2"
              >
                <Pen className="h-5 w-5 fill-none stroke-gray-700 dark:stroke-text-secondary" />
              </button>
              <button
                onClick={() => void removeItem(e.id)}
                className="btn-icon-large flex items-center gap-2"
              >
                <Times className="h-5 w-5 fill-gray-700 stroke-none dark:fill-text-secondary" />
              </button>
            </div>
          )
        )}

        <div className="p-4">
          {addNewItem ? (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setAddNewItem(false);
                }}
                className="btn-subtle flex items-center gap-2"
              >
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={() => void saveNavbar()}
                className="btn-outline flex items-center gap-2"
              >
                <Add className="h-4 w-4 fill-secondary" />
                <span>Save Navbar</span>
              </button>
            </div>
          ) : editing.status ? (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEditing({
                    status: false,
                    id: "",
                  });
                  setNewItemData({
                    label: "",
                    type: "LINK",
                    value: "https://",
                    priority: 0,
                  });
                }}
                className="btn-subtle flex items-center gap-2"
              >
                <span>Cancel</span>
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => void editItem()}
                className={`btn-outline flex items-center gap-2 ${isUpdating ? "cursor-not-allowed opacity-40" : ""
                  }}`}
              >
                <span>{isUpdating ? "Updating" : "Update"}</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-outline flex items-center gap-2"
              onClick={() => setAddNewItem(true)}
            >
              <Plus className="h-4 w-4 fill-secondary" />
              <span>Add an item</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};
