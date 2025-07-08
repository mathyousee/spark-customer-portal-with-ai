import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Toaster } from 'sonner';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Invoices } from './components/Invoices';
import { Support } from './components/Support';
import { Settings } from './components/Settings';
import { Sheet, SheetContent } from './components/ui/sheet';
import { List, X } from '@phosphor-icons/react';
import { Button } from './components/ui/button';

function App() {
  // Use persisted state for active page
  const [activePage, setActivePage] = useKV("active-page", "dashboard");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    setIsMobileNavOpen(false);
  };
  
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'invoices':
        return <Invoices />;
      case 'support':
        return <Support />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <div className="hidden md:flex md:w-64 h-screen">
          <Navbar activePage={activePage} onNavigate={handleNavigate} />
        </div>
        
        {/* Mobile sidebar */}
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetContent side="left" className="p-0">
            <Navbar activePage={activePage} onNavigate={handleNavigate} />
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden border-b px-4 h-14 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-primary">Customer Portal</h1>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileNavOpen(true)}>
              <List size={24} />
            </Button>
          </div>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      
      <Toaster position="top-right" />
    </>
  );
}

export default App;