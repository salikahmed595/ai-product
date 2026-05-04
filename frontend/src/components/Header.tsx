import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center text-muted-foreground bg-muted px-3 py-1.5 rounded-full w-64 border border-border">
        <Search size={16} className="mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-sm w-full text-foreground"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-primary transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            Dr
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-sm font-semibold text-foreground leading-none">Dr. Smith</span>
            <span className="text-xs text-muted-foreground mt-1 leading-none">Clinic Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
