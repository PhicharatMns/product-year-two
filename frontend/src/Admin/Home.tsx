import Sidebar from "../component/sidebar";

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="grid-cols-2 grid gap-10 mx-auto w-fit my-5">
          <div className="border h-120 w-200 rounded-xl flex items-center justify-center text-center relative hover:scale-101 duration-300">
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
              alt=""
              className="absolute w-full h-full object-cover object-center rounded-xl "
            />
            <div className="absolute bg-black/30 rounded-xl"></div>

            <p className="relative text-white font-bold text-xl">สถืติช่าง</p>
          </div>

          <div className=" w-200 grid grid-cols-2 gap-5">
            <div className="border rounded-xl flex items-center justify-center text-center relative hover:scale-101 duration-300">
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                alt=""
                className="absolute w-full h-full object-cover object-center rounded-xl "
              />
              <div className="absolute bg-black/30 rounded-xl"></div>

              <p className="relative text-white font-bold text-xl">
                สร้างใบงานใหม่
              </p>
            </div>

            <div className="border rounded-xl flex items-center justify-center text-center relative hover:scale-101 duration-300">
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                alt=""
                className="absolute w-full h-full object-cover object-center rounded-xl "
              />
              <div className="absolute bg-black/30 rounded-xl"></div>

              <p className="relative text-white font-bold text-xl">
                สรุปสถานะงาน
              </p>
            </div>

            <div className="col-span-2 border p-2 rounded-xl flex items-center justify-center text-center relative hover:scale-101 duration-300">
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                alt=""
                className="absolute w-full h-full object-cover object-center rounded-xl "
              />
              <div className="absolute bg-black/30 rounded-xl"></div>

              <p className="relative text-white font-bold text-xl">
                ค้นหางานย้อนหลัง
              </p>
            </div>
          </div>
        </div>
        {/* //gird 2  */}
        <div className="grid grid-cols-2 gap-10 mx-auto w-fit my-5">
          <div className=" h-100 w-200 grid grid-cols-2 gap-5 rounded-xl">
            <div className="border col-span-2 rounded- flex items-center justify-center text-center relative hover:scale-101 duration-300">
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                alt=""
                className="absolute w-full h-full object-cover object-center rounded-xl "
              />
              <div className="absolute bg-black/30 rounded-xl"></div>

              <p className="relative text-white font-bold text-xl">
                เเจ้งเตือนช่าง
              </p>
            </div>

            <div className="border col-span-2 rounded-xl flex items-center justify-center text-center relative hover:scale-101 duration-300">
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                alt=""
                className="absolute w-full h-full object-cover object-center rounded-xl "
              />
              <div className="absolute bg-black/30 rounded-xl"></div>

              <p className="relative text-white font-bold text-xl">
                จัดการบัญชี
              </p>
            </div>
          </div>

          <div className="border h-100 w-200 rounded-xl flex items-center justify-center text-center relative hover:scale-101 duration-300">
            <img
              src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
              alt=""
              className="absolute w-full h-full object-cover object-center rounded-xl "
            />
            <div className="absolute bg-black/30 rounded-xl"></div>
            <p className="relative text-white font-bold text-xl">
              ดูเเผนที่ช่าง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
