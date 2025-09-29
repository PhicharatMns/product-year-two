import Sidebaradmin from "../component/sidebaradmin";

export default function Home() {
    return (
        <div className="flex">
            <Sidebaradmin />
            <div className="flex-1">
                <div className='container mx-auto w-340 h-200 my-5'>
                    <div className="grid grid-cols-2 gap-5 ">
                        <div className="border h-50 relative">
                            <img
                                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                alt=""
                                className="absolute w-full h-full object-cover object-center rounded-xl "
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="border relative">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                            </div>
                            <div className="border relative">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                            </div>
                            <div className='col-span-2 border relative'>
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute w-full h-full object-cover object-center rounded-xl "
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 my-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="border col-span-2  relative ">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                                />
                            </div>

                            <div className="border col-span-2 relative w-full">
                                <img
                                    src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                    alt=""
                                    className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="border relative h-100">
                            <img
                                src="https://png.pngtree.com/thumb_back/fh260/background/20250326/pngtree-futuristic-data-dashboard-image_17146904.jpg"
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover object-center rounded-xl"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}