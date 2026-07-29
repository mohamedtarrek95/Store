import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color?: string;
  loading?: boolean;
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue', loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <Skeleton className="h-4 w-24 mb-4" />
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={cn('rounded-lg p-2', colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend !== undefined && (
        <div className={cn('flex items-center gap-1 mt-1 text-xs', trend >= 0 ? 'text-green-600' : 'text-red-600')}>
          {trend >= 0 ? '+' : ''}{trend}% from last month
        </div>
      )}
    </div>
  );
}
