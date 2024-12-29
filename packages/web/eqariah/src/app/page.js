"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import NumberCounter from './component/Numbercaunter';
import Navbar from './component/Navbar';
import gsap from 'gsap';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Footer from './component/footer';

export default function Home() {
    useEffect(() => {
        (
            async () => {
                const LocomotiveScroll = (await import('locomotive-scroll')).default
                const locomotiveScroll = new LocomotiveScroll();
            }
        )()
    }, [])
    const boxref1 = useRef(null);
    useEffect(() => {
        gsap.to(boxref1.curent, { ease: "power1.inOut", duration: 2.5 });
    }, []);
    const clients = [
        { id: 1, src: "/image-removebg-preview.png", name: 'gambar sementara' },
        { id: 2, src: "/image-removebg-preview (1).png", name: 'gambar sementara' },
        { id: 3, src: "/image-removebg-preview (2).png", name: 'gambar sementara' },
        { id: 4, src: "/image-removebg-preview (3).png", name: 'gambar sementara' },
        { id: 5, src: "/image-removebg-preview.png", name: 'gambar sementara' },
        { id: 6, src: "/image-removebg-preview (1).png", name: 'gambar sementara' },
        { id: 7, src: "/image-removebg-preview (2).png", name: 'gambar sementara' },
        { id: 8, src: "/image-removebg-preview (3).png", name: 'gambar sementara' },
        { id: 9, src: "/image-removebg-preview.png", name: 'gambar sementara' },
        { id: 10, src: "/image-removebg-preview (1).png", name: 'gambar sementara' },
        { id: 11, src: "/image-removebg-preview (2).png", name: 'gambar sementara' }
    ]
    const handleButtonClick = () => {
        setSelectedButton();
    };
    const image = ["/masjid1 (2).jpg", "/masjid2.jpg", "/masjid3.jpg"];
    const [isClient, setIsClient] = React.useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <main>
            <Navbar />
            <section >
                <div className="relative w-full mx-auto group">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.swiper-pagination',
                            bulletClass: 'swiper-pagination-bullet',
                            bulletActiveClass: 'swiper-pagination-bullet-active',
                            renderBullet: function (index, className) {
                                return `<span class="${className}"></span>`;
                            },
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="w-full h-auto rounded-lg"
                    >
                        {image.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={image}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </SwiperSlide>
                        ))}

                        {/* Custom Navigation Buttons */}
                        <button className="swiper-button-prev !hidden group-hover:!flex !w-10 !h-10 !bg-black/30 hover:!bg-black/50 !backdrop-blur-sm rounded-full !text-white transition-all duration-300">
                            <span className="sr-only">Previous</span>
                        </button>
                        <button className="swiper-button-next !hidden group-hover:!flex !w-10 !h-10 !bg-black/30 hover:!bg-black/50 !backdrop-blur-sm rounded-full !text-white transition-all duration-300">
                            <span className="sr-only">Next</span>
                        </button>

                        {/* Custom Pagination Dots */}
                        <div className="swiper-pagination !bottom-4"></div>
                    </Swiper>
                </div>
            </section>

            <section className=" p-[10] lg:p-5">
                <h1 ref={boxref1} className="flex justify-center text-center text-[8vw] m-[4%] font-bold md:text-[5vw] lg:text-4xl lg:m-4">Our Client</h1>
                <a className="flex justify-center text-center text-[3.5vw] pb-[4%] md:text-[2.5vw] lg:text-xl lg:pb-4">We have been working with some Fortune 500++ clients</a>
                <div className="flex justify-center items-center p-[4%]  lg:p-5 ">
                    <Swiper
                        spaceBetween={15}
                        slidesPerView={6}
                        onSlideChange={() => console.log('slide change')}
                        onSwiper={(swiper) => console.log(swiper)}
                    >
                        {clients.map((Client) => (
                            <SwiperSlide key={Client.id} className="mx-[8%] md:mx-7">
                                <Image
                                    src={Client.src}
                                    width={50}
                                    height={50}
                                    alt={Client.name}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            <section className="p-[10%] lg:p-5">
                <h1 className="flex text-[8vw] font-bold justify-center text-center md:text-[5vw] lg:text-4xl">Manage your entire community in a single system</h1>
                <a className="flex justify-center p-[4%] md:text-[2.5vw] lg:text-xl lg:p-5">who is Nextcent suitable for?</a>
                <div className="container mx-auto px-[4%] py-[20%] lg:p-4">
                    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-20">
                        <div className="text-center shadow-lg bg-gray-50">
                            <div className="bg-gray-100 rounded-full p-[4%] inline-block m-[4%] lg:p-4">
                                <Image
                                    src="/download (1).jpeg"
                                    width={120}
                                    height={120}
                                    alt="sementara"
                                    className="md:w-32"
                                />
                            </div>
                            <h3 className="text-[4.3vw] font-bold mb-[2%] lg:text-2xl lg:m-4">Membership Organisations</h3>
                            <p className="text-gray-600 text-[3.5vw] m-[4%] md:text-[2.5vw] lg:text-xl lg:m-4">
                                Our membership management software provides full automation of membership renewals and payments
                            </p>
                        </div>

                        <div className="text-center shadow-lg bg-gray-50">
                            <div className="bg-gray-100 rounded-full p-[4%] inline-block m-[4%] lg:p-4">
                                <Image
                                    src="/download (2).jpeg"
                                    width={120}
                                    height={120}
                                    alt="sementara"
                                    className="md:w-32"
                                />
                            </div>
                            <h3 className="text-[4.3vw] font-bold mb-[2%] lg:text-2xl lg:m-4">National Associations</h3>
                            <p className="text-gray-600 text-[3.5vw] m-[4%] md:text-[2.5vw] lg:text-xl lg:m-4">
                                Our membership management software provides full automation of membership renewals and payments
                            </p>
                        </div>

                        <div className="text-center shadow-lg bg-gray-50">
                            <div className="bg-gray-100 rounded-full p-[4%] inline-block m-[4%] lg:p-4">
                                <Image
                                    src="/download (3).jpeg"
                                    width={120}
                                    height={120}
                                    alt="sementara"
                                    className="md:w-32"
                                />
                            </div>
                            <h3 className="text-[4.3vw] font-bold mb-[2%] lg:text-2xl lg:m-4">Clubs And Groups</h3>
                            <p className="text-gray-600 text-[3.5vw] m-[4%] md:text-[2.5vw] lg:text-xl lg:m-4">
                                Our membership management software provides full automation of membership renewals and payments
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col justify-evenly items-center p-[10%] lg:p-20">
                <div className="flex">
                    <Image
                        src="/download (5).jpeg"
                        width={600}
                        height={400}
                        alt="sementara"
                    />
                </div>
                <div>
                    <h1 className="text-[8vw] font-bold pb-[4%] text-center md:text-[5vw] lg:text-4xl">The unseen of spending three years at Pixelgrade</h1>
                    <a className='md:text-[2vw] lg:text-xl'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum facilis tenetur rem aspernatur maxime facere deleniti rerum. Nostrum, iste aliquid eum fuga veniam illum, non voluptatem laborum debitis adipisci magnam incidunt iusto pariatur mollitia quae ullam corporis! Itaque autem atque voluptate unde reiciendis blanditiis, optio eum doloribus tenetur maiores aspernatur culpa ipsa illum odit debitis corporis ratione dolorum sed harum et, libero veniam, porro ab? Quo unde sunt cupiditate et non exercitationem suscipit at molestias magni deleniti a placeat, autem ab illum ipsa laborum sequi eos ratione quibusdam sint. Quasi, libero porro. Sunt nihil maiores eius aut expedita consequatur numquam?</a>
                    <button onClick={handleButtonClick} className="py-[3%] px-[10%] lg:py-3 lg:px-10 bg-[#4CAF4F] text-[3.5vw] md:text-[2vw] md:px-[6%] md:py-[2%] lg:text-2xl mt-[4%] lg:mt-4 rounded-md text-white flex ">learn more</button>
                </div>
            </section>

            <section className='bg-[#f5f7fa] flex flex-col lg:flex-row justify-around items-center p-[10%] lg:p-20'>
                <div className='justify-center'>
                    <h1 className='text-[11vw] md:text-[5vw] lg:text-4xl font-bold'>Helping a local</h1>
                    <h1 className='text-[11vw] md:text-[5vw] lg:text-4xl font-bold text-[#4CAF4F]'>business reinvent itself</h1>
                    <h2 className='text-[4.3vw] md:text-[3vw] lg:text-2xl pt-[4%]'>We reached here with our hard work and dedication</h2>
                </div>
                <div className='flex flex-col lg:grid lg:grid-cols-2 m-[4%] gap-5'>
                    <NumberCounter target="2245341" label="Members" icon="/section5_1.svg" />
                    <NumberCounter target="828867" label="Event Booking" icon="/section5_2.svg" />
                    <NumberCounter target="46328" label="Clubs" icon="/section5_3.svg" />
                    <NumberCounter target="1926436" label="Payment" icon="/section5_4.svg" />
                </div>
            </section>

            <section className=" flex flex-col p-[10%] lg:p-20 justify-evenly items-center">
                <div className="flex mb-[4%]">
                    <Image
                        src="/download (6).jpeg"
                        width={600}
                        height={400}
                        alt="sementara"
                    />
                </div>
                <div>
                    <h1 className="text-[8vw] md:text-[5vw] lg:text-4xl font-bold py-[4%] text-center">How to design your site footer like we did</h1>
                    <a className='md:text-[2vw] lg:text-xl'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias dolorum reiciendis debitis velit qui ea eius, illum fugit libero expedita saepe quas alias iure, corporis, eum earum ratione! Aut non suscipit voluptas est laborum ipsum expedita a, beatae dicta vel esse quo porro eaque, quia ab animi incidunt nobis consequatur neque vero minima id quidem architecto praesentium. Placeat debitis eius laboriosam maxime suscipit doloremque saepe nam vero, nulla aliquid tempore laudantium, repellat ad. Beatae nobis accusamus vel doloribus maiores quidem nostrum doloremque molestiae? Nesciunt tempore id nulla repellendus ducimus molestias sequi sapiente facilis! Similique, dolore fugiat! Ipsum alias modi rerum.
                    </a>
                    <button onClick={handleButtonClick} className="py-[3%] px-[10%] lg:py-3 lg:px-10 bg-[#4CAF4F] text-[3.5vw] md:text-[2vw] md:px-[6%] md:py-[2%] lg:text-2xl mt-[4%] lg:mt-4 rounded-md text-white flex ">learn more</button>
                </div>
            </section>

            <section className="flex flex-col p-[10%] lg:p-20 justify-evenly items-center bg-[#F5F7FA]">
                <div className="flex py-[6%] lg:py-6">
                    <Image
                        src="/image-removebg-preview (5).png"
                        width={600}
                        height={400}
                        alt="sementara"
                    />
                </div>
                <div >
                    <a className='md:text-[2vw] lg:text-xl'>Maecenas dignissim justo eget nulla rutrum molestie. Maecenas lobortis sem dui, vel rutrum risus tincidunt ullamcorper. Proin eu enim metus. Vivamus sed libero ornare, tristique quam in, gravida enim. Nullam ut molestie arcu, at hendrerit elit. Morbi laoreet elit at ligula molestie, nec molestie mi blandit. Suspendisse cursus tellus sed augue ultrices, quis tristique nulla sodales. Suspendisse eget lorem eu turpis vestibulum pretium. Suspendisse potenti. Quisque malesuada enim sapien, vitae placerat ante feugiat eget. Quisque vulputate odio neque, eget efficitur libero condimentum id. Curabitur id nibh id sem dignissim finibus ac sit amet magna.</a>
                    <h1 className='text-[#4CAF4F] py-[3%] lg:py-3'>Tim Smith</h1>
                    <h1 className='text-gray-400'>British Dragon Boat Racing Association</h1>
                    <ul className='flex gap-3 pt-[4%] lg:pt-4'>
                        <li><Image src="/image-removebg-preview.png" alt='customer' width={33} height={33} /></li>
                        <li><Image src="/image-removebg-preview (1).png" alt='customer' width={33} height={33} /></li>
                        <li><Image src="/image-removebg-preview (2).png" alt='customer' width={33} height={33} /></li>
                        <li><Image src="/image-removebg-preview (3).png" alt='customer' width={33} height={33} /></li>
                        <li><Image src="/image-removebg-preview.png" alt='customer' width={33} height={33} /></li>
                        <li className='text-[#4ACF4F]'>Meet all customer →</li>
                    </ul>
                </div>
            </section>

            <section className='p-[10%] lg:p-20 pb-[20%] lg:pb-40'>
                <div>
                    <h1 className='flex justify-center text-[8vw] md:text-[5vw] lg:text-4xl font-bold'>Caring is the new marketing</h1>
                    <a className='flex text-center justify-center md:text-[2vw] lg:text-xl lg:pt-4'>The Nextcent is the best place to read about the lastest membership insght, trends and more. See who's joining the community, read about how our community are increasing their membership income and lot's more</a>
                </div>
                <div className='flex flex-col lg:flex-row p-[10%] lg:p-10 justify-around items-center text-center gap-40 lg:gap-20'>
                    <div className='relative rounded-md shadow-md p-[4%] '>
                        <Image
                            src='/image-removebg-preview.png'
                            alt='sementara'
                            width={330}
                            height={200}
                        />
                        <div className='bg-[#f5f7fa] shadow-md absolute w-[90%] -bottom-[20%] left-0 right-0 mx-auto text-[3.5vw]  md:text-[2.5vw] lg:text-xl '>
                            <h1 className='pt-[4%]' >Creating streamlined safeguarding Processes with OneRen</h1>
                            <h1 className='py-[4%]'>Readmore →</h1>
                        </div>
                    </div>
                    <div className='relative rounded-md shadow-md p-[4%] '>
                        <Image
                            src='/image-removebg-preview (1).png'
                            alt='sementara'
                            width={330}
                            height={200}
                        />
                        <div className='bg-[#f5f7fa] shadow-md absolute w-[90%] -bottom-[20%] left-0 right-0 mx-auto text-[3.5vw]  md:text-[2.5vw] lg:text-xl '>
                            <h1 className='pt-[4%]' >Creating streamlined safeguarding Processes with OneRen</h1>
                            <h1 className='py-[4%]'>Readmore →</h1>
                        </div>
                    </div>
                    <div className='relative rounded-md shadow-md p-[4%] '>
                        <Image
                            src='/image-removebg-preview (2).png'
                            alt='sementara'
                            width={330}
                            height={200}
                        />
                        <div className='bg-[#f5f7fa] shadow-md absolute w-[90%] -bottom-[20%] left-0 right-0 mx-auto text-[3.5vw]  md:text-[2.5vw] lg:text-xl '>
                            <h1 className='pt-[4%]' >Creating streamlined safeguarding Processes with OneRen</h1>
                            <h1 className='py-[4%]'>Readmore →</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className='flex items-center justify-center bg-[#f5f7fa] p-[10%]'>
                <div className='text-center'>
                    <h1 className='mb-[4%] text-[11vw] lg:text-5xl lg:mb-4 font-extrabold'>Pellentesque suscipit fringilla libero eu.</h1>
                    <button onClick={handleButtonClick} className="py-[6%] px-[8%] md:py-[3%] md:px-[4%] lg:py-6 lg:px-10 bg-[#4CAF4F] text-[4.3vw] md:text-[3.8vw] lg:text-2xl mt-2 rounded-md text-white ">Get a Demo →</button>
                </div>
            </section>
            <Footer />
        </main >
    );
}