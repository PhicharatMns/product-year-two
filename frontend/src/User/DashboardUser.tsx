import { useTheme } from "@/components/theme-provider"; // import theme hook

export default function DashboardUser () {

    const { theme } = useTheme();

 const bg = theme === "dark" ? "bg-gray-900" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-gray-900";
  const cardBg = theme === "dark" ? "bg-gray-400" : "bg-blue-50/40";
  const border = theme === "dark" ? "border-gray-700" : "border-blue-100";
  const labelText = theme === "dark" ? "text-yellow-300" : "text-blue-700";

    return (
        <div className={`text-5xl font-bold ${text}`}>
            <p>Dashboard</p>
       
        <div className="container max-w-full h-screen border  ">
            
            <div className={`${bg}`}>

            </div>
             </div>
        </div>
    )
}