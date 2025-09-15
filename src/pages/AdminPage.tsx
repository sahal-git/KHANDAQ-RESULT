import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useResultsData } from '@/hooks/useResultsData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, LogOut, ShieldCheck, ShieldOff } from 'lucide-react';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';

interface ProgramStatus {
  program_code: string;
  is_published: boolean;
}

const AdminPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const webappUrl = 'https://script.google.com/macros/s/AKfycbzYuQKwLM-z4iT8qemGv3r2HLGjDK-fiH6Hs04JbUkhrXsVAi4hB30VjTHml68FNFj6aA/exec';
  
  const { data: resultsData, loading: resultsLoading } = useResultsData({ webappUrl });
  const [statuses, setStatuses] = useState<ProgramStatus[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    setLoadingStatuses(true);
    const { data, error } = await supabase.from('program_status').select('program_code, is_published');
    if (error) {
      toast.error('Failed to fetch statuses', { description: error.message });
    } else {
      setStatuses(data || []);
    }
    setLoadingStatuses(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
    toast.info('You have been logged out.');
  };

  const uniquePrograms = useMemo(() => {
    const programs = new Map<string, { name: string; section: string }>();
    resultsData.forEach(item => {
      if (item.programCode && !programs.has(item.programCode)) {
        programs.set(item.programCode, { name: item.programName, section: item.programSection });
      }
    });
    return Array.from(programs.entries()).map(([code, { name, section }]) => ({ code, name, section }));
  }, [resultsData]);

  const combinedData = useMemo(() => {
    return uniquePrograms.map(program => {
      const status = statuses.find(s => s.program_code === program.code);
      return {
        ...program,
        is_published: status ? status.is_published : false,
      };
    }).sort((a, b) => a.code.localeCompare(b.code));
  }, [uniquePrograms, statuses]);

  const handleStatusChange = async (program_code: string, is_published: boolean) => {
    setIsUpdating(program_code);
    const { error } = await supabase
      .from('program_status')
      .upsert({ program_code, is_published, updated_at: new Date().toISOString() }, { onConflict: 'program_code' });
    
    setIsUpdating(null);
    if (error) {
      toast.error(`Failed to update ${program_code}`, { description: error.message });
    } else {
      toast.success(`${program_code} has been ${is_published ? 'published' : 'unpublished'}.`);
      setStatuses(prev => {
        const existing = prev.find(s => s.program_code === program_code);
        if (existing) {
          return prev.map(s => s.program_code === program_code ? { ...s, is_published } : s);
        }
        return [...prev, { program_code, is_published }];
      });
    }
  };

  const handleBulkUpdate = async (publish: boolean) => {
    setIsBulkUpdating(true);
    const updates = uniquePrograms.map(p => ({
      program_code: p.code,
      is_published: publish,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('program_status').upsert(updates, { onConflict: 'program_code' });

    setIsBulkUpdating(false);
    if (error) {
      toast.error('Bulk update failed', { description: error.message });
    } else {
      toast.success(`All programs have been ${publish ? 'published' : 'unpublished'}.`);
      fetchStatuses(); // Refetch all statuses
    }
  };

  const isLoading = resultsLoading || loadingStatuses;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Manage Programs</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleBulkUpdate(true)} disabled={isBulkUpdating || isLoading}>
                {isBulkUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Publish All
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleBulkUpdate(false)} disabled={isBulkUpdating || isLoading}>
                 {isBulkUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldOff className="mr-2 h-4 w-4" />}
                Unpublish All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Program</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {combinedData.map(item => (
                      <TableRow key={item.code}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.code} • {item.section}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.is_published ? 'default' : 'secondary'}>
                            {item.is_published ? 'Published' : 'Offline'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            {isUpdating === item.code && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            <Switch
                              checked={item.is_published}
                              onCheckedChange={(checked) => handleStatusChange(item.code, checked)}
                              disabled={isUpdating === item.code || isBulkUpdating}
                              aria-label={`Toggle publication status for ${item.name}`}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {combinedData.length === 0 && !isLoading && (
              <div className="text-center py-16 text-muted-foreground">No programs found from data source.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPage;
