"use client";

import Link from "next/link";
import { 
  Network, 
  Users, 
  Calendar, 
  Zap, 
  Star, 
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Globe2,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-zinc-800">
      
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-lg">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-white">ATRIUS</span>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it Works</a>
              <a href="#testimonials" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Testimonials</a>
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <Link href="/auth/login" className="hidden md:inline-flex text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Log in
              </Link>
              <div className="hidden md:block">
                <Link 
                  href="/auth/register" 
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
              <button 
                className="md:hidden p-2 text-zinc-400 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 space-y-4">
            <div className="flex flex-col space-y-3">
              <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
              <a href="#testimonials" className="text-sm font-medium text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
              <Link 
                href="/auth/login" 
                className="flex w-full items-center justify-center rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </Link>
              <Link 
                href="/auth/register" 
                className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32">
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl">
            <div className="h-[40rem] w-[40rem] rounded-full bg-blue-600 mix-blend-screen" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <div className="flex flex-col space-y-8 max-w-2xl">
                <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-300 w-fit backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 mt-1.5 animate-pulse"></span>
                  The new standard for professional networking
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                  Connect with the <span className="text-blue-500">professionals</span> who matter.
                </h1>
                
                <p className="text-lg md:text-xl text-zinc-400 max-w-[600px] leading-relaxed">
                  Expand your professional network, discover new opportunities, and build meaningful relationships in a distraction-free environment designed for career growth.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    href="/auth/register" 
                    className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all gap-2"
                  >
                    Join Atrius Today <ChevronRight className="h-5 w-5" />
                  </Link>
                  <a 
                    href="#how-it-works" 
                    className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900/50 px-8 text-base font-semibold text-white hover:bg-zinc-800 transition-colors"
                  >
                    See How it Works
                  </a>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-zinc-500 pt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-zinc-400" /> Secure & Private
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-zinc-400" /> Global Network
                  </div>
                </div>
              </div>

              {/* Browser Mockup */}
              <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none perspective-[2000px] mt-8 lg:mt-0">
                <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden transform lg:rotate-y-[-12deg] lg:rotate-x-[5deg]">
                  {/* Browser Top Bar */}
                  <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                    <div className="mx-4 flex h-6 flex-1 items-center justify-center rounded bg-zinc-950/50 px-3 text-xs text-zinc-500 border border-zinc-800">
                       app.atrius.com
                    </div>
                  </div>
                  {/* Browser Content */}
                  <div className="p-6 bg-zinc-950">
                    <div className="flex gap-4">
                      {/* Sidebar Mockup */}
                      <div className="hidden sm:flex w-48 flex-col gap-3">
                        <div className="h-24 rounded-lg bg-zinc-900 border border-zinc-800 mb-4 p-4 flex flex-col items-center justify-center gap-2">
                          <div className="h-10 w-10 rounded-full bg-zinc-800" />
                          <div className="h-2 w-20 rounded bg-zinc-700" />
                          <div className="h-2 w-12 rounded bg-zinc-800" />
                        </div>
                        <div className="h-8 rounded md bg-zinc-900" />
                        <div className="h-8 rounded md bg-zinc-900/50" />
                        <div className="h-8 rounded md bg-zinc-900/50" />
                        <div className="h-8 rounded md bg-zinc-900/50" />
                      </div>
                      {/* Feed Mockup */}
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="h-32 rounded-lg bg-zinc-900 border border-zinc-800 p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-blue-600/20" />
                            <div className="space-y-2">
                              <div className="h-2 w-24 rounded bg-zinc-700" />
                              <div className="h-2 w-16 rounded bg-zinc-800" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-full rounded bg-zinc-800" />
                            <div className="h-2 w-3/4 rounded bg-zinc-800" />
                          </div>
                        </div>
                        <div className="h-32 rounded-lg bg-zinc-900 border border-zinc-800 p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-zinc-800" />
                            <div className="space-y-2">
                              <div className="h-2 w-32 rounded bg-zinc-700" />
                              <div className="h-2 w-20 rounded bg-zinc-800" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-full rounded bg-zinc-800" />
                            <div className="h-2 w-5/6 rounded bg-zinc-800" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-900/30 border-y border-zinc-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Everything you need to network</h2>
              <p className="text-lg text-zinc-400">
                Powerful tools specifically curated for modern professionals looking to build high-value connections.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Network className="h-6 w-6 text-blue-500" />,
                  title: "Smart Networking",
                  desc: "Our AI-driven algorithm suggests connections based on your industry, skills, and goals."
                },
                {
                  icon: <Users className="h-6 w-6 text-blue-500" />,
                  title: "Community Groups",
                  desc: "Join niche communities of professionals sharing insights and resolving similar challenges."
                },
                {
                  icon: <Calendar className="h-6 w-6 text-blue-500" />,
                  title: "Event Discovery",
                  desc: "Find and attend top-tier industry events, webinars, and local meetups seamlessly."
                },
                {
                  icon: <Zap className="h-6 w-6 text-blue-500" />,
                  title: "Real-time Opportunities",
                  desc: "Get instantly notified about career moves, funding rounds, and new job openings."
                },
                {
                  icon: <Star className="h-6 w-6 text-blue-500" />,
                  title: "Profile Showcasing",
                  desc: "Build a beautiful portfolio that highlights your true expertise beyond just a resume."
                },
                {
                  icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
                  title: "Direct Messaging",
                  desc: "Reach out to industry leaders with a clean, focused, distraction-free inbox."
                }
              ].map((feature, idx) => (
                <div key={idx} className="group flex flex-col p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">How Atrius Works</h2>
              <p className="text-lg text-zinc-400">
                Building your professional presence has never been this simple or effective.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Desktop Connecting Line */}
              <div className="hidden md:block absolute top-10 left-[15%] w-[70%] h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
              
              {[
                {
                  step: "01",
                  title: "Build Your Profile",
                  desc: "Highlight your experience, skills, and professional goals in a sleek, modern format."
                },
                {
                  step: "02",
                  title: "Connect & Engage",
                  desc: "Engage with industry peers, share insights, and expand your network organically."
                },
                {
                  step: "03",
                  title: "Unlock Opportunities",
                  desc: "Receive tailored job offers, partnership requests, and event invitations."
                }
              ].map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center group">
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-950 border-4 border-zinc-800 group-hover:border-blue-500 transition-colors">
                    <span className="text-2xl font-bold text-white tracking-tighter">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mt-8 mb-4">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed max-w-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-zinc-900/30 border-y border-zinc-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 pb-4 border-b border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Trusted by professionals</h2>
                <p className="text-lg text-zinc-400">
                  Hear from the people who have accelerated their careers using Atrius.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  initials: "AK",
                  name: "Alex Kimura",
                  role: "Senior Product Manager",
                  quote: "Atrius cuts out the noise. It’s the first networking app where I actually enjoy spending time reading industry insights rather than scrolling past spam."
                },
                {
                  initials: "SJ",
                  name: "Sarah Jenkins",
                  role: "Founder & CEO",
                  quote: "I found my co-founder and secured our initial seed funding through connections made entirely on this platform. It's an indispensable tool."
                },
                {
                  initials: "MR",
                  name: "Marcus R.",
                  role: "Lead Software Engineer",
                  quote: "The profile design is stunning. For the first time, I feel like my digital professional representation accurately reflects my actual capabilities."
                }
              ].map((review, idx) => (
                <div key={idx} className="flex flex-col justify-between p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <div className="mb-8">
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-4 w-4 fill-blue-500 text-blue-500" />)}
                    </div>
                    <p className="text-white text-lg leading-relaxed italic">"{review.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-lg">
                      {review.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{review.name}</h4>
                      <p className="text-sm text-zinc-400">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10" />
          <div className="absolute top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl">
            <div className="h-[20rem] w-[40rem] rounded-full bg-blue-600 mix-blend-screen" />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto p-12 rounded-3xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-md shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Ready to elevate your career?
              </h2>
              <p className="text-xl text-zinc-400">
                Join the exclusive network of industry leaders matching opportunities with ambition.
              </p>
              <Link 
                href="/auth/register" 
                className="inline-flex h-14 items-center justify-center rounded-md bg-blue-600 px-10 text-lg font-semibold text-white shadow hover:bg-blue-700 transition-colors"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2 flex flex-col space-y-4 pr-8">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800 text-white font-bold">
                  A
                </div>
                <span className="text-xl font-bold tracking-tight text-white">ATRIUS</span>
              </div>
              <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
                The premier platform for professional networking, focused on high-quality connections, meaningful insights, and career advancement.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="font-semibold text-white">Resources</h4>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guidelines</a></li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-4">
              <h4 className="font-semibold text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <p>© {new Date().getFullYear()} Atrius Network Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
