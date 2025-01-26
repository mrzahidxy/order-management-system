import { Link } from "lucide-react";
import { FiBell, FiEdit2, FiX } from "react-icons/fi";

interface props {
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ setShowSidebar }: props) {
  return (
    <div className="absolute top-0 right-0 bg-gray-100 min-h-screen z-50 w-1/2">
      {/* <button
        className="block md:hidden border-b-2 w-full p-2"
        onClick={() => setShowSidebar((prevShowSidebar) => !prevShowSidebar)}
      >
        <FiX />
      </button> */}
      <div className="mt-2 space-y-2 pl-2">
        <div className="flex flex-row items-center gap-4">
          <Link href="/" className="text-2xl w-6">
            <FiBell />
          </Link>
          <span className="text-lg font-semibold">Alerts</span>
        </div>

        <div className="flex flex-row items-center gap-4">
          <Link href="/review" className="text-2xl w-6">
            <FiEdit2 />
          </Link>
          <span className="text-lg font-semibold">Review</span>
        </div>

        <div
          className="flex flex-row items-center gap-4"
          //   onClick={handleDropdownClick}
        >
          <img
            src="https://fakeimg.pl/200/"
            className="w-6 h-6 rounded-full cursor-pointer"
          />
          <span className="text-lg font-semibold">Profile</span>
        </div>
      </div>
    </div>
  );
}
