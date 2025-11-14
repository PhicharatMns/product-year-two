import { useTheme } from "@/components/theme-provider";
import { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import type { ReactNode } from "react";

// *** แก้ไข: เพิ่มไอคอนสำหรับ Stat Cards ***
import { 
  Search, 
  Plus, 
  X, 
  Minus,
  Package,        // New
  Warehouse,      // New
  Shapes,         // New
  TriangleAlert   // New
} from "lucide-react";

// --- Types ---
export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  lastRestock: string;
};
type ColorName = "green" | "blue" | "purple" | "gray" | "yellow" | "red" | "indigo" | "pink";
type CategorySummary = {
  category: string;
  totalStock: number;
};

// --- Mock Data ---
const initialInventoryItems: InventoryItem[] = [
  { id: "A001", name: "สายเคเบิล VAF 2x2.5", category: "ไฟฟ้า", stock: 80, unit: "เมตร", lastRestock: "01/10/68" },
  { id: "A002", name: "หลอดไฟ LED 12W", category: "ไฟฟ้า", stock: 150, unit: "หลอด", lastRestock: "03/10/68" },
  // ... (ข้อมูล mock data อื่นๆ เหมือนเดิม) ...
  { id: "B001", name: "ท่อ PVC 1/2\"", category: "ประปา", stock: 45, unit: "เส้น", lastRestock: "05/10/68" },
  { id: "B002", name: "ก๊อกน้ำ", category: "ประปา", stock: 15, unit: "อัน", lastRestock: "01/10/68" },
  { id: "C001", name: "ไขควงชุด", category: "เครื่องมือ", stock: 20, unit: "ชุด", lastRestock: "07/10/68" },
  { id: "C002", name: "สว่านไฟฟ้า", category: "เครื่องมือ", stock: 5, unit: "เครื่อง", lastRestock: "08/10/68" }, // <-- ใกล้หมด
  { id: "D001", name: "สีทาภายใน (ขาว)", category: "สี/เคมีภัณฑ์", stock: 30, unit: "แกลลอน", lastRestock: "10/10/68" },
  { id: "E001", name: "ปูนซีเมนต์", category: "โครงสร้าง", stock: 10, unit: "ถุง", lastRestock: "11/10/68" },
  { id: "F001", name: "ท่อทองแดง", category: "เครื่องปรับอากาศ", stock: 60, unit: "เมตร", lastRestock: "12/10/68" },
  { id: "G001", name: "น็อต/สกรู", category: "ทั่วไป", stock: 500, unit: "ตัว", lastRestock: "13/10/68" },
  { id: "A003", name: "เบรกเกอร์", category: "ไฟฟ้า", stock: 30, unit: "ตัว", lastRestock: "14/10/68" },
  { id: "B003", name: "เทปพันเกลียว", category: "ประปา", stock: 100, unit: "ม้วน", lastRestock: "15/10/68" },
  { id: "C003", name: "ค้อน", category: "เครื่องมือ", stock: 15, unit: "อัน", lastRestock: "16/10/68" },
];


// --- Helper Components ---

// 1. Badge (เหมือนเดิม)
type BadgeProps = { children: ReactNode; color?: ColorName; };
const Badge = ({ children, color = "gray" }: BadgeProps) => {
  const { theme } = useTheme();
  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  }[color];
  return (
    <span className={`inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium ${colorClasses}`}>
      {children}
    </span>
  );
};

// 2. colorMap (เหมือนเดิม)
const colorMap: Record<ColorName, { light: string, dark: string }> = {
  blue: { light: "bg-blue-600", dark: "bg-blue-500" },
  green: { light: "bg-green-600", dark: "bg-green-500" },
  purple: { light: "bg-purple-600", dark: "bg-purple-500" },
  yellow: { light: "bg-yellow-500", dark: "bg-yellow-400" },
  red: { light: "bg-red-600", dark: "bg-red-500" },
  indigo: { light: "bg-indigo-600", dark: "bg-indigo-500" },
  pink: { light: "bg-pink-600", dark: "bg-pink-500" },
  gray: { light: "bg-gray-600", dark: "bg-gray-500" },
};

