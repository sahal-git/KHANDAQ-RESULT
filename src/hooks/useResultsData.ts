import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ResultEntry {
  position: string;
  chestNo: string;
  candidateName: string;
  teamCode: string;
  grade: string;
  status: string;
  programCode: string;
  programName: string;
  programSection: string;
}

interface UseResultsDataProps {
  webappUrl: string;
}

export const useResultsData = ({ webappUrl }: UseResultsDataProps) => {
  const [data, setData] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const csvToJson = (csvText: string): ResultEntry[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const toCamelCase = (str: string) => 
      str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

    const headers = lines[0].split(',').map(h => toCamelCase(h.trim().replace(/"/g, '')));
    const data: ResultEntry[] = [];
    
    let currentProgramInfo = {};

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      let entry: any = {};
      
      headers.forEach((header, index) => {
        entry[header] = values[index] || '';
      });

      // Ensure grade is from the 5th column (index 4)
      entry.grade = values[4] || '';
      // Ensure status is from the 15th column (index 14)
      entry.status = values[14] || '';
      // Ensure position is from the 3rd column (index 2)
      entry.position = values[2] || '';

      if (entry.programCode && entry.programCode.trim() !== '') {
        currentProgramInfo = {
          programCode: entry.programCode,
          programName: entry.name,
          programSection: entry.section
        };
      }
      
      entry.programCode = (currentProgramInfo as any).programCode;
      entry.programName = (currentProgramInfo as any).programName;
      entry.programSection = (currentProgramInfo as any).programSection;

      // Only add entries that represent an actual participant result
      if (entry.candidateName && entry.candidateName.trim() !== '') {
        data.push(entry as ResultEntry);
      }
    }
    
    return data;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(webappUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const csvText = await response.text();
      if (!csvText) {
        throw new Error("No data received from the server.");
      }
      
      const jsonData = csvToJson(csvText);
      
      setData(jsonData);
      
      if (jsonData.length > 0) {
        toast({
          title: "Data loaded successfully",
          description: `Found ${jsonData.length} result entries`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Failed to load data",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (webappUrl) {
      fetchData();
    }
  }, [webappUrl]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
