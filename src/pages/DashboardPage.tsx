import { useState, useMemo } from 'react';
import { useResultsData, ResultEntry } from '@/hooks/useResultsData';
import { FilterControls } from '@/components/FilterControls';
import { ResultCard } from '@/components/ResultCard';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, RefreshCw, PartyPopper, Filter } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { ResultCardSkeleton } from '@/components/ResultCardSkeleton';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { fireConfetti } from '@/lib/confetti';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const StatItem = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center p-2 text-center">
        <p className="text-2xl font-bold tracking-tighter sm:text-3xl">{value}</p>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
);

const DashboardPage = () => {
  const webappUrl = 'https://script.google.com/macros/s/AKfycbzYuQKwLM-z4iT8qemGv3r2HLGjDK-fiH6Hs04JbUkhrXsVAi4hB30VjTHml68FNFj6aA/exec';
  
  const { data, loading, error, refetch } = useResultsData({ webappUrl });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const { categories, teams } = useMemo(() => {
    const defaultTeams = ['AR: ALMARIA', 'TD: TOLIDO', 'ZR: ZARAGOZA'];
    const defaultCategories = ['SUB JUNIOR', 'JUNIOR', 'SENIOR', 'SUPER SENIOR'];

    return {
      categories: defaultCategories,
      teams: defaultTeams,
    };
  }, []);

  const hasAnyPublishedResults = useMemo(() => {
    return data.some(entry => entry.status && entry.status.toLowerCase() === 'published');
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(entry => {
      const matchesSearch = !searchTerm || 
        entry.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.teamCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.programCode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || entry.programSection === selectedCategory;
      const matchesTeam = selectedTeam === 'all' || selectedTeam.startsWith(entry.teamCode + ':');
      
      return matchesSearch && matchesCategory && matchesTeam;
    });
  }, [data, searchTerm, selectedCategory, selectedTeam]);

  const groupedData = useMemo(() => {
    const groups: Record<string, ResultEntry[]> = {};
    
    filteredData.forEach(entry => {
      const key = entry.programCode;
      if (!key) return;
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(entry);
    });
    
    // Filter groups to only include those with at least one "Published" status
    const filteredGroups: Record<string, ResultEntry[]> = {};
    Object.entries(groups).forEach(([key, entries]) => {
      const hasPublishedStatus = entries.some(entry => 
        entry.status && entry.status.toLowerCase() === 'published'
      );
      if (hasPublishedStatus) {
        filteredGroups[key] = entries;
      }
    });
    
    const allProgramCodes = new Set(data.map(item => item.programCode).filter(Boolean));

    // Sort the filtered groups by the latest entry (assuming later entries are more recent)
    const sortedGroupEntries = Object.entries(filteredGroups).sort((a, b) => {
      const getLatestIndex = (entries: ResultEntry[]) => {
        return Math.max(...entries.map(entry => 
          data.findIndex(dataEntry => 
            dataEntry.programCode === entry.programCode && 
            dataEntry.chestNo === entry.chestNo &&
            dataEntry.candidateName === entry.candidateName
          )
        ));
      };
      
      const latestIndexA = getLatestIndex(a[1]);
      const latestIndexB = getLatestIndex(b[1]);
      
      // Sort in descending order (latest entries first)
      return latestIndexB - latestIndexA;
    });

    const sortedGroups: Record<string, ResultEntry[]> = {};
    sortedGroupEntries.forEach(([key, entries]) => {
      sortedGroups[key] = entries;
    });
    return {
        groups: sortedGroups,
        uniqueProgramCount: allProgramCodes.size
    };
  }, [filteredData, data]);

  const renderResultsGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => <ResultCardSkeleton key={i} />)}
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error} onRetry={refetch} />;
    }

    if (data.length === 0 && !loading) {
      return (
        <div className="text-center py-16 rounded-lg border border-dashed">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results available yet</h3>
            <p className="text-muted-foreground mb-4">The celebration is about to begin! Check back soon.</p>
        </div>
      );
    }
    
    if (Object.keys(groupedData.groups).length > 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(groupedData.groups).map(([programCode, entries]) => {
                    const programInfo = entries[0];
                    return (
                        <ResultCard
                            key={programCode}
                            programCode={programCode}
                            programName={programInfo.programName}
                            programSection={programInfo.programSection}
                            entries={entries}
                        />
                    );
                })}
            </div>
        )
    }

    if (!hasAnyPublishedResults) {
      return (
        <div className="text-center py-16 rounded-lg border border-dashed">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Results Published Yet</h3>
            <p className="text-muted-foreground mb-4">The celebration is about to begin! Results are being tallied.</p>
        </div>
      );
    }

    return (
        <div className="text-center py-16 rounded-lg border border-dashed">
            <PartyPopper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No matching results</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for!</p>
        </div>
    );
  };
  
  const filterControlsComponent = (
    <FilterControls
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      selectedTeam={selectedTeam}
      onTeamChange={setSelectedTeam}
      categories={categories}
      teams={teams}
    />
  );

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg text-primary-foreground mr-3">
                <Trophy className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">KHANDAQ '25</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container pt-8 pb-6 text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Celebrate the Winners!
            </h1>
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                Witness the crowning moments of our festival! Explore live results, celebrate achievements, and feel the vibrant energy of the competition.
            </p>
        </section>

        <section className="container pb-16">
            <div className="space-y-8">
                {!loading && !error && data.length > 0 && (
                    <Card>
                        <CardContent className="p-4 space-y-4">
                            <div className="grid grid-cols-3 divide-x divide-border">
                                <StatItem label="Programs" value={groupedData.uniqueProgramCount} />
                                <StatItem label="Entries" value={data.length} />
                                <StatItem label="Teams" value={teams.length} />
                            </div>
                            <Separator />
                            <div className="hidden md:block">
                                {filterControlsComponent}
                            </div>
                            <div className="md:hidden">
                                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <Filter className="mr-2 h-4 w-4" />
                                            Filter Results
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="rounded-t-lg max-h-[80vh] flex flex-col">
                                        <SheetHeader className="p-4 border-b">
                                            <SheetTitle>Filter Results</SheetTitle>
                                        </SheetHeader>
                                        <div className="p-4 overflow-y-auto">
                                            {filterControlsComponent}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="pt-4">
                    {renderResultsGrid()}
                </div>
            </div>
        </section>
      </main>

      <footer className="py-6 border-t bg-background/80 backdrop-blur-lg">
          <div className="container flex items-center justify-center">
              <p className="text-sm text-muted-foreground text-center">
                  © 2025 KHANDAQ '25. Let the celebrations continue!
              </p>
          </div>
      </footer>

      {/* Floating Action Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={fireConfetti}
            disabled={loading}
            className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full shadow-lg bg-gradient-primary text-primary-foreground transition-transform hover:scale-110 active:scale-100"
            size="icon"
          >
            <PartyPopper className="h-7 w-7" />
            <span className="sr-only">Celebrate</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Let's Celebrate!</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default DashboardPage;
