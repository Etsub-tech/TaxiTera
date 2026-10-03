import image_d72601503a35aae327af99527666c7086e93fed9 from "figma:asset/d72601503a35aae327af99527666c7086e93fed9.png";
import image_e26d66197677a441968b8cd1ad5f7dd9eb598a95 from "figma:asset/e26d66197677a441968b8cd1ad5f7dd9eb598a95.png";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import crowdedQueueImage from "figma:asset/db8d4df0ed0b97b8c1acf6833e96e0a5ab009d74.png";
import trafficImage from "figma:asset/dbf41336fd02683a476922991673c11bbac7e154.png";
import terminalImage from "figma:asset/d86ba4536614d30a118c3398328ffd145000b54f.png";
import nightCityImage from "figma:asset/58c67f3f9932306943fe70dfc6bd854a2e4bb197.png";
import {
  MapPin,
  Clock,
  Users,
  UserPlus,
  Navigation,
  Map,
  Shield,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/guest-search");
    }
  };

  return (
    <div
      className={
        isDarkMode ? "min-h-screen bg-gray-900" : "min-h-screen bg-white"
      }
    >
      {/* Hero  */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${image_d72601503a35aae327af99527666c7086e93fed9})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white px-6 max-w-4xl"
        >
          <h1 className="text-6xl mb-6">Find Your Taxi Terminal</h1>
          <p className="text-2xlr mb-8 text-gray-200">
            Navigate Addis Ababa's minibus taxi network with ease
          </p>
          <button
            onClick={handleGetStarted}
            className="px-12 py-4 bg-blue-600 text-white text-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </motion.div>
      </section>

      {/* Problem: Confusing Routes - Staggered Left */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={isDarkMode ? "py-20 bg-gray-800" : "py-20 bg-gray-100"}
      >
        <div className="max-w-6xl mx-auto px-6 md:ml-12">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <img
                src={image_d72601503a35aae327af99527666c7086e93fed9}
                alt="Night city street view"
                className="w-full h-96 object-cover shadow-2xl"
              />
            </motion.div>
            <div className="md:w-1/2 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Navigation className="w-12 h-12 text-blue-500" />
                <h2 className="text-4xl">Confused About Routes?</h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed">
                With so many taxi routes in Addis Ababa, it's easy to get
                confused about which one to take. TaxiTera simplifies this by
                showing you the best routes based on your origin and
                destination, saving you time and hassle.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Problem: Can't Find Terminals - Staggered Right */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={isDarkMode ? "py-20 bg-gray-900" : "py-20 bg-white"}
      >
        <div className="max-w-6xl mx-auto px-6 md:mr-12 md:ml-auto">
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <img
                src={terminalImage}
                alt="Taxi terminal"
                className="w-full h-96 object-cover shadow-2xl"
              />
            </motion.div>
            <div className="md:w-1/2 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-12 h-12 text-blue-500" />
                <h2 className="text-4xl">Can't Find the Right Terminal?</h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed">
                Not knowing where to catch your taxi can be frustrating,
                especially in a bustling city like Addis Ababa. TaxiTera
                provides precise terminal locations and routes, making your
                commute stress-free.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Problem: Long Wait Times - Staggered Left Lower */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={isDarkMode ? "py-20 bg-gray-800" : "py-20 bg-gray-100"}
      >
        <div className="max-w-6xl mx-auto px-6 md:ml-24">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <img
                src={image_e26d66197677a441968b8cd1ad5f7dd9eb598a95}
                alt="Traffic in Addis Ababa"
                className="w-full h-96 object-cover shadow-2xl"
              />
            </motion.div>
            <div className="md:w-1/2 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-12 h-12 text-blue-500" />
                <h2 className="text-4xl">Tired of Long Wait Times?</h2>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed">
                Waiting in endless queues at taxi terminals wastes valuable
                time. TaxiTera helps you find the fastest routes and nearest
                terminals, so you can plan your journey efficiently and avoid
                unnecessary delays.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={isDarkMode ? "py-24 bg-gray-900" : "py-24 bg-white"}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl text-white text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-white mb-4">Sign Up or Continue</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Create an account to save your preferences or continue as a
                guest
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-white mb-4">Enter Location</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Select your origin and destination from our comprehensive list
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-white mb-4">View Routes</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                See the best, nearest, and fastest routes to your destination
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-white mb-4">Travel Safe</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                Get detailed route information and travel with confidence
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action and Footer Section */}
      <section
        className={
          isDarkMode
            ? "bg-blue-950 py-24 text-center"
            : "bg-blue-900 py-24 text-center"
        }
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl text-white mb-6">
              Ready to Navigate Addis Ababa?
            </h2>
            <p className="text-2xl text-gray-300 mb-10">
              Join thousands of commuters who trust TaxiTera for their daily
              travel
            </p>
            <button
              onClick={handleGetStarted}
              className="px-16 py-5 bg-blue-600 text-white text-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>
          </motion.div>

          <div
            className={`mt-20 pt-8 border-t ${isDarkMode ? "border-blue-800" : "border-blue-700"}`}
          >
            <p className="text-gray-400">
              © 2025 TaxiTera. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
