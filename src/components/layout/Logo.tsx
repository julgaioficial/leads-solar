import logo from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
  xl: "h-20",
};

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src={logo} 
        alt="Leads Solar" 
        className={`${sizeClasses[size]} w-auto object-contain`}
      />
    </div>
  );
}
