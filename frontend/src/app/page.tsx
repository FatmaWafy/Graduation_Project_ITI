"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='relative h-screen bg-background text-foreground overflow-hidden'>
      {/* Background Image with Overlay */}
      <div
        className='absolute inset-0 bg-cover bg-[top_20%_right] sm:bg-[top_30%_right] md:bg-[top_40%_right] lg:bg-[top_50%_center]  brightness-[0.5]'
        style={{
          backgroundImage: "url('/landing.jpg')",
        }}
      ></div>
      <div className='absolute inset-0 bg-black/20'></div>

      {/* Navbar */}
      <nav className='relative z-20 flex items-center justify-between p-4 sm:p-6'>
        <div className='flex items-center gap-3'>
          <img
            className='w-30 h-16 sm:w-30 sm:h-20'
            src='/logo.png'
            alt='logo'
          />
        </div>

        {/* Burger Menu Icon for Small Screens */}
        <div className='sm:hidden'>
          <button
            onClick={toggleMenu}
            className='text-white focus:outline-none '
          >
            {isMenuOpen ? (
              <X className='w-6 h-6 animate-spin-once   ' />
            ) : (
              <Menu className='w-6 h-6 animate-spin-once  ' />
            )}
          </button>
        </div>

        {/* Menu Items for Larger Screens */}
        <div className='hidden sm:flex sm:gap-4'>
          <Link href='/signin'>
            <Button className='bg-primary  text-white hover:border-transparent hover:text-white/80 font-medium rounded-xl px-4 animate-fade-in duration-500'>
              Login
            </Button>
          </Link>
          <Link href='/signup'>
            <Button className='bg-primary  text-white hover:border-transparent hover:text-white/80 font-medium rounded-xl px-4 animate-fade-in duration-500'>
              Signup
            </Button>
          </Link>
          {/* <Link href='/faq'>
            <Button className='bg-primary  text-white hover:border-transparent hover:text-white/80 font-medium rounded-xl px-4 animate-fade-in duration-500 '>
              FAQ
            </Button>
          </Link> */}
        </div>

        {/* Mobile Menu (Visible when Burger Menu is Open) */}
        <div
          className={`fixed top-0 left-0 right-0 bg-black/0 backdrop-blur-sm flex flex-col items-center py-12 gap-6 transform transition-transform duration-500 ease-in-out sm:hidden z-30 border-b border-white/20 ${
            isMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <button
            onClick={toggleMenu}
            className='absolute top-4 right-4 text-white focus:outline-none'
          >
            <X className='w-6 h-6' />
          </button>
          <Link href='/signin' onClick={toggleMenu}>
            <Button className='bg-transparent border text-white hover:border-transparent hover:text-white/80 font-medium rounded-xl px-4 w-32 text-center'>
              Login
            </Button>
          </Link>
          <Link href='/signup' onClick={toggleMenu}>
            <Button className='bg-transparent border text-white hover:border-transparent hover:text-white/80 font-medium rounded-xl px-4 w-32 text-center'>
              Signup
            </Button>
          </Link>
          {/* <Link href='/faq' onClick={toggleMenu}>
            <Button className='bg-transparent border text-white hover:border-transparent hover:text-white/80 font-medium rounded-xl px-4 w-32 text-center'>
              FAQ
            </Button>
          </Link> */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className='relative z-10 flex flex-col items-center justify-center h-screen text-center px-4 sm:px-6'>
        {/* Main Title and Description */}
        <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up duration-700'>
          ITI Examination System
        </h1>
        <p className='text-base sm:text-lg md:text-xl text-white/90 max-w-lg sm:max-w-2xl mb-8 animate-fade-in-up duration-700 delay-200'>
          People Develop Countries… We Develop{" "}
          <span className='text-primary'>PEOPLE</span>
        </p>

        {/* PEOPLE Values Section */}
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mb-10 animate-fade-in-up duration-700 delay-400'>
          <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm text-center'>
            <h3 className='text-2xl font-bold text-primary'>P</h3>
            <p className='text-sm font-semibold text-white'>Professionalism</p>
            {/* <p className='text-xs text-emerald-100'>
              Deliver excellence in every exam
            </p> */}
          </div>
          <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm text-center'>
            <h3 className='text-2xl font-bold text-primary'>E</h3>
            <p className='text-sm font-semibold text-white'>Elation</p>
            {/* <p className='text-xs text-emerald-100'>
              Celebrate your achievements
            </p> */}
          </div>
          <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm text-center'>
            <h3 className='text-2xl font-bold text-primary'>O</h3>
            <p className='text-sm font-semibold text-white'>Openness</p>
            {/* <p className='text-xs text-emerald-100'>
              Collaborate with confidence
            </p> */}
          </div>
          <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm text-center'>
            <h3 className='text-2xl font-bold text-primary'>P</h3>
            <p className='text-sm font-semibold text-white'>Passion</p>
            {/* <p className='text-xs text-emerald-100'>Learn with enthusiasm</p> */}
          </div>
          <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm text-center'>
            <h3 className='text-2xl font-bold text-primary'>L</h3>
            <p className='text-sm font-semibold text-white'>Loyalty</p>
            {/* <p className='text-xs text-emerald-100'>Stay committed to growth</p> */}
          </div>
          <div className='bg-white/10 p-4 rounded-lg shadow backdrop-blur-sm text-center'>
            <h3 className='text-2xl font-bold text-primary'>E</h3>
            <p className='text-sm font-semibold text-white'>Extra Mile</p>
            {/* <p className='text-xs text-emerald-100'>Exceed your goals</p> */}
          </div>
        </div>

        {/* Call to Action Button */}
        {/* <Link href='/signup'>
          <Button className='bg-transparent border text-white hover:border-transparent hover:text-white/80 font-medium px-4 py-2 sm:py-3 sm:px-6 rounded-xl animate-scale-in duration-700 delay-600'>
            Get Started
          </Button>
        </Link> */}
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes spinOnce {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(90deg);
          }
        }
        .animate-fade-in {
          animation: fadeIn ease-in-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp ease-in-out;
        }
        .animate-scale-in {
          animation: scaleIn ease-in-out;
        }
        .animate-spin-once {
          animation: spinOnce 300ms ease-in-out;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  );
}
