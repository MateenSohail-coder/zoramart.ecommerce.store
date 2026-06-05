"use client";

import {
  ProgressSlider,
  SliderBtn,
  SliderBtnGroup,
  SliderContent,
  SliderWrapper,
} from "../ui/progressive-carousel";
import Image from "next/image";

const items = [
  {
    img: "https://img.lazcdn.com/us/domino/8c59ed80-afb4-48c9-b1d2-11766f1be63e_PK-1976-688.jpg_2200x2200q80.jpg_.avif",
    title: "Autumn",
    desc: "A picturesque path winding through a dense forest adorned with vibrant autumn foliage.",
    sliderName: "autumn",
  },
  {
    img: "https://img.lazcdn.com/us/domino/53d06a17-a79e-42df-8545-b22e1dada10a_PK-1976-688.jpg_2200x2200q80.jpg_.avif",
    title: "Bridge",
    desc: "A breathtaking view of a city illuminated by countless lights, showcasing the vibrant and bustling nightlife.",
    sliderName: "bridge",
  },
  {
    img: "https://img.lazcdn.com/us/domino/cd3d3612-43ee-47da-b49a-ff03d87ffcb8_PK-1976-688.jpg_2200x2200q80.jpg_.avif",
    title: "Mountains View",
    desc: "A serene lake reflecting the surrounding mountains and trees, creating a mirror-like surface.",
    sliderName: "mountains",
  },
  {
    img: "https://img.lazcdn.com/us/domino/8c2b123f-d24e-44d0-8604-297b686a1526_PK-1976-688.jpg_2200x2200q80.jpg_.avif",
    title: "Foggy",
    sliderName: "foggy",
    desc: "A stunning foggy view over the foresh, with the sun casting a golden glow across the forest",
  },
];

export default function HeroSection() {
  return (
    <div className="border-b-8 border-b-[#ff6f00]">
      <ProgressSlider vertical={false} activeSlider="bridge">
        <SliderContent>
          {items.map((item) => (
            <SliderWrapper
              key={item.sliderName}
              value={item.sliderName}
              className="relative w-full  overflow-hidden bg-black/5"
            >
              {/* Mobile-h stacked layout: image first, then buttons below */}
              <div className="flex flex-col md:flex-row">
                {/* Image block */}
                <div className="relative w-full md:w-auto md:flex-1">
                  <div className="relative w-full h-[150px] sm:h-[200px] md:h-[300px] lg:h-[380px] xl:h-[440px]">
                    <Image
                      src={item.img}
                      alt={item.desc}
                      fill
                      priority={item.sliderName === "bridge"}
                      sizes="100vw"
                      className="object-contain  bg-black/5"
                    />
                  </div>
                </div>

                {/* Buttons block: below image on mobile, overlaid on md+ */}
                <SliderBtnGroup
                  className={`
                    md:absolute md:bottom-0 md:left-0 md:right-0 
                    md:z-10 md:bg-transparent md:backdrop-blur-none md:grid md:grid-cols-4
                    grid grid-cols-2 h-fit overflow-hidden cursor-pointer
                    bg-white/70 dark:bg-back/40 text-black dark:text-white
                    md:rounded-none rounded-none 
                  `}
                >
                  {items.map((btnItem) => (
                    <SliderBtn
                      key={btnItem.sliderName}
                      value={btnItem.sliderName}
                      className="text-left p-3 sm:p-4 md:p-5 border-r border-black/10 dark:border-white/10 transition-colors duration-300 data-[active=true]:bg-[#ff6f00] data-[active=true]:text-white"
                      progressBarClass="bg-[#ff6f00] h-full"
                    >
                      <h2 className="relative font-extrabold px-3 py-1 rounded-full w-fit text-[#ff6f00] bg-white mb-2 text-sm sm:text-base">
                        {btnItem.title}
                      </h2>
                      <p className="text-xs sm:text-sm font-medium line-clamp-2">
                        {btnItem.desc}
                      </p>
                    </SliderBtn>
                  ))}
                </SliderBtnGroup>
              </div>
            </SliderWrapper>
          ))}
        </SliderContent>
      </ProgressSlider>
    </div>
  );
}
