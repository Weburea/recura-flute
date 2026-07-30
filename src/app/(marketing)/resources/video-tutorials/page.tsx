"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { 
  BookOpen, LayoutDashboard, Receipt, Wallet, Database, Terminal, Video, MessageSquare, Search,
  Clock, ChevronRight, Play, Pause, RefreshCw, X, Volume2, VolumeX, Maximize, Minimize, SkipForward
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const CATEGORIES = [
  { id: 'all', name: 'All resources', icon: BookOpen, path: '/resources' },
  { id: 'basics', name: 'Billing basics', icon: LayoutDashboard, path: '/resources/billing-basics' },
  { id: 'ops', name: 'Invoicing operations', icon: Receipt, path: '/resources/invoicing-operations' },
  { id: 'payments', name: 'Payment collection', icon: Wallet, path: '/resources/payment-collection' },
  { id: 'enterprise', name: 'Enterprise', icon: Database, path: '/resources/enterprise' },
  { id: 'devs', name: 'API & Developers', icon: Terminal, path: '/resources/api-developers' },
  { id: 'videos', name: 'Video tutorials', icon: Video, path: '/resources/video-tutorials' },
  { id: 'community', name: 'Community', icon: MessageSquare, path: '/resources/community' }
];

const VIDEOS_LIST = [
  {
    title: "Setting up your first subscription plan in Recura",
    category: "GETTING STARTED",
    duration: "6:42",
    stats: "4.2K views • 2 days ago",
    thumbnail: "https://res.cloudinary.com/weburea/image/upload/v1784463644/Recure%20assets/images/thu1.png",
    videoUrl: "https://res.cloudinary.com/weburea/video/upload/v1783741151/efy21lyxzgcgaggezxud.mp4"
  },
  {
    title: "Understanding proration: a visual walkthrough",
    category: "BILLING BASICS",
    duration: "9:15",
    stats: "3.1K views • 1 week ago",
    thumbnail: "https://res.cloudinary.com/weburea/image/upload/v1784463677/Recure%20assets/images/thu2.png",
    videoUrl: "https://res.cloudinary.com/weburea/video/upload/v1783741189/qiik8ltjwb7vixknhrku.mp4"
  },
  {
    title: "Automated invoice delivery: setup and testing",
    category: "INVOICING",
    duration: "12:08",
    stats: "2.8K views • 2 weeks ago",
    thumbnail: "https://res.cloudinary.com/weburea/image/upload/v1784463704/Recure%20assets/images/thu3.gif",
    videoUrl: "https://res.cloudinary.com/weburea/video/upload/v1783568301/analytics_screen_gxqtzo.mp4"
  },
  {
    title: "Configuring your first dunning sequence",
    category: "PAYMENTS",
    duration: "8:30",
    stats: "5.6K views • 3 weeks ago",
    thumbnail: "https://res.cloudinary.com/weburea/image/upload/v1784463828/Recure%20assets/images/thu4.png",
    videoUrl: "https://res.cloudinary.com/weburea/video/upload/v1783741151/efy21lyxzgcgaggezxud.mp4"
  },
  {
    title: "Reading your revenue dashboard: MRR, ARR, churn",
    category: "ANALYTICS",
    duration: "14:22",
    stats: "3.9K views • 1 month ago",
    thumbnail: "https://res.cloudinary.com/weburea/image/upload/v1784463948/Recure%20assets/images/thu5.png",
    videoUrl: "https://res.cloudinary.com/weburea/video/upload/v1783741189/qiik8ltjwb7vixknhrku.mp4"
  },
  {
    title: "Integrating Recura API with your SaaS app",
    category: "API",
    duration: "18:45",
    stats: "2.4K views • 1 month ago",
    thumbnail: "https://res.cloudinary.com/weburea/image/upload/v1784464020/Recure%20assets/images/thu6.png",
    videoUrl: "https://res.cloudinary.com/weburea/video/upload/v1783568301/analytics_screen_gxqtzo.mp4"
  },
  {
    title: "Connecting Stripe to Recura: full walkthrough",
    category: "INTEGRATIONS",
    duration: "7:55",
    stats: "8.1K views • 2 months ago",
    thumbnail: "https://res.cloudinary.com/weburea/image/upload/v1784463828/Recure%20assets/images/thu4.png",
    videoUrl: "https://res.cloudinary.com/weburea/video/upload/v1783741151/efy21lyxzgcgaggezxud.mp4"
  },
  {
    title: "Multi-entity billing: consolidating multiple businesses",
    category: "ADVANCED",
    duration: "11:18",
    stats: "1.7K views • 2 months ago",
    thumbnail: "https://res.cloudinary.com/weburea/image/upload/v1784463644/Recure%20assets/images/thu1.png",
    videoUrl: "https://res.cloudinary.com/weburea/video/upload/v1783741189/qiik8ltjwb7vixknhrku.mp4"
  }
];

