import React, { useEffect, useState } from "react";
import { getMenus, updateMenu } from "../services/api";
import type { Menu } from "../types/menu";
import MenuItem from "../components/MenuItem";
import { BsFillGrid3X3GapFill, BsGridFill } from "react-icons/bs";
import { FaAngleDown, FaAngleRight, FaFolder } from "react-icons/fa";
import { AiOutlineMenuUnfold } from "react-icons/ai";

const HomePage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoot, setSelectedRoot] = useState<number | "">("");
  const [expandAll, setExpandAll] = useState<boolean | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [parentName, setParentName] = useState<string>("Root");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSystemsOpen, setIsSystemsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getMenus()
      .then(setMenus)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedMenu?.parentId) {
      setParentName("Root");
      return;
    }
    const findParent = (menus: Menu[]): string | null => {
      for (const m of menus) {
        if (m.id === selectedMenu.parentId) return m.name;
        const found = findParent(m.children || []);
        if (found) return found;
      }
      return null;
    };

    const name = findParent(menus);
    setParentName(name || "-");
  }, [selectedMenu, menus]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto close sidebar
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);


  const handleSave = async () => {
    if (!selectedMenu) return;
    await updateMenu(selectedMenu.id, selectedMenu.name);
    fetchData();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  const rootMenu = menus.find((m) => m.id === selectedRoot);

  return (
    <div className="flex min-h-screen w-full">
      {/* Backdrop (mobile only) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
      {/* Sidebar */}
      <div className="relative">
        {isSidebarOpen ? (
          <div className={`
            fixed md:relative top-0 left-0 h-full w-64
            bg-blue-900 text-white p-4 flex flex-col
            rounded-r-xl shadow-lg transition-all duration-300 z-50
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}>

            {/* Title */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-start gap-2">
                <BsFillGrid3X3GapFill size={45} className="mt-1" />
                <h2 className="text-xs leading-tight text-left">
                  Solusi<br />
                  Teknologi<br />
                  Kreatif
                </h2>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-white hover:text-gray-300">
                <AiOutlineMenuUnfold size={20} />
              </button>
            </div>

            {/* MENU */}
            <ul className="flex flex-col gap-4">

              {/* SYSTEMS */}
              <li>
                <div className="bg-blue-700 rounded-xl p-2 flex flex-col gap-1 transition-all duration-300">
                  <div
                    onClick={() => setIsSystemsOpen(!isSystemsOpen)}
                    className="flex items-center justify-between cursor-pointer hover:text-gray-200 px-2 py-1">
                    <div className="flex items-center gap-2">
                      <FaFolder />
                      <span>Systems</span>
                    </div>

                    <span>
                      {isSystemsOpen ? <FaAngleDown size={18}/> : <FaAngleRight size={18}/>}
                    </span>
                  </div>

                  {/* Sub menu */}
                  {isSystemsOpen && (
                    <div className="flex flex-col gap-1 mt-1">
                      {["System Code", "Properties", "Menus", "API List"].map((menu) => {
                        const isActive = menu === "Menus";
                        return (
                          <a
                            key={menu}
                            href="#"
                            className={`p-2 rounded-lg flex items-center gap-2 text-sm transition
                              ${isActive
                                ? "bg-white text-blue-700"
                                : "text-white hover:bg-blue-600"
                              }`}>
                            <BsGridFill
                              size={14}
                              className={isActive ? "text-blue-700" : "text-white"}
                            />
                            {menu}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </li>

              {/* USERS & GROUP */}
              <li className="flex items-center gap-1 cursor-pointer hover:text-gray-300">
                <FaFolder />
                <a href="#">Users & Group</a>
              </li>

              {/* COMPETITION */}
              <li className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                <FaFolder />
                <a href="#">Competition</a>
              </li>

            </ul>
          </div>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-0 top-4 p-2 border border-blue-700 text-blue-700 rounded-r-lg shadow-md bg-white hover:bg-blue-50">
            <AiOutlineMenuUnfold size={20} />
          </button>
        )}
      </div>

      {/* Tree + Form */}
      <div className="flex flex-1 flex-col md:flex-row gap-4 p-4 bg-white items-start">
        {/* Tree */}
        <div className="w-full md:flex-1 bg-white p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-2 mt-3">
            <div className="bg-blue-700 text-white p-3 rounded-full">
              <BsGridFill size={20} />
            </div>

            <h1 className="text-black font-bold">
              Menus
            </h1>
          </div>

          {/* Title + Dropdown */}
          <h2 className="mb-2 text-black text-left font-normal text-lg">
            Menu
          </h2>

          <div className="relative w-full mb-4">
            <select
              className="w-full appearance-none border border-gray-200 bg-gray-50 px-4 py-3 pr-10 
              rounded-xl text-base font-normal text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRoot}
              onChange={(e) =>
                setSelectedRoot(e.target.value === "" ? "" : Number(e.target.value))
              }>
              <option value="" disabled hidden>
                Select Root Menu
              </option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id} className="text-black">
                  {menu.name}
                </option>
              ))}
            </select>

            {/* Custom dropdown icon (biar mentok kanan & modern) */}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaAngleDown className="text-gray-400" size={20}/>
            </div>
          </div>

          {/* Expand / Collapse All Buttons */}
          <div className="mb-7 flex gap-2">
            <button
              onClick={() => setExpandAll(true)}
              className={`px-4 py-1 rounded-full border transition
                ${expandAll === true 
                  ? "bg-black text-white" 
                  : "bg-white text-black border-gray-300"}
              `}>
              Expand All
            </button>

            <button
              onClick={() => setExpandAll(false)}
              className={`px-4 py-1 rounded-full border transition
                ${expandAll === false 
                  ? "bg-black text-white" 
                  : "bg-white text-black border-gray-300"}
              `}>
              Collapse All
            </button>
          </div>

          {/* Tree */}
          <div className="flex-1 overflow-auto text-gray-700">
            {rootMenu && (
              <MenuItem
                menu={rootMenu}
                refresh={fetchData}
                setSelectedMenu={setSelectedMenu}
                selectedMenu={selectedMenu}
                ancestorLines={[]}
                isLast={true}
                expandAll={expandAll}
              />
            )}
          </div>

        </div>

        {/* Form */}
        <div className="w-full md:flex-1 bg-white p-4 text-left mt-6 md:mt-0">
          <div className="flex flex-col gap-4">
            {/* <h2 className="text-lg font-bold">Edit Menu</h2> */}

            {/* ID */}
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">Menu ID</label>
              <input
                value={selectedMenu?.id ?? ""}
                placeholder="-"
                disabled
                className="w-full border border-gray-200 px-4 py-3 rounded-xl 
                bg-gray-100 text-black"
              />
            </div>

            {/* Depth */}
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">Depth</label>
              <input
                value={selectedMenu?.children?.length ?? 0}
                placeholder="0"
                disabled
                className="w-full border border-gray-200 px-4 py-3 rounded-xl 
                bg-gray-100 text-black"
              />
            </div>

            {/* Parent */}
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">Parent Data</label>
              <input
                value={parentName}
                placeholder="-"
                disabled
                className="w-full border border-gray-200 px-4 py-3 rounded-xl 
                bg-gray-100 text-black"
              />
            </div>

            {/* Name */}
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">Name</label>

              <input
                value={selectedMenu?.name ?? ""}
                placeholder="Enter menu name"
                onChange={(e) =>
                  selectedMenu &&
                  setSelectedMenu({ ...selectedMenu, name: e.target.value })
                }
                className="w-full border border-gray-200 bg-white px-4 py-3 rounded-xl 
                text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={handleSave}
                disabled={!selectedMenu}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg w-fit">
                Save
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;
