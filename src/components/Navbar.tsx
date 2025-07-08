import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  HeadphonesSimple,
  Gear,
  SignOut,
  User,
  Robot
} from '@phosphor-icons/react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex items-center gap-3 w-full justify-start px-4",
        isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ activePage, onNavigate }: NavbarProps) {
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-semibold text-primary">Customer Portal</h1>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-grow">
        <NavItem 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          isActive={activePage === 'dashboard'} 
          onClick={() => onNavigate('dashboard')} 
        />
        <NavItem 
          icon={<FileText size={20} />} 
          label="Invoices" 
          isActive={activePage === 'invoices'} 
          onClick={() => onNavigate('invoices')} 
        />
        <NavItem 
          icon={<HeadphonesSimple size={20} />} 
          label="Support" 
          isActive={activePage === 'support'} 
          onClick={() => onNavigate('support')} 
        />
        <NavItem 
          icon={<Robot size={20} />} 
          label="AI Tools" 
          isActive={activePage === 'ai-tools'} 
          onClick={() => onNavigate('ai-tools')} 
        />
        <NavItem 
          icon={<Gear size={20} />} 
          label="Settings" 
          isActive={activePage === 'settings'} 
          onClick={() => onNavigate('settings')} 
        />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User size={18} />
          </div>
          <div>
            <p className="text-sm font-medium">Acme Corp</p>
            <p className="text-xs text-muted-foreground">Enterprise Plan</p>
          </div>
        </div>
        <Button variant="outline" className="w-full flex items-center gap-2" size="sm">
          <SignOut size={16} />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}