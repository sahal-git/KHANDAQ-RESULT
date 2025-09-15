import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResultEntry {
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

interface ResultCardProps {
  programCode: string;
  programName:string;
  programSection: string;
  entries: ResultEntry[];
}

const getTeamFullName = (teamCode: string): string => {
  const teamMap: { [key: string]: string } = {
    'AR': 'ALMARIA',
    'TD': 'TOLIDO', 
    'ZR': 'ZARAGOZA'
  };
  return teamMap[teamCode] || teamCode;
};

const getGradeColor = (grade: string): string => {
  switch (grade.toUpperCase()) {
    case 'A': return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700/50";
    case 'B': return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700/50";
    case 'C': return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700/50";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export const ResultCard = ({ programCode, programName, programSection, entries }: ResultCardProps) => {
  return (
    <div className="group rounded-lg h-full">
      <div className="gradient-border rounded-lg h-full">
        <Card className="overflow-hidden transition-all duration-300 flex flex-col h-full group-hover:-translate-y-1 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold tracking-tight text-foreground">{programName}</h3>
            <p className="text-sm font-semibold uppercase tracking-wider bg-gradient-primary bg-clip-text text-transparent">
              {programCode} • {programSection}
            </p>
          </div>
          
          <div className="flex-1 space-y-3">
            {entries.map((entry, index) => {
              const position = entry.position;
              let positionElement;

              const positionClasses = "text-3xl sm:text-4xl font-black w-12 text-center flex-shrink-0";

              if (position === '1') {
                positionElement = <div className={`${positionClasses} bg-gradient-to-br from-yellow-400 to-amber-500 bg-clip-text text-transparent`}>1</div>;
              } else if (position === '2') {
                positionElement = <div className={`${positionClasses} bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-transparent`}>2</div>;
              } else if (position === '3') {
                positionElement = <div className={`${positionClasses} bg-gradient-to-br from-amber-500 to-orange-600 bg-clip-text text-transparent`}>3</div>;
              } else if (position) {
                positionElement = <div className={`${positionClasses} text-muted-foreground/50`}>{position}</div>;
              } else {
                positionElement = <div className="w-12 flex-shrink-0" />;
              }

              return (
                <div 
                  key={`${entry.chestNo}-${index}`}
                  className="flex items-center gap-3"
                >
                  {positionElement}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{entry.candidateName}</p>
                    <p className="text-xs text-muted-foreground">
                      Chest: {entry.chestNo} • Team: {getTeamFullName(entry.teamCode)}
                    </p>
                  </div>
                  {entry.grade && (
                    <Badge 
                      variant="outline" 
                      className={`font-bold text-xs px-2 py-0.5 rounded-md ${getGradeColor(entry.grade)}`}
                    >
                      {entry.grade}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
