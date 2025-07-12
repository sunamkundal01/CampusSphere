"use client";

import { Button } from "../../components/ui/button";
import { api } from "../../convex/_generated/api";
import { UserButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useEffect } from "react";

const HomePage = () => {
  const { user } = useUser();
  const createuser = useMutation(api.user.createuser);

  useEffect(() => {
    user && CheckUser();
  }, [user]);

  const CheckUser = async () => {
    const result = await createuser({
      email: user?.primaryEmailAddress?.emailAddress,
      imageURL: user?.imageUrl,
      userName: user?.fullName,
    });

    console.log(result);
  };

  return (
    <div>
      {/* Nav and Hero Section */}
      <div>
        <div>
          <div className="px-5">
            <nav className="z-10 w-full">
              <div>
                <div className="flex flex-wrap items-center justify-between py-2 gap-6 md:py-4 md:gap-0 relative">
                  <input
                    aria-hidden="true"
                    type="checkbox"
                    id="toggle_nav"
                    className="hidden peer"
                    name="toggle_nav"
                  />
                  <div className="relative z-20 w-full flex justify-between lg:w-max md:px-0">
                    <a href="/" className="cursor-pointer">
                      <img
                        alt="CampusSphere logo"
                        loading="lazy"
                        width="120"
                        height="90"
                        decoding="async"
                        src="/logo.svg"
                        className="logo-primary logo-sidebar"
                        style={{ color: "transparent" }}
                      />
                    </a>
                    <div className="relative flex items-center lg:hidden max-h-10">
                      <label
                        role="button"
                        htmlFor="toggle_nav"
                        aria-label="hamburger"
                        id="hamburger"
                        className="relative p-6 -mr-6"
                      >
                        <div
                          aria-hidden="true"
                          id="line"
                          className="m-auto h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"
                        ></div>
                        <div
                          aria-hidden="true"
                          id="line2"
                          className="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"
                        ></div>
                      </label>
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="fixed z-10 inset-0 h-screen w-screen bg-white/70 backdrop-blur-2xl origin-bottom scale-y-0 transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 lg:hidden dark:bg-gray-900/70"
                  ></div>
                  <div className="flex-col z-20 flex-wrap gap-6 p-8 rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-600/10 justify-end w-full invisible opacity-0 translate-y-1 absolute top-full left-0 transition-all duration-300 scale-95 origin-top lg:relative lg:scale-100 lg:peer-checked:translate-y-0 lg:translate-y-0 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:p-0 lg:bg-transparent lg:w-7/12 lg:visible lg:opacity-100 lg:border-none peer-checked:scale-100 peer-checked:opacity-100 peer-checked:visible lg:shadow-none dark:shadow-none dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-gray-600 dark:text-gray-300 lg:pr-4 lg:w-auto w-full lg:pt-0">
                      <ul className="tracking-wide font-medium lg:text-sm flex-col flex lg:flex-row gap-6 lg:gap-0">
                        <li>
                          <a
                            href="#dashboard"
                            className="block md:px-4 transition hover:text-primary"
                          >
                            <span>Dashboard</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#workspace"
                            className="block md:px-4 transition hover:text-primary"
                          >
                            <span>Workspace</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#pyqs"
                            className="block md:px-4 transition hover:text-primary"
                          >
                            <span>PYQs</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#community"
                            className="block md:px-4 transition hover:text-primary"
                          >
                            <span>Community</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="#profile"
                            className="block md:px-4 transition hover:text-primary"
                          >
                            <span>Profile</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-12 lg:mt-0">
                      <a
                        href="/dashboard"
                        className="relative flex h-9 w-full items-center justify-center px-4 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                      >
                        <span className="relative text-sm font-semibold text-white">
                          Get Started
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative" id="home">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
          </div>
          <div>
            <div className="relative pt-36 ml-auto">
              <div className="lg:w-2/3 text-center mx-auto">
                <h1 className="text-gray-900 dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl">
                  Welcome to <span className="text-primary">Campus</span>
                  <span className="text-blue-500">Sphere</span>
                </h1>
                <p className="mt-8 text-gray-700 dark:text-gray-300">
                  Your all-in-one platform for academic collaboration. Share
                  study materials, connect with peers through skill-based
                  discovery, and manage your personal workspace for private
                  notes - all in one place.
                </p>
                <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                  <a
                    href="/dashboard"
                    className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-white">
                      Get started
                    </span>
                  </a>
                  <a
                    href="#dashboard"
                    className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-primary dark:text-white">
                      Explore Features
                    </span>
                  </a>
                </div>
                <div className="hidden py-8 mt-16 border-y gap-x-10 border-gray-100 dark:border-gray-800 sm:flex justify-between">
                  <div className="text-left">
                    <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                      Academic Sharing
                    </h6>
                    <p className="mt-2 text-gray-500">
                      Share PYQs and study materials with your academic
                      community.
                    </p>
                  </div>
                  <div className="text-left">
                    <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                      Student Networking
                    </h6>
                    <p className="mt-2 text-gray-500">
                      Connect with peers based on skills, interests, and
                      academic goals.
                    </p>
                  </div>
                  <div className="text-left">
                    <h6 className="text-lg font-semibold text-gray-700 dark:text-white">
                      Personal Workspace
                    </h6>
                    <p className="mt-2 text-gray-500">
                      Upload and manage private notes with AI-powered insights.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-5">
          {/* Dashboard Section */}
          <section id="dashboard" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Dashboard
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Your central hub for managing all academic activities. Get an
                overview of your uploads, community interactions, and quick
                access to all features.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  View your recent uploads, community activity, and progress at
                  a glance.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Easy Navigation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access all features through an intuitive sidebar with
                  responsive mobile design.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Progress Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your uploads, contributions, and engagement within the
                  academic community.
                </p>
              </div>
            </div>
          </section>

          {/* Workspace Section */}
          <section id="workspace" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Personal Workspace
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Your private space for uploading, organizing, and interacting
                with your personal study materials using AI-powered insights.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  AI-Powered Notes
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Upload PDFs and interact with them using advanced AI
                  technology. Ask questions, get summaries, and extract key
                  insights from your documents.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Intelligent document processing</li>
                  <li>• Interactive Q&A with your PDFs</li>
                  <li>• Smart content extraction</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Private & Secure
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your workspace is completely private. Only you can access your
                  uploaded documents and notes, ensuring confidentiality of your
                  study materials.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Personal document library</li>
                  <li>• Secure file storage</li>
                  <li>• Private AI interactions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* PYQs Section */}
          <section id="pyqs" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Previous Year Questions (PYQs)
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Access and contribute to a collaborative repository of previous
                year question papers, organized by semester and subject for easy
                discovery.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Browse & Download
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Search through an extensive collection of PYQs filtered by
                  semester, subject, and academic year. Download papers shared
                  by fellow students.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Advanced filtering options</li>
                  <li>• Semester-wise organization</li>
                  <li>• Instant downloads</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Share & Contribute
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Upload your own PYQ collection to help fellow students. Build
                  a stronger academic community through resource sharing.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Easy upload process</li>
                  <li>• Community contribution tracking</li>
                  <li>• Helps fellow students</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Community Section */}
          <section id="community" className="mb-24 scroll-mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-orange-600 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Student Community
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Connect with fellow students across your college through
                skill-based discovery and academic interests. Build meaningful
                academic relationships.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Skill-Based Discovery
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find students with complementary skills and expertise. Connect
                  with peers who share your academic interests and goals.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Smart Recommendations
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized recommendations for peers based on your
                  profile, skills, and academic journey.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Academic Networking
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Build professional relationships early in your academic
                  career. Connect on LinkedIn and grow your network.
                </p>
              </div>
            </div>
          </section>

          {/* Profile Section */}
          <section id="profile" className="mb-16 scroll-mt-20">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-6">
                <svg
                  className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Profile Management
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Create and manage your academic profile. Showcase your skills,
                interests, and academic journey to connect with like-minded
                peers.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Academic Identity
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Build a comprehensive academic profile including your
                  department, batch, skills, and interests. Help others discover
                  your expertise.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Department and batch information</li>
                  <li>• Skills and expertise showcase</li>
                  <li>• Academic interests and goals</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Connect & Collaborate
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Link your professional profiles and make it easy for peers to
                  connect with you beyond the platform.
                </p>
                <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• LinkedIn integration</li>
                  <li>• Professional networking</li>
                  <li>• Easy contact management</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-5 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About CampusSphere */}
            <div className="lg:col-span-2">
              <a href="/" className="cursor-pointer inline-block">
                <img
                  alt="CampusSphere logo"
                  loading="lazy"
                  width="120"
                  height="90"
                  decoding="async"
                  src="/logo.svg"
                  className="mb-4 logo-primary logo-sidebar"
                  style={{ color: "transparent" }}
                />
              </a>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                CampusSphere connects students through academic collaboration
                and skill-based networking. Share study materials, discover
                peers, and manage your personal learning workspace.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#dashboard"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#workspace"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    Workspace
                  </a>
                </li>
                <li>
                  <a
                    href="#pyqs"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    PYQs
                  </a>
                </li>
                <li>
                  <a
                    href="#community"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Features
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#profile"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    Profile Management
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    Get Started
                  </a>
                </li>
                <li>
                  <a
                    href="#workspace"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    AI-Powered Notes
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 CampusSphere. Empowering students through collaborative
              learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
