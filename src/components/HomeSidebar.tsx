import { Link, useLocation } from "react-router-dom";
import echolightLogo from "@/assets/echolight-logo.png";

const navItems = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "Features", to: "/features" },
  { label: "Security", to: "/security" },
  { label: "Why EchoLight", to: "/about" },
];

const HomeSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] bg-background border-r border-border/40 flex-col z-40">
      {/* Logo */}
      <div className="p-6 pb-8">
        <Link to="/" className="block">
          <img
            src={echolightLogo}
            alt="EchoLight"
            className="h-10 object-contain object-left"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`block py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? "text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Decorative bottom area */}
      <div className="p-6 pt-0">
        <div className="border-t border-border/40 pt-6">
          <p className="text-xs text-muted-foreground/60 italic font-serif leading-relaxed">
            "Because even after you're gone, your voice echoes in the light."
          </p>
        </div>
      </div>
    </aside>
  );
};

export default HomeSidebar;
