import { useEffect, useRef, useState } from "react"
import { BiChevronLeft, BiChevronRight } from "react-icons/bi"
import SearchBox from "~/components/content/SearchBox"
import { useGallery } from "~/context/GalleryContext"
import { useSliderContext } from "~/context/SliderContext"
import { config } from "~/lib/lib"

const heroimgs = [
    {
        img: "images/dubai7star.jpeg"
    },
    {
        img: "https://r4.wallpaperflare.com/wallpaper/791/501/238/new-york-city-buildings-wallpaper-51351344a10dae2b3cd90e3cb71d503d.jpg"
    },
    {
        img: "https://c0.wallpaperflare.com/path/494/492/40/signage-brand-cyan-yellow-5d1465fafe2d1f3e8deff1bbe07c71ce.jpg"
    }
]

type Image = {
    id: number;
    image_url: string;
    alt: string;
};

type MasonryProps = {
    images: Image[];
    listing: any
};

export const ListingCarousel = ({ images, listing }: any) => {
    const [currentSlide, setCurrentSlide] = useState<any>(0)
    const slideStep = useRef(0)
    const counter = useRef(0)
    let slideIncrement = 0

    const handleTouchStart = (e: any) => {
        slideStep.current = e.touches[0].clientX;
    }

    const handleTouchEnd = (e: any) => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = slideStep.current - endX;

        if (deltaX > 50) {
            // swipe left
            setCurrentSlide((i: any) => (i + 1) % images.length);
        } else if (deltaX < -50) {
            // swipe right
            setCurrentSlide((i: any) => (i - 1 + images.length) % images.length);
        }
    };

    const [slides, setSlides] = useState<any | null>(null)

    let timeoutId = useRef<NodeJS.Timeout | null>(null);

    const [items, setItems] = useState<Image[]>([]);
    const slider = useSliderContext()
    const gallery = useGallery()

    const [shortGallery, setShortGallery] = useState<Image[]>([])

    useEffect(() => {
        let shortGallery = [...items]

        if (images) {
            images.map((image: any, index: number) => {
                if (index + 1 < 12) {
                    shortGallery.push(image)
                }

            })

            setShortGallery(shortGallery)
        }
    }, [images])

    const showCarousel = (index: number) => {
        //alert(images.length)
        //slider.setSelectedSlide(1)
        //setOverlay(true)
        if (index < images?.length) {
            slider.setDialog(true)
            slider.setSelectedSlide(index + 1)
            slider.setGallery(images)
            slider.setListing(listing)
        }
    }

    const showGallery = (index: number) => {
        gallery.setShow(true)
        gallery.setGallery(images)
        gallery.setListing(listing)
    }

    useEffect(() => {
        if (images) {
            setSlides(images)
        }
    }, [images])

    const prev = () => {
        setCurrentSlide((currentSlide: any) => {
            return (currentSlide === 0) ? slides.length - 1 : currentSlide - 1
        })
    }

    const next = () => {
        setCurrentSlide((currentSlide: any) => {
            return (currentSlide === slides.length - 1) ? 0 : currentSlide + 1
        })
    }

    const handleNext = async () => {


        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        next();

        timeoutId.current = setTimeout(() => {
            //next();
            //handleNext(); // Continue the loop if needed
        }, 15000);
    }

    const handlePrev = async () => {


        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        prev();

        timeoutId.current = setTimeout(() => {
            //next();
            //handleNext(); // Continue the loop if needed
        }, 15000);
    }

    useEffect(() => {

        const startSlide = async (slides: any) => {
            if (slides !== null) {
                const cnt = slides.length
                for (let i = 0; i < cnt; i++) {
                    timeoutId = await new Promise((resolve) => setTimeout(resolve, 15000));
                    next()
                    if (i == slides.length - 1) {
                        startSlide(slides)
                    }
                }
            }
        }

        /* if (slides) {
            startSlide(slides)
        } */

    }, [slides])

    return (
        <>
            <div className={`relative`}>
                <div className={` w-full h-[300px] md:h-[500px] flex overflow-hidden z-20 `}>
                    {
                        slides?.map((slide: any, index: any) => {

                            return (
                                <img
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                    onMouseDown={(e) => showCarousel(index)}
                                    key={index}
                                    src={config?.IMG_BASE_URL + slide?.image_url}

                                    alt=""
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                    className={`object-cover w-full h-full 
                      block flex-shrink-0 flex-grow-0 transition-transform
                      ease-in-out duration-1000 cursor-pointer`}
                                />
                            )
                        })
                    }
                </div>



                <div className={`z-[300]`}>
                    <button onMouseDown={handlePrev} className={`block absolute top-0 bottom-0 z-[300] p-[1rem] cursor-pointer left-0 group h-full transition duration-1000 ease-in-out`}>
                        <div className={`w-[50px] h-[50px] bg-white/60 rounded-full 
           flex place-content-center place-items-center group-hover:bg-white/30
            z-[300] transition duration-500 ease-in-out`}>
                            <BiChevronLeft className=' stroke-white fill-black w-[2rem] h-[2rem]' />
                        </div>

                    </button>
                    <button onMouseDown={handleNext} className={`block absolute top-0 bottom-0 
                                                        z-[300]    p-[1rem] cursor-pointer right-0 group 
                                                             transition duration-1000 ease-in-out`}>
                        <div className={`w-[50px] h-[50px] bg-white/60 rounded-full 
            flex place-content-center place-items-center group-hover:bg-white/30
            z-[300]   transition duration-500 ease-in-out
            `}>
                            <BiChevronRight className=' stroke-white fill-black w-[2rem] h-[2rem]' />
                        </div>
                    </button>
                </div>

            </div>
        </>
    )
}