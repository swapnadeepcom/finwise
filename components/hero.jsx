"use client"

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";

const HeroSection = () => {
    const imageRef = useRef();
    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll=()=>{
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;

            if(scrollPosition>scrollThreshold){
                imageElement.classList.add("scrolled");
            }else{
                imageElement.classList.remove("scrolled");
            }
        }

        window.addEventListener("scroll",handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [])

    return (
        <div className="pb-20 px-4">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl md:text-8xl lg:text-[75px] pb-6 gradient-title font-bold drop-shadow-[3px_3px_0px_rgba(0,0,0,0.3)]">
                    Take Control of Your Finances <br /> with Smart Insights
                </h1>
                <p className="text-xl text-gray-700 mb-8 font-semibold max-w-2xl mx-auto">
                    A cutting-edge AI-powered financial platform
                    designed to monitor, analyze, and enhance your spending with real-time intelligence.
                </p>
                <div>
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">
                            Get Started
                        </Button>
                    </Link>
                </div>
                <div className="hero-image-wrapper">
                    <div ref={imageRef} className="hero-image">
                        <Image src='/Banner.png' width={1280} height={720} alt="Dashboard Preview" className="rounded-lg shadow-2xl border mx-auto" priority/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;