
import { useState, useEffect, useMemo, useCallback } from "react";
import { AuditTrailHeader } from "./AuditTrailHeader";
import { Timeline } from "./Timeline";
import { DetailPanel } from "./DetailPanel";
import { FilterPanel } from "./FilterPanel";
import { FilterOptions } from "./types/filterTypes";
import { AuditEntry } from "./TimelineEntry";
import { isWithinTimeframe } from "@/utils/validation";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { PanelLeft, Filter as FilterIcon, Users } from "lucide-react";

const generateMockData = (): AuditEntry[] => {
  const users = [
    { 
      name: "John Smith", 
      role: "Administrator", 
      ip: "192.168.1.105", 
      location: "Toronto, CA" 
    },
    { 
      name: "Emily Chen", 
      role: "Bankruptcy Specialist", 
      ip: "192.168.1.112", 
      location: "Vancouver, CA" 
    },
    { 
      name: "Michael Rodriguez", 
      role: "Auditor", 
      ip: "192.168.1.118", 
      location: "Montreal, CA" 
    }
  ];

  const documents = [
    { name: "Form 76 - Consumer Proposal", type: "Legal Document" },
    { name: "Form 65 - Assignment", type: "Bankruptcy Document" },
    { name: "Client 1423 Affidavit", type: "Legal Document" },
    { name: "Financial Statement 2023", type: "Financial Record" },
    { name: "Tax Assessment Report", type: "Financial Record" }
  ];

  const actionDetails = {
    upload: "Document was uploaded to the system. Hash verified and stored.",
    view: "Document was accessed and viewed. No changes were made.",
    edit: "Document content was modified. Changes recorded in version history.",
    delete: "Document was marked for deletion. Stored in deletion queue for 30 days.",
    risk_assessment: "Automated risk assessment was performed. Results stored in metadata."
  };

  const mockEntries: AuditEntry[] = [];
  
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const document = documents[Math.floor(Math.random() * documents.length)];
    const actionType = ['upload', 'view', 'edit', 'delete', 'risk_assessment'][Math.floor(Math.random() * 5)] as keyof typeof actionDetails;
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    mockEntries.push({
      id: `entry-${i}`,
      timestamp: date,
      user,
      actionType,
      documentName: document.name,
      documentType: document.type,
      details: actionDetails[actionType],
      metadata: actionType === 'risk_assessment' ? {
        riskScore: Math.floor(Math.random() * 100),
        issues: Math.random() > 0.7 ? ["Missing signature", "Incomplete fields"] : [],
        complianceStatus: Math.random() > 0.3 ? "compliant" : "non-compliant"
      } : undefined
    });
  }
  
  return mockEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const AuditTrailDashboard = () => {
  const [allEntries, setAllEntries] = useState<AuditEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [currentClientId, setCurrentClientId] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    actionTypes: new Set<string>(),
    timeframe: 'all',
    users: new Set<string>()
  });
  
  const fetchAuditData = useCallback(() => {
    return generateMockData();
  }, [currentClientId]);
  
  useEffect(() => {
    if (typeof window.requestIdleCallback === 'function') {
      const idleCallback = window.requestIdleCallback(() => {
        const mockData = fetchAuditData();
        setAllEntries(mockData);
        setFilteredEntries(mockData);
        setSelectedEntry(null);
      });
      
      return () => {
        if (typeof window.cancelIdleCallback === 'function') {
          window.cancelIdleCallback(idleCallback);
        }
      };
    } else {
      const mockData = fetchAuditData();
      setAllEntries(mockData);
      setFilteredEntries(mockData);
      setSelectedEntry(null);
    }
  }, [currentClientId, fetchAuditData]);
  
  const applyFilters = useCallback(() => {
    const filteredData = allEntries.filter(entry => {
      if (filters.actionTypes.size > 0 && !filters.actionTypes.has(entry.actionType)) {
        return false;
      }
      
      if (filters.users.size > 0 && !filters.users.has(entry.user.name)) {
        return false;
      }
      
      if (filters.timeframe !== 'all' && !isWithinTimeframe(entry.timestamp, filters.timeframe)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredEntries(filteredData);
    
    if (selectedEntry && !filteredData.find(e => e.id === selectedEntry.id)) {
      setSelectedEntry(null);
    }
  }, [filters, allEntries, selectedEntry]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      applyFilters();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [filters, applyFilters]);
  
  const handleClientChange = useCallback((clientId: number) => {
    setCurrentClientId(clientId);
  }, []);
  
  const handleEntrySelect = useCallback((entry: AuditEntry) => {
    setSelectedEntry(entry);
  }, []);
  
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-full container max-w-screen-2xl p-0">
      <div className="flex items-center justify-between h-14 border-b px-4 bg-white/80 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <button className="mr-2 rounded-md border p-2 hover:bg-accent flex items-center" aria-label="Select Client">
                <PanelLeft className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0">
              <div className="p-4">
                <span className="font-semibold text-sm text-muted-foreground mb-2 block">Select Client</span>
                <div>
                  <AuditTrailHeader onClientChange={setCurrentClientId} condensed />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <span className="text-lg font-bold">Audit Trail</span>
          <span className="ml-2 text-muted-foreground text-xs tracking-wide hidden md:inline">
            Chronological record of all system activity
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="rounded-md border px-2 py-1 hover:bg-accent flex items-center gap-1"
            aria-label="Filters"
          >
            <FilterIcon className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-medium">Filters</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex h-[calc(100vh-3.5rem)]">
        <div className="w-full md:w-[360px] border-r overflow-y-auto h-full bg-gradient-to-b from-muted/60 to-transparent">
          <Timeline
            entries={filteredEntries}
            onEntrySelect={handleEntrySelect}
            selectedEntryId={selectedEntry?.id}
            dense
          />
        </div>

        <div className="flex-1 min-w-0 overflow-y-auto h-full bg-card px-6">
          <DetailPanel entry={selectedEntry} compact />
        </div>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetContent side="right" className="w-[380px] p-0">
            <div className="p-5">
              <FilterPanel entries={allEntries} onFilterChange={handleFilterChange} />
            </div>
            <SheetClose asChild>
              <button className="absolute top-2 right-2 text-muted-foreground font-bold" aria-label="Close">×</button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
