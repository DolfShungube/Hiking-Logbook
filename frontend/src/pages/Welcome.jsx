import React, { useState, useEffect } from 'react';
import logo from '/src/assets/logo.png';
import image from '/src/assets/about.png';
import map from '/src/assets/map.png';
import mountain from '/src/assets/mountain.png';
import location from '/src/assets/location.png';
import trophy from '/src/assets/trophy.png';
import hiking from '/src/assets/hiking.jpg';

// Trails - Table Mountain
import T1 from '/src/assets/trails/T1.png';
import T2 from '/src/assets/trails/T2.jpg';
import T3 from '/src/assets/trails/T3.jpg';
import T4 from '/src/assets/trails/T4.png';
import T5 from '/src/assets/trails/T5.jpg';
import T6 from '/src/assets/trails/T6.jpg';

// Trails - Whale
import Whale1 from '/src/assets/trails/Whale1.jpg';
import Whale2 from '/src/assets/trails/Whale2.jpg';
import Whale3 from '/src/assets/trails/Whale3.jpg';
import Whale4 from '/src/assets/trails/Whale4.jpg';
import Whale5 from '/src/assets/trails/Whale5.jpg';
import Whale6 from '/src/assets/trails/Whale6.jpg';

// Trails - Drakensberg
import Dr1 from '/src/assets/trails/Dr1.jpg';
import Dr2 from '/src/assets/trails/Dr2.jpg';
import Dr3 from '/src/assets/trails/Dr3.jpg';
import Dr4 from '/src/assets/trails/Dr4.png';
import Dr5 from '/src/assets/trails/Dr5.png';
import Dr6 from '/src/assets/trails/Dr6.png';

// Trails - Rim of Africa
import Africa1 from '/src/assets/trails/Africa1.jpg';
import Africa2 from '/src/assets/trails/Africa2.jpg';
import Africa3 from '/src/assets/trails/Africa3.jpg';

import useScrollAnimation from '/src/components/useScrollAnimation.jsx';
import {Link} from "react-router-dom";

