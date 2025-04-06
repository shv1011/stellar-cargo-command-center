
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Activity, Search, Download, Filter } from 'lucide-react';
import { ActivityLogItem } from './ActivityLogItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ActivityPage() {
  const { activityLogs, searchQuery, setSearchQuery } = useData();
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('all');

  // Filter logs based on search query, action filter, and time range
  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter);

    let matchesTimeRange = true;
    if (timeRange !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      
      switch (timeRange) {
        case 'today':
          matchesTimeRange = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          matchesTimeRange = logDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          matchesTimeRange = logDate >= monthAgo;
          break;
        default:
          matchesTimeRange = true;
      }
    }
    
    return matchesSearch && matchesAction && matchesTimeRange;
  });

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'activity-logs.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get unique actions for the filter dropdown
  const uniqueActions = ['all', ...new Set(activityLogs.map(log => log.action))];

  return (
    <>
      <Helmet>
        <title>Activity Logs | Space Cargo Management</title>
      </Helmet>
      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <Button onClick={exportLogs} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={actionFilter}
                    onValueChange={setActionFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by action" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueActions.map(action => (
                        <SelectItem key={action} value={action}>
                          {action === 'all' ? 'All Actions' : action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={timeRange}
                    onValueChange={setTimeRange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-4">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <ActivityLogItem key={log.id} log={log} />
            ))
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div>
                <p className="text-lg font-medium">No activity logs found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ActivityPage;