// 3. OverallGithubBar (แก้ไขตามคำขอ)
type OverallGithubBarProps = {
  summaryData: CategorySummary[];
  getCategoryColor: (category: string) => ColorName;
  theme: string | undefined;
};
const OverallGithubBar = ({ summaryData, getCategoryColor, theme }: OverallGithubBarProps) => {
  const grandTotalStock = summaryData.reduce((sum, cat) => sum + cat.totalStock, 0);
  const categoryCount = summaryData.length;
  if (grandTotalStock === 0 || categoryCount === 0) return null;

  return (
    // หมายเหตุ: ลบ p-4 ด้านนอกสุดออก เพราะการ์ดแม่จะมี padding ให้
    <div className="h-110">
      {/* *** นี่คือจุดที่แก้ไข *** */}
      <h3 className="text-md font-semibold mb-2">ภาพรวมข้อความจากช่าง</h3>
      <div className=" items-center gap-4 mb-3">
        <span className={`text-sm flex-shrink-0 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {categoryCount} หมวดหมู่
        </span>
        <div className="flex w-full h-3 rounded-full overflow-hidden">
          {summaryData.map((summary, index) => {
            const percentage = (summary.totalStock / grandTotalStock) * 100;
            const colorName = getCategoryColor(summary.category);
            const bgColor = theme === "dark" ? colorMap[colorName].dark : colorMap[colorName].light;
            return (
              <div
                key={index}
                className={`${bgColor} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
                title={`${summary.category}: ${summary.totalStock} ชิ้น (${percentage.toFixed(1)}%)`}
              ></div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1 gap-x-4 gap-y-2 text-sm">
        {summaryData.map((summary, index) => {
          const colorName = getCategoryColor(summary.category);
          const bgColor = theme === "dark" ? colorMap[colorName].dark : colorMap[colorName].light;
          const percentage = (summary.totalStock / grandTotalStock) * 100;
          return (
            <div key={index} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${bgColor}`}></span>
              <span className="font-medium">{summary.category}</span>
              <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. AddItemForm (แก้ไข)
type AddItemFormProps = {
  categories: string[];
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  newItem: { id: string; name: string; category: string; stock: string; unit: string; };
  onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  theme: string | undefined;
}
const AddItemForm = ({
  categories,
  onSubmit,
  onCancel,
  newItem,
  onFormChange,
  theme
}: AddItemFormProps) => {
  const inputClass = `w-full px-3 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-yellow-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'} border focus:outline-none focus:ring-2`;
  const labelClass = `block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;
  return (
    <form onSubmit={onSubmit} className="p-6 z-10  ">
      <h3 className="text-lg text-black font-semibold mb-4">เพิ่มวัสดุใหม่</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <div>
          <label htmlFor="id" className={labelClass}>รหัสวัสดุ (ID)</label>
          <input type="text" id="id" name="id" value={newItem.id} onChange={onFormChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="name" className={labelClass}>ชื่อวัสดุ</label>
          <input type="text" id="name" name="name" value={newItem.name} onChange={onFormChange} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>หมวดหมู่</label>
          <select id="category" name="category" value={newItem.category} onChange={onFormChange} className={inputClass}>
            {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="stock" className={labelClass}>จำนวน (Stock)</label>
          <input type="number" id="stock" name="stock" min="0" value={newItem.stock} onChange={onFormChange} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="unit" className={labelClass}>หน่วยนับ (เช่น, เมตร, อัน, หลอด)</label>
          <input type="text" id="unit" name="unit" value={newItem.unit} onChange={onFormChange} className={inputClass} required />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-md text-sm font-medium ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-md transition-colors ${theme === 'dark' ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        > 
          {/* ^^^ นี่คือจุดที่แก้ไข: ลบ '... 17 lines skipped ...' ออกไปแล้ว ^^^ */}
          <Plus size={16} />
          เพิ่มวัสดุ
        </button>
      </div>
    </form>
  );
};


// 5. AddItemModal (เหมือนเดิม)
type AddItemModalProps = AddItemFormProps & {
  isOpen: boolean;
}
const AddItemModal = ({ 
  isOpen, 
  onCancel, 
  theme,
  ...formProps 
}: AddItemModalProps) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);
  if (!isOpen && !show) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center backdrop-blur-sm bg-black/40 justify-center p-4 transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }  backdrop-blur-sm`}
      onClick={onCancel} 
    >
      <div
        className={`relative w-full max-w-2xl rounded-lg shadow-xl transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          type="button"
          onClick={onCancel}
          className={`absolute top-3 right-3 p-1 rounded-full ${
            theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
          } transition-colors`}
        >
          <X size={20} />
        </button>
        <AddItemForm
          theme={theme}
          onCancel={onCancel}
          {...formProps} 
        />
      </div>
    </div>
  );
}


// 6. RequisitionModal (เหมือนเดิม)
type RequisitionModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (e: FormEvent) => void;
  item: InventoryItem | null; 
  theme: string | undefined;
  quantity: string; 
  onQuantityChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const RequisitionModal = ({ 
  isOpen, 
  onCancel, 
  onSubmit, 
  item, 
  theme, 
  quantity, 
  onQuantityChange 
}: RequisitionModalProps) => {

  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  const inputClass = `w-full px-3 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white focus:ring-yellow-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'} border focus:outline-none focus:ring-2`;
  const labelClass = `block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }  backdrop-blur-sm`}
      onClick={onCancel} 
    >
      <div
        className={`relative w-full max-w-lg rounded-lg shadow-xl transition-all duration-300 ${
          show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        } ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          type="button"
          onClick={onCancel}
          className={`absolute top-3 right-3 p-1 rounded-full ${
            theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
          } transition-colors`}
        >
          <X size={20} />
        </button>
        
        <form onSubmit={onSubmit} className="p-6">
          <h3 className="text-lg font-semibold mb-4">เบิกวัสดุ</h3>
          
          {item && (
            <div className={`mb-4 p-3 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <p className="font-medium text-lg">{item.name}</p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>ID: {item.id}</p>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                มีในสต็อก: <span className={`font-bold text-lg ${theme === 'dark' ? 'text-yellow-400' : 'text-blue-600'}`}>{item.stock}</span> {item.unit}
              </p>
            </div>
          )}
          
          <div>
            <label htmlFor="quantity" className={labelClass}>จำนวนที่ต้องการเบิก</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max={item?.stock} 
              value={quantity}
              onChange={onQuantityChange}
              className={inputClass}
              required
              autoFocus 
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 py-2 rounded-md text-sm font-medium ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-md transition-colors ${theme === 'dark' ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              <Minus size={16} />
    _         ยืนยันการเบิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// *** 7. StatCard Component (ใหม่) ***
type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorClass: string; // เช่น "text-blue-500"
  theme: string | undefined;
}

const StatCard = ({ title, value, icon, colorClass, theme }: StatCardProps) => {
  const bg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";

  return (
    // กรอบข้อ ข้อมูลกล่องๆ
 <div className={`flex items-center w-full p-4 rounded-lg shadow-sm border ${bg} ${border}`}>
  <div className={`p-3 rounded-full ${colorClass} bg-opacity-10 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
    {icon}
  </div>
  <div className="ml-4">
    <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
      {title}
    </p>
    <p className={`text-2xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      {value}
    </p>
    
  </div>
</div>

);
}


// --- Main Component (ปรับปรุงใหม่) ---

export default function InventoryDashboard() {
  // --- Hooks & Context ---
  const { theme } = useTheme();

  // --- State (เหมือนเดิม) ---
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [fade, setFade] = useState(false);
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [Focused, setFocused] = useState(false);
  const [tabFade, setTabFade] = useState(true);
  const tabAnimationTimeout = useRef<number | null>(null);

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    id: "", name: "", category: "ไฟฟ้า", stock: "0", unit: ""
  });

  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [withdrawQuantity, setWithdrawQuantity] = useState("1");


  // --- Theme Styles ---
  const pageBg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-300";
  const titleText = theme === "dark" ? "text-white" : "text-gray-900";
  const border = theme === "dark" ? "border-gray-700" : "border-gray-200";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";

  // --- Effects (เหมือนเดิม) ---
  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 50);
    return () => {
      clearTimeout(timer);
      if (tabAnimationTimeout.current) {
        clearTimeout(tabAnimationTimeout.current);
      }
    };
  }, []);

  // --- Derived Data & Logic ---
  const categories = [...new Set(inventoryItems.map((item) => item.category))];
  const tabs = ["ทั้งหมด", ...categories];

  const overallStockSummary: CategorySummary[] = categories.map(category => {
    const itemsInCategory = inventoryItems.filter(item => item.category === category);
    const totalStock = itemsInCategory.reduce((sum, item) => sum + item.stock, 0);
    return { category, totalStock };
  });

  const filteredItems = inventoryItems
    .filter((item) => (activeTab === "ทั้งหมด" ? true : item.category === activeTab))
    .filter((item) => {
      if (search === "") return true;
      const searchTerm = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.id.toLowerCase().includes(searchTerm) ||
        item.unit.toLowerCase().includes(searchTerm)
      );
    });

  // *** (ใหม่) คำนวณข้อมูลสำหรับ Stat Cards ***
  const totalUniqueItems = inventoryItems.length;
  const totalStockCount = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const categoryCount = categories.length;
  // (สมมติว่า "ใกล้หมด" คือน้อยกว่าหรือเท่ากับ 10)
  const lowStockItemsCount = inventoryItems.filter(item => item.stock <= 10).length;

  const stats = [
  
     { 
      title: "รายการทั้งหมด", 
      value: totalUniqueItems, 
      icon: <Warehouse size={24} />, 
      colorClass: theme === 'dark' ? "text-blue-400" : "text-blue-600" 
      
    },
    { 
      title: "หมวดหมู่", 
      value: categoryCount, 
      icon: <Shapes size={24} />, 
      colorClass: theme === 'dark' ? "text-purple-400" : "text-purple-600" 
      
    },
      { 
      title: "ใกล้หมด", 
      value: lowStockItemsCount, 
      icon: <TriangleAlert size={24} />, 
      colorClass: theme === 'dark' ? "text-red-400" : "text-red-600" 
      
    },
    
  ];

  // --- Handlers (เหมือนเดิม) ---

  // 1. Helper สี
  const getCategoryColor = (category: string): ColorName => {
    switch (category) {
      case "ไฟฟ้า": return "blue";
      case "ประปา": return "green";
      case "เครื่องมือ": return "purple";
      case "สี/เคมีภัณฑ์": return "yellow";
      case "โครงสร้าง": return "red";
      case "เครื่องปรับอากาศ": return "indigo";
      case "ทั่วไป": return "pink";
      default: return "gray";
    }
  };

  // 2. Tab Click
  const handleTabClick = (tabName: string) => {
    if (tabName === activeTab || !fade) return;
    if (tabAnimationTimeout.current) clearTimeout(tabAnimationTimeout.current);
    setTabFade(false);
    tabAnimationTimeout.current = setTimeout(() => {
      setActiveTab(tabName);
      setTabFade(true);
    }, 300);
  };

  // 3. Handlers "เพิ่มของ"
  const handleShowAddForm = () => {
    setIsAddingItem(true);
    setNewItem(prev => ({ ...prev, category: categories[0] || "ทั่วไป" }));
  };
  const handleCancelAdd = () => {
    setIsAddingItem(false);
    setTimeout(() => {
      setNewItem({ id: "", name: "", category: categories[0] || "ทั่วไป", stock: "0", unit: "" });
    }, 300);
  };
  const handleFormInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmitAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.unit || !newItem.id) {
      // ใช้ Alert ชั่วคราว (ตามโค้ดเดิม)
      alert("กรุณากรอกข้อมูลให้ครบ (ID, ชื่อ, หน่วย)");
      return;
    }
    const itemToAdd: InventoryItem = {
      id: newItem.id,
      name: newItem.name,
      category: newItem.category,
      stock: parseInt(newItem.stock, 10) || 0,
      unit: newItem.unit,
      lastRestock: new Date().toLocaleDateString("th-TH"),
    };
    setInventoryItems(prevItems => [itemToAdd, ...prevItems]);
    handleCancelAdd();
  };

  // 4. Handlers "เบิกของ"
  const handleShowWithdrawModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setWithdrawQuantity("1");
    setIsWithdrawing(true);
  };

  const handleCancelWithdraw = () => {
    setIsWithdrawing(false);
    setSelectedItem(null);
    setWithdrawQuantity("1");
  };

  const handleSubmitWithdraw = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const quantity = parseInt(withdrawQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert("กรุณาใส่จำนวนที่ถูกต้อง (มากกว่า 0)");
      return;
    }

    if (quantity > selectedItem.stock) {
      alert(`เบิกเกินจำนวนที่มี! (มีอยู่ ${selectedItem.stock} ${selectedItem.unit})`);
      return;
    }

    setInventoryItems(prevItems =>
      prevItems.map(item =>
        item.id === selectedItem.id
          ? { ...item, stock: item.stock - quantity } 
          : item
      )
    );
    handleCancelWithdraw(); 
  };


  // --- JSX Return (ออกแบบใหม่) ---
  return (
    <div className={`transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"} ${pageBg} ${text} min-h-screen`}>
      <div className={` max-w-380 h-screen transition-opacity duration-300 p-5 mx-auto container`}>
        
        {/* 1. Header */}
        <div className="mb-6">
          <h1 className={`text-3xl font-bold ${titleText}`}>
            คลังวัสดุและอุปกรณ์
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            ภาพรวมและจัดการสต็อกวัสดุทั้งหมด
          </p>
        </div>

        {/* 2. Stat Cards (KPIs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((stat) => (
            <StatCard 
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              colorClass={stat.colorClass}
              theme={theme}
            />
          ))}
        </div>

        {/* 3. Main Content (2-Column Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 3.1 Left Column (Main Table) */}
          <div className={`lg:col-span-2  ${cardBg} border ${border} rounded-lg shadow-sm`}>
            {/* Card Header: Search + Tabs */}
            <div className={`p-5 border-b ${border}`}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search Bar */}
               
                {/* Tabs */}
                <div className={`flex items-center  pb-2 md:pb-0`}>
                  {tabs.map((tabName) => {
                    const isActive = activeTab === tabName;
                    const activeClasses = theme === "dark" ? "bg-yellow-500 text-gray-900" : "bg-blue-600 text-white";
                    const inactiveClasses = theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
                    return (
                      <button
                        type="button"
                        key={tabName}
                        onClick={() => handleTabClick(tabName)}
                        className={`py-1.5 px-4 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses} ml-2 first:ml-0`}
                      >
                        {tabName}
                      </button>
                    );
                  })}
                </div>
 <div className="relative  w-50">
                    <Search
                      className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                    />
                    <input
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      placeholder="ค้นหา"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className={`pl-10 pr-3 py-2 rounded-md transition-all duration-300 w-full md:w-50
                       ${theme === "dark" ? "bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 border border-gray-600" : "bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"}`}
                    />
                </div>
              </div>
            </div>
            
              {/* Table Container */}
                <div className={`block w-full overflow-x-auto overflow-y-auto max-h-130 transition-opacity duration-300 ${tabFade ? "opacity-100" : "opacity-0"}`}>
                  <table className="w-full text-left">
                    <thead className={`sticky top-0 z-10 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                      <tr>
                        <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>วัสดุ / รหัส</th>
                        <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>หมวดหมู่</th>
                        <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>คงคลัง</th>
                        <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>หน่วย</th>
                        <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}>อัปเดตล่าสุด</th>
                        <th className={`p-4 text-xs font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} uppercase`}></th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${border}`}>
                      {filteredItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`transition-colors ${hoverBg}`}
                _         >
                          <td className="p-4 whitespace-nowrap">
                            <p className="font-medium">{item.name}</p>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>ID: {item.id}</p>
                          </td>
                          <td className="p-4 whitespace-nowrap"><Badge color={getCategoryColor(item.category)}>{item.category}</Badge></td>
                          <td className="p-4 whitespace-nowrap">
                              <span className={`font-medium ${item.stock <= 10 ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600') : ''}`}>
                                {item.stock}
                              </span>
                          </td>
                          <td className="p-4 whitespace-nowrap"><p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.unit}</p></td>
                        <td className="p-4 whitespace-nowrap"><p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{item.lastRestock}</p></td>
                          
                          {/* *** ปุ่ม "เบิก" ดีไซน์ใหม่ *** */}
                          <td className="p-4 whitespace-nowrap text-right">
{/*                             <button
                              type="button"
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                handleShowWithdrawModal(item);
                              }}
                              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors
                                ${ theme === 'dark' 
                                  ? 'bg-yellow-800 text-yellow-300 hover:bg-yellow-700' 
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              title="เบิกของ"
                            >
                              <Minus size={14} />
                              เบิก
                            </button> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredItems.length === 0 && (
                    <div className="p-10 text-center text-gray-500">
                      <p>{search ? `ไม่พบผลลัพธ์สำหรับ "${search}"` : `ไม่มีข้อมูลในหมวดหมู่ "${activeTab}"`}</p>
                    </div>
                  )}
                </div>
          </div>
          
          {/* 3.2 Right Column (Sidebar) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Quick Actions Card */}
            <div className={`${cardBg} border  ${border} rounded-lg shadow-sm p-4`}>
              <h3 className="text-md  text-black font-semibold mb-3">ดำเนินการด่วน</h3>
              <button
                    type="button"
                    onClick={handleShowAddForm}
                    className={`flex  w-full items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                      ${theme === "dark" ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}
                  >
                    <Plus size={16} />
                    เพิ่มวัสดุใหม่
                  </button>
            </div>

            {/* Stock Summary Card */}
            <div className={`${cardBg}  border ${border} rounded-lg shadow-sm p-4`}>
              <OverallGithubBar
                    summaryData={overallStockSummary}
                    getCategoryColor={getCategoryColor}
                    theme={theme}
                  />
            </div>
          </div>
        </div>
      </div>
      
      
      {/* --- Modals (เหมือนเดิม) --- */}
      <AddItemModal
        isOpen={isAddingItem}
        onCancel={handleCancelAdd}
        theme={theme}
        categories={categories}
        onSubmit={handleSubmitAdd}
        newItem={newItem}
        onFormChange={handleFormInputChange}
      />
    </div>
  );
}