const Welcome = () => {
  // Create multiple refs/hooks for different image groups:
  const [refTable1, visibleTable1] = useScrollAnimation();
  const [refWhale1, visibleWhale1] = useScrollAnimation();
  const [refDrakensberg1, visibleDrakensberg1] = useScrollAnimation();
  const [refAfrica1, visibleAfrica1] = useScrollAnimation();
  const [refAboutImg, visibleAboutImg] = useScrollAnimation();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // A helper function to get animation classes based on visibility:
  const animClasses = (visible) =>
    `transition-transform duration-700 ease-out ${
      visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
    }`;

  return (
    <div className="scroll-smooth">
      <div id="home" className="relative h-screen w-full flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hiking})`  }}
        ></div>

        {/* Overlay to dim the image */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className=" relative top-20 left-10 text-white">
          <h1 className="font-bold text-6xl mb-6 ">Welcome to Trailo</h1>
          <p className="text-xl mb-4">
            Explore nature — discover breathtaking trails with friends and family.
          </p>
          <p className="text-xl mb-4">
            Escape the city, breathe fresh air, and immerse yourself in the beauty of the great outdoors.
          </p>
          <p className="text-xl mb-4">
            Whether you're a seasoned hiker or just starting out,{' '}
            <span className="font-bold text-yellow-500 text-2xl">Trailo</span> connects you to the perfect
            paths.
          </p>
          <p className="text-xl mb-4">
            Plan your next adventure, track your progress, and share your stories with a vibrant community.
          </p>
          <p className="text-2xl font-bold text-yellow-500">
            Every trail tells a story — Start yours today.
          </p>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 max-w-2xl ">
            <Link to ="/signup">
            <button className="bg-yellow-400 hover:bg-yellow-400 border-2 border-yellow-400 text-black font-bold py-3 px-20 rounded transform transition-transform duration-200 hover:scale-110">
              Get Started
            </button>
            </Link>

            <Link to ="/login">
            <button className="bg-white hover:bg-white border-2 border-white text-black font-bold py-3 px-25 rounded transform transition-transform duration-200 hover:scale-110">
              Sign In
            </button>
            </Link>
            
          </div>
        </div>
        

        {/* Navbar */}
        <nav
          className={`fixed top-0 w-full p-1 grid grid-cols-2 gap-80 items-center z-20 transition-colors duration-500 ${
            scrolled ? 'bg-gray-700 bg-opacity-90' : 'bg-transparent'
          }`}
        >
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-25 h-25 rounded-full" />
          </div>
          <div className="flex justify-center">
            <ul className="flex space-x-20 font-bold text-white text-xl">
              <li>
                <a href="#home" className="hover:text-yellow-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#trails" className="hover:text-yellow-400">
                  Trails
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-yellow-400">
                  About
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-yellow-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <section id="info" className="max-w-10xl mx-auto py-25 ">
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-5'>

          <div id="img1" className='flex flex-col justify-center items-center'>
            <img src={map} alt="Logo" className="w-20 h-20 " />
            <h2 className='text-xl'>Log Every Hike</h2>
            <p className='mt-2'>Keep track of trails,distances and dates</p>
          </div>

           <div id="img2" className='flex flex-col justify-center items-center'>
              <img src={mountain} alt="Logo" className="w-20 h-20" />
              <h2  className='text-xl'>Track Your Progress</h2>
              <p className='mt-2'>Set your achievements over time</p>
          </div>

           <div id="img3" className='flex flex-col justify-center items-center'>
              <img src={location} alt="Logo" className="w-20 h-20" />
              <h2  className='text-xl'>Interactive Map</h2>
              <p className='mt-2'>View your location at all times</p>
          </div>
           <div id="img4" className='flex flex-col justify-center items-center'>
             <img src={trophy} alt="Logo" className="w-20 h-20 " />
             <h2  className='text-xl'>Set Goals</h2>
             <p className='mt-2'>Challenge yourself with hiking milestones</p>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center mt-20'>
          <h1 className='font-bold text-2xl text-gray-800'>Embrace the Adventure</h1>
          <p className='mt-5  text-gray-800'>Uncover hidden gems and make memories that last a lifetime in the great outdoors.</p>
        </div>
      </section>

      <section id="trails" className="max-w-6xl mx-auto px-5 py-6 bg-gray-300 rounded-2xl">
        <h2 className="text-7xl font-bold text-center my-10 text-gray-800">Discover Trails</h2>
        <p className="text-xl text-center mb-10 max-w-3xl mx-auto text-gray-800">
          Below are some of the most popular trails in South Africa - Explore this variety of the trails
          which are suited for all levels of hikers.
        </p>
        <p className="text-lg text-center mb-25 max-w-3xl mx-auto text-gray-800">
          Whether you're seeking breathtaking mountain views, coastal hikes, or serene forest paths, South
          Africa offers something for everyone. Get ready to immerse yourself in nature’s beauty,
          challenge your limits, and create unforgettable memories along these incredible trails.
        </p>

        <ol className="text-md text-gray-800 max-w-7xl ">
          <li>
            <h3 className="text-3xl font-semibold mb-10">1.Table Mountain</h3>
            <p className="mb-7">
              A flat-topped mountain offering panoramic views of Cape Town and the Atlantic Ocean. Popular
              for hiking and cable car rides.
            </p>

            {/* Table Mountain Images Group 1 */}
            <div ref={refTable1} className={animClasses(visibleTable1) + ' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4'}>
               <img
                src={T1}
                alt="Table Mountain"
                className="w-full h-80 rounded-lg shadow-md"
              />
               <img
                src={T2}
                alt="Table Mountain"
                className="w-full h-80 rounded-lg shadow-md"
              />
               <img
                src={T3}
                alt="Table Mountain"
                className="w-full h-80 rounded-lg shadow-md"
              />

              <img
                src={T4}
                alt="Table Mountain"
                className="w-full h-80 rounded-lg shadow-md"
              />
              <img
                src={T5}
                alt="Table Mountain"
                className="w-full h-80 rounded-lg shadow-md"
              />
              <img
                src={T6}
                alt="Table Mountain"
                className="w-full h-80 rounded-lg shadow-md mb-15"
              />
            </div>

            <h3 className="text-3xl font-semibold mb-10">2.The Whale</h3>
            <p className="mb-7">
              A spectacular multi-day hike along the rugged southern coast of South Africa, offering
              breathtaking views of the Indian Ocean, abundant marine life including whales and dolphins,
              pristine beaches, and indigenous forests. Perfect for adventurers seeking both challenge and
              natural beauty.
            </p>

            {/* The Whale Images Group */}
            <div ref={refWhale1} className={animClasses(visibleWhale1) + ' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'}>
              <img
                src={Whale1}
                alt="The Whale"
                className="w-full h-80 rounded-lg shadow-md"
              />
              <img
                src={Whale2}
                alt="The Whale"
                className="w-full h-80 rounded-lg shadow-md"
              />
              <img
                src={Whale3}
                alt="The Whale"
                className="w-full h-80 rounded-lg shadow-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
              <img
                src={Whale4}
                alt="The Whale"
                className={`w-full h-80 rounded-lg shadow-md ${visibleWhale1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-transform duration-700 ease-out`}
              />
              <img
                src={Whale5}
                alt="The Whale"
                className={`w-full h-80 rounded-lg shadow-md ${visibleWhale1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-transform duration-700 ease-out`}
              />
              <img
                src={Whale6}
                alt="The Whale"
                className={`w-full h-80 rounded-lg shadow-md mb-15 ${visibleWhale1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-transform duration-700 ease-out`}
              />
            </div>

            <h3 className="text-3xl font-semibold mb-10">3.Drakensberg Mountain</h3>
            <p className="mb-7">
              Majestic mountain range known for its dramatic cliffs, scenic hiking trails, waterfalls, and
              rich biodiversity — a paradise for nature lovers and outdoor enthusiasts.
            </p>

            {/* Drakensberg Images Group */}
            <div ref={refDrakensberg1} className={animClasses(visibleDrakensberg1) + ' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'}>
              <img
                src={Dr1}
                alt="Drakensberg Mountain"
                className="w-full h-80 rounded-lg shadow-md"
              />
              <img
                src={Dr2}
                alt="Drakensberg Mountain"
                className="w-full h-80 rounded-lg shadow-md"
              />
              <img
                src={Dr3}
                alt="Drakensberg Mountain"
                className="w-full h-80 rounded-lg shadow-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
              <img
                src={Dr4}
                alt="Drakensberg Mountain"
                className={`w-full h-80 rounded-lg shadow-md ${visibleDrakensberg1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-transform duration-700 ease-out`}
              />
              <img
                src={Dr5}
                alt="Drakensberg Mountain"
                className={`w-full h-80 rounded-lg shadow-md ${visibleDrakensberg1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-transform duration-700 ease-out`}
              />
              <img
                src={Dr6}
                alt="Drakensberg Mountain"
                className={`w-full h-80 rounded-lg shadow-md mb-15 ${visibleDrakensberg1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-transform duration-700 ease-out`}
              />
            </div>

            <h3 className="text-3xl font-semibold mb-10">4.Rim of Africa</h3>
            <p className="mb-7">
              An epic multi-day trail along the Drakensberg’s dramatic escarpment, featuring breathtaking
              vistas, rugged terrain, and unforgettable wilderness experiences.
            </p>

            {/* Rim of Africa Images Group */}
            <div ref={refAfrica1} className={animClasses(visibleAfrica1) + ' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'}>
              <img
                src={Africa1}
                alt="Rim of Africa"
                className="w-full h-80 rounded-lg shadow-md"
              />
              <img
                src={Africa2}
                alt="Rim of Africa"
                className="w-full h-80 rounded-lg shadow-md"
              />
              <img
                src={Africa3}
                alt="Rim of Africa"
                className="w-full h-80 rounded-lg shadow-md"
              />
            </div>
          </li>
        </ol>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-5 py-10  mt-20 rounded-2xl">
        <h2 className="text-6xl font-bold text-center mt-10 mb-15 max-w-3xl mx-auto text-gray-900">
          About Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-50 max-w-7xl mx-auto px-5">
         <section
            id="Identity"
            ref={refAboutImg}
            className={`text-white mb-10 ${animClasses(visibleAboutImg)}`}
            >

            <img src={image} alt="Logo" className="w-full h-full" />
          </section>

          <section id="News" className="text-black">
            <p className="text-xl leading-relaxed mt-30">
              At Trailo, we bring the tradition of the hiking logbook into the digital age. Our
              platform lets outdoor enthusiasts track every hike with ease — logging locations,
              distances, weather, elevation, and personal notes right from the web, anywhere you go.
              More than just a tracker, Trailo helps you plan your next adventure by selecting
              routes, checking weather forecasts, setting start times, and even inviting friends to
              join. Stay motivated by viewing your friends’ hikes, sharing milestones, and
              celebrating accomplishments together. Whether you’re a solo explorer or part of a hiking
              community, Trailo is your all-in-one tool to record memories, plan journeys, and connect
              with fellow adventurers.
            </p>
            <p className="text-xl leading-relaxed mt-20">
              Join us in embracing the spirit of exploration and adventure. With Trailo, every step
              you take is a step towards new discoveries and unforgettable experiences.{' '}
              <span className="font-bold text-3xl text-yellow-500">Let’s hit the trails together!</span>
            </p>
          </section>
        </div>
      </section>
      

    </div>
  );
};

export default Welcome;