export default function VideoTutorialsPage() {
  const [search, setSearch] = useState('');
  const [activeVideo, setActiveVideo] = useState<typeof VIDEOS_LIST[0] | null>(null);
  const [activeVideoIdx, setActiveVideoIdx] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Custom Video Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNextPopup, setShowNextPopup] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [loadingBlob, setLoadingBlob] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const activeCat = 'videos';

  const filteredVideos = VIDEOS_LIST.filter(video => 
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    video.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleVideoSelect = (video: typeof VIDEOS_LIST[0], idx: number) => {
    setActiveVideo(video);
    setActiveVideoIdx(idx);
  };

  const handlePlayNext = () => {
    if (activeVideoIdx !== null && filteredVideos.length > 0) {
      const nextIdx = (activeVideoIdx + 1) % filteredVideos.length;
      setActiveVideo(filteredVideos[nextIdx]);
      setActiveVideoIdx(nextIdx);
    }
  };

  // Get info of the next video
  const nextVideo = activeVideoIdx !== null && filteredVideos.length > 0
    ? filteredVideos[(activeVideoIdx + 1) % filteredVideos.length]
    : null;

  // Custom video handlers
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (video.duration && video.duration - video.currentTime <= 10) {
      if (nextVideo) {
        setShowNextPopup(true);
      }
    } else {
      setShowNextPopup(false);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const vol = parseFloat(e.target.value);
    video.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const mute = !isMuted;
    video.muted = mute;
    setIsMuted(mute);
    if (!mute && volume === 0) {
      video.volume = 0.5;
      setVolume(0.5);
    }
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Fetch video as blob to prevent IDM downloads
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!activeVideo) {
      setVideoSrc('');
      setLoadingBlob(false);
      return;
    }

    setLoadingBlob(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setShowNextPopup(false);
    /* eslint-enable react-hooks/set-state-in-effect */

    let active = true;
    let objectUrl = '';

    fetch(activeVideo.videoUrl)
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.blob();
      })
      .then(blob => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setVideoSrc(objectUrl);
        setLoadingBlob(false);
      })
      .catch(err => {
        console.error('Blob load error, falling back to direct URL:', err);
        if (active) {
          setVideoSrc(activeVideo.videoUrl);
          setLoadingBlob(false);
        }
      });

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [activeVideo]);

  // Sync fullscreen change with state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const activeCategory = CATEGORIES.find(cat => cat.id === activeCat);

  return (
    <main className="bg-background min-h-screen pt-20">
      <Navbar />

      {/* Hero section */}
      <section className="relative pt-24 pb-20 overflow-hidden bg-[#FFF5F5] dark:bg-[#190d0d] text-left border-b border-slate-200/50 dark:border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[450px] pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.04),transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.08),transparent_65%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <span className="text-[10px] font-bold text-[#E11D48] uppercase tracking-widest block mb-4">
            — Video tutorials
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4 max-w-3xl">
            Watch and learn at your own pace
          </h1>
          
          <p className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed mb-8">
            85 step-by-step screen recordings covering every Recura feature — from your first subscription setup to advanced revenue analytics and API integration.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-8">
            <span className="flex items-center gap-2">
              <Video className="w-4 h-4 text-slate-400" />
              85 videos
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Avg 8 min per video
            </span>
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-slate-400 animate-spin-slow" />
              Updated monthly
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button className="px-6 py-5 rounded-xl font-bold bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Browse all videos
            </Button>
            <Button variant="outline" className="px-6 py-5 rounded-xl font-bold border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer bg-white dark:bg-transparent">
              Subscribe for updates
            </Button>
          </div>
        </div>
      </section>

      {/* Main Categories Navigation tabs bar */}
      <section className="border-b border-slate-200/60 dark:border-white/10 bg-slate-50/50 dark:bg-black/10 select-none py-3 md:py-0">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Desktop tabs view */}
          <div className="hidden md:flex items-center gap-6 pt-4">
            {CATEGORIES.map((cat) => {
              const isActive = activeCat === cat.id;
              return (
                <Link
                  key={cat.id}
                  href={cat.path}
                  className={cn(
                    "pb-3.5 -mb-px flex items-center gap-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer",
                    isActive
                      ? "text-primary border-primary"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border-transparent"
                  )}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile custom dropdown view */}
          <div className="md:hidden relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#150a2e] font-bold text-xs text-slate-850 dark:text-white cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2">
                {activeCategory && <activeCategory.icon className="w-4 h-4 text-primary" />}
                <span>{activeCategory ? activeCategory.name : 'Select category'}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform text-slate-405", dropdownOpen && "rotate-90")} />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 z-30 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#150a2e] shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCat === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={cat.path}
                      onClick={() => setDropdownOpen(false)}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 text-xs font-bold transition-colors cursor-pointer",
                        isActive
                          ? "bg-slate-50 dark:bg-white/5 text-primary"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                      )}
                    >
                      <cat.icon className="w-4 h-4" />
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video Grid Section */}
      <section className="py-16 bg-white dark:bg-transparent">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Search bar inside content */}
          <div className="max-w-xl mx-auto mb-16 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search video tutorials..."
              className="w-full pl-12 pr-16 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 font-semibold text-sm focus:outline-none focus:border-primary/50 dark:focus:border-primary/50 text-slate-900 dark:text-white shadow-sm transition-all"
            />
          </div>

          <div className="relative mb-10 flex items-center justify-start border-b border-slate-200 dark:border-white/5 pb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Getting Started Series
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleVideoSelect(video, idx)}
                  className="group flex flex-col justify-start text-left bg-white dark:bg-[#150a2e] rounded-2xl border border-slate-200/50 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/15 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  {/* Thumbnail container */}
                  <div className="relative aspect-video w-full bg-slate-950 overflow-hidden shrink-0 select-none">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Dark mask overlay */}
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
                    
                    {/* Finer play overlay at the bottom left-hand side */}
                    <div className="absolute bottom-3 left-3 z-25">
                      <div className="w-8 h-8 rounded-full bg-white/95 dark:bg-slate-900/90 flex items-center justify-center shadow-lg border border-slate-200/50 dark:border-white/10 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-slate-950">
                        <Play className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48] ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Label at bottom-right */}
                    <span className="absolute bottom-3 right-3 bg-black/75 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold text-white tracking-wider">
                      {video.duration}
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black text-[#E11D48] uppercase tracking-wider block mb-2">
                        {video.category}
                      </span>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug group-hover:text-[#E11D48] transition-colors line-clamp-2">
                        {video.title}
                      </h3>
                    </div>
                    
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-4 block">
                      {video.stats}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400 dark:text-slate-600">
                No video tutorials found matching your filter criteria.
              </div>
            )}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center items-center gap-2 mt-12 select-none">
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs bg-slate-950 text-white cursor-pointer hover:bg-slate-900">
              1
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
              2
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
              3
            </button>
            <span className="text-slate-400 dark:text-slate-600 text-xs font-bold px-1 select-none">...</span>
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
              9
            </button>
            <button className="w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* Video Player Modal overlay */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div 
            ref={playerContainerRef}
            className="relative w-full max-w-[850px] bg-[#12131a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col group/modal"
          >
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 border-b border-white/5 flex items-center justify-between text-left">
              <div className="min-w-0">
                <span className="text-[9px] font-black text-[#E11D48] uppercase tracking-wider block mb-1">
                  {activeVideo.category}
                </span>
                <h3 className="text-sm font-extrabold text-white truncate max-w-[550px]">
                  {activeVideo.title}
                </h3>
              </div>
              <button 
                onClick={() => { setActiveVideo(null); setActiveVideoIdx(null); }}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video element container */}
            <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
              {loadingBlob && (
                <div className="absolute inset-0 z-10 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <span className="text-[11px] font-bold text-slate-400 font-sans tracking-wide">
                    Securing video stream...
                  </span>
                </div>
              )}
              <video
                ref={videoRef}
                key={videoSrc}
                src={videoSrc}
                poster={activeVideo.thumbnail}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onContextMenu={(e) => e.preventDefault()}
                onClick={togglePlay}
                autoPlay
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Up Next floating popup */}
              {showNextPopup && nextVideo && (
                <div className="absolute bottom-16 right-4 z-40 bg-slate-900/95 border border-white/10 rounded-2xl p-4 w-64 shadow-[0_0_20px_rgba(162,140,255,0.4)] animate-in slide-in-from-right-8 duration-500 text-left">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Up Next in 10s</span>
                  <h4 className="text-xs font-bold text-white line-clamp-1 mb-3">{nextVideo.title}</h4>
                  <button 
                    onClick={handlePlayNext}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs transition-all shadow-md shadow-primary/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Play Next</span>
                    <SkipForward className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Custom Controller Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 transition-all duration-300 opacity-0 group-hover/modal:opacity-100 md:group-focus-within/modal:opacity-100 focus-within:opacity-100">
                
                {/* Seekbar range input */}
                <div className="w-full flex items-center px-1">
                  <input 
                    type="range" 
                    min="0" 
                    max={duration || 100} 
                    value={currentTime} 
                    onChange={handleSeek}
                    className="w-full accent-primary h-1 bg-white/25 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all hover:h-1.5"
                  />
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="p-1 hover:text-primary transition-colors cursor-pointer">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white hover:fill-primary" />}
                    </button>
                    
                    <span className="text-[10px] font-bold tracking-wider select-none font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Volume control */}
                    <div className="flex items-center gap-2 group/volume">
                      <button onClick={toggleMute} className="p-1 hover:text-primary transition-colors cursor-pointer">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05"
                        value={isMuted ? 0 : volume} 
                        onChange={handleVolumeChange}
                        className="w-0 group-hover/volume:w-16 accent-primary h-1 bg-white/25 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all duration-300 origin-left"
                      />
                    </div>

                    <button onClick={toggleFullscreen} className="p-1 hover:text-primary transition-colors cursor-pointer">
                      {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Control Footer */}
            <div className="px-6 py-5 bg-slate-900 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="text-[10px] font-bold tracking-widest text-[#E11D48] bg-[#E11D48]/10 px-2.5 py-0.5 rounded uppercase">
                  {activeVideo.category}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Duration: {activeVideo.duration}
                </span>
                <span className="text-white/20 hidden sm:inline">•</span>
                <span className="text-xs font-semibold text-slate-400">
                  {activeVideo.stats}
                </span>
              </div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Recura Education Library
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Still Have Questions Banner Section */}
      <section className="py-24 bg-[#0A0D14] dark:bg-[#07090e] border-t border-b border-white/5 relative overflow-hidden text-center">
        {/* Background Pattern using same lines SVG as main page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[550px] z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(162,140,255,0.12),transparent_65%)]" />
          <Image
            src="https://res.cloudinary.com/weburea/image/upload/v1783571760/Grid_hero_lines.svg"
            alt="Background Pattern"
            fill
            className="object-contain opacity-35 pointer-events-none"
            priority
          />
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-4xl">
          <span className="text-[10px] font-bold text-[#A28CFF] uppercase tracking-widest block mb-4">
            Still Have Questions?
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
            Our billing experts are<br />one message away
          </h2>
          <p className="text-sm md:text-base font-semibold text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Whether you&apos;re evaluating Recura or already a customer, our team is ready to help you get the most out of automated billing.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 select-none">
            <Button className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold bg-[#7A69BF] hover:bg-[#6858a7] text-white text-xs shadow-lg shadow-[#7A69BF]/10 transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer border-0">
              Talk to an expert
            </Button>
            <Link href="/resources">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold border-white/15 bg-transparent hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                Browse all resources
              </Button>
            </Link>
            <Link href="/resources/community">
              <Button variant="outline" className="w-full sm:w-auto px-8 py-5 rounded-xl font-bold border-white/15 bg-transparent hover:bg-white/10 text-white hover:text-white text-xs transition-all hover:scale-105 hover:-translate-y-0.5 cursor-pointer">
                Join the community
              </Button>
            </Link>
          </div>

          {/* Footer Sub-badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-bold text-slate-400 tracking-wide uppercase">
            <span>340+ help articles</span>
            <span className="text-white/25">•</span>
            <span>120+ API endpoints</span>
            <span className="text-white/25">•</span>
            <span>24/7 chat support</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
