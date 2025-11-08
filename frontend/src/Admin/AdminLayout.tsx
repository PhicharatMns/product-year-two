import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebaradmin from "../component/sidebaradmin";
import MessAdmin from "@/component/MessAdmin";

type NotificationItem = {
  time: string;
  job: string;
  name: string;
  Lname: string;
  Description: string;
  title: string;
};

export default function AdminLayout() {
  const [selectedItem, setSelectedItem] = useState<NotificationItem | null>(
    null
  );

  const openMessAdmin = (item: NotificationItem) => setSelectedItem(item);

  return (
    <div className="flex">
      <div className="lg:w-64">
        <Sidebaradmin />
      </div>

      <div className="flex-1 p-6">
        <Outlet context={{ openMessAdmin }} />
      </div>

      {selectedItem && (
        <MessAdmin item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

// เเบบไม่มี ข้อมุล ดึงจาก Notification
// // AdminLayout.tsx
// import { Outlet } from "react-router-dom";
// import { useState } from "react";
// import Sidebaradmin from "../component/sidebaradmin";
// import MessAdmin from "@/component/MessAdmin";

// export default function AdminLayout() {
//   const [isOpen, setIsOpen] = useState(false);

//   const openMessAdmin = () => setIsOpen(true);

//   return (
//     <div className="flex">
//       <div className="lg:w-64">
//         <Sidebaradmin />
//       </div>

//       <div className="flex-1">
//         <Outlet context={{ openMessAdmin }} />
//       </div>

//       {isOpen && <MessAdmin onClose={() => setIsOpen(false)} />}
//     </div>
//   );
// }
