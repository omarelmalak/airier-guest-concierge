import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import airierLogo from "@/assets/airier-logo.png";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

const LandingNav = () => {
  const [open, setOpen] = useState(false);
  const [showTrigger, setShowTrigger] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTrigger(window.scrollY > 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <>
      {/* Static logo — always top-left */}
      <div className="fixed top-0 left-0 z-50 px-8 md:px-12 h-20 flex items-center pointer-events-none">
        <Link to="/" className="pointer-events-auto">
          <img src={airierLogo} alt="airier" className="h-8 rounded-[22%] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)]" />
        </Link>
      </div>

      {/* Top-right controls: hamburger first, then CTA */}
      <div className="fixed top-0 right-0 z-50 px-8 md:px-12 h-20 flex items-center gap-3">
        {/* Menu trigger + dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className={`relative z-[60] w-11 h-11 rounded-full flex items-center justify-center transition-all duration-400 bg-foreground text-background ${showTrigger || open
                ? "opacity-100 scale-100"
                : "md:opacity-0 md:scale-90 md:pointer-events-none opacity-100"
              } shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]`}
          >
            {open ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>

          {/* Compact dropdown */}
          <div
            className={`absolute top-full right-0 mt-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-right ${open
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
          >
            <div className="bg-foreground rounded-2xl p-2 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.3)] min-w-[200px]">
              {[
                { label: "Conversations", href: "#conversations" },
                { label: "Knowledge", href: "#knowledge" },
                { label: "How it works", href: "#how" },
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-[15px] text-background/70 hover:text-background hover:bg-background/10 rounded-xl transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
              <div className="h-px bg-background/10 my-1 mx-2" />
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-[15px] text-background/50 hover:text-background hover:bg-background/10 rounded-xl transition-colors duration-200"
              >
                Log in
              </Link>
              <div className="px-2 pb-2 pt-1 md:hidden">
                <Link to="/auth?mode=signup" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-background text-foreground hover:bg-background/90 rounded-xl h-10 text-sm font-medium">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Get started — solid dark, clearly visible */}
        <Link to="/auth?mode=signup" className="hidden md:block">
          <Button className="bg-foreground text-background hover:bg-foreground/80 rounded-xl h-10 px-6 text-[14px] font-medium transition-all duration-300">
            Get started
          </Button>
        </Link>
      </div>
    </>
  );
};

export default LandingNav;
