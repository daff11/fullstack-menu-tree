import React, { useState, useEffect } from "react";
import type { Menu } from "../types/menu";
import { createMenu, deleteMenu } from "../services/api";
import { FaAngleDown, FaAngleRight, FaTrash } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

interface Props {
  menu: Menu;
  refresh: () => void;
  setSelectedMenu: (menu: Menu) => void;
  selectedMenu: Menu | null;
  ancestorLines?: boolean[];
  isLast?: boolean;
  expandAll?: boolean | null;
}

const ICON_WIDTH = 13;
const GAP = 4;
const PARENT_LINE_WIDTH = 24;
const CHILD_LINE_WIDTH = 10;

const MenuItem: React.FC<Props> = ({
  menu,
  refresh,
  setSelectedMenu,
  selectedMenu,
  ancestorLines = [],
  isLast = false,
  expandAll = null,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [newChild, setNewChild] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const isSelected = selectedMenu?.id === menu.id;

  useEffect(() => {
    if (expandAll !== null) setExpanded(expandAll);
  }, [expandAll]);

  const handleAddChild = async () => {
    if (!newChild) return;
    await createMenu(newChild, menu.id);
    setNewChild("");
    setIsAdding(false);
    refresh();
  };

  const handleDelete = async () => {
    if (confirm("Delete this menu?")) {
      await deleteMenu(menu.id);
      refresh();
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewChild("");
  };

  return (
    <div className="flex flex-col relative">
      <div className="flex items-start relative">
        {/* GARIS VERTICAL ANCESTOR */}
        {ancestorLines.map((hasLine, idx) => (
          <div key={idx} className="w-6 flex justify-center relative">
            {hasLine && (
              <div
                className="absolute top-0 bottom-0 w-px bg-gray-400"
                style={{ left: ICON_WIDTH / 2 }}
              />
            )}
          </div>
        ))}

        {/* GARIS HORIZONTAL SEBELUM ICON */}
        <div className="relative flex items-center">
          <span
            className="text-gray-400"
            style={{
              minWidth: ancestorLines.length > 0 ? CHILD_LINE_WIDTH : PARENT_LINE_WIDTH,
              display: "inline-block",
              paddingRight: GAP,
            }}
          >
            {ancestorLines.length > 0 ? (isLast ? "└──" : "├──") : ""}
          </span>

          {/* ICON FANGLE */}
          {menu.children.length > 0 ? (
            <span
              className="mr-1 cursor-pointer w-4 flex justify-center"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? <FaAngleDown size={ICON_WIDTH} /> : <FaAngleRight size={ICON_WIDTH} />}
            </span>
          ) : (
            <span className="mr-1 w-4 inline-block" />
          )}

          {/* NAMA NODE */}
          <span
            className={`cursor-pointer ${isSelected ? "bg-gray-100 px-1 rounded" : ""}`}
            onClick={() => setSelectedMenu(menu)}>
            {menu.name}
          </span>

          {/* ACTION */}
          {isSelected && (
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => setIsAdding(true)}
                className="text-blue-700 text-l">
                <FaCirclePlus />
              </button>
              <button onClick={handleDelete} className="text-red-500 text-l">
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ADD CHILD */}
      {isSelected && isAdding && (
        <div className="ml-8 mt-1 flex items-center gap-1">
          <input
            value={newChild}
            onChange={(e) => setNewChild(e.target.value)}
            placeholder="New menu..."
            className="border px-1 text-sm bg-gray-200"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleAddChild()}
          />
          <button onClick={handleAddChild} className="text-blue-600 text-sm">
            Save
          </button>
          <button onClick={handleCancel} className="text-gray-500 text-sm">
            Cancel
          </button>
        </div>
      )}

      {/* CHILDREN */}
      {expanded &&
        menu.children.map((child, idx) => (
          <MenuItem
            key={child.id}
            menu={child}
            refresh={refresh}
            setSelectedMenu={setSelectedMenu}
            selectedMenu={selectedMenu}
            isLast={idx === menu.children.length - 1}
            ancestorLines={[
              ...ancestorLines,
              !isLast, // ancestor line untuk child
            ]}
            expandAll={expandAll}
          />
        ))}
    </div>
  );
};

export default MenuItem;
