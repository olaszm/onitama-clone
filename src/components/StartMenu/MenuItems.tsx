import { Link } from "react-router-dom";

type MenuItem = {
    label: string,
    path: string
}

function renderMenuItem(item: MenuItem) {
    return (
        <Link to={item.path} key={item.path} className="w-full">
            <button className="w-full bg-[#1565C0] text-white px-4 py-2 rounded hover:bg-[#0d47a1] transition-colors">
                {item.label}
            </button>
        </Link>

    )
}

function MenuItems() {
    const menuItems: MenuItem[] = [
        { label: "Start", path: "/play" },
        { label: "Tutorial", path: "/tutorials" },
        { label: "How to play", path: "/how-to" },
        { label: "Card Library", path: "/library" }
    ]


    return (
        <div className="max-w-sm mx-auto">
            <div className="flex flex-col gap-2">
                {menuItems.map(renderMenuItem)}
            </div>
        </div>
    );
}

export default MenuItems;
