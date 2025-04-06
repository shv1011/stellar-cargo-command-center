
import { ActivityLog } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Package, 
  Grid, 
  Users, 
  Calendar, 
  Settings, 
  Activity,
  User
} from 'lucide-react';

interface ActivityLogItemProps {
  log: ActivityLog;
}

export function ActivityLogItem({ log }: ActivityLogItemProps) {
  const getIcon = () => {
    if (log.action.includes('Cargo')) {
      return <Package className="h-5 w-5" />;
    } else if (log.action.includes('Module')) {
      return <Grid className="h-5 w-5" />;
    } else if (log.action.includes('Astronaut')) {
      return <Users className="h-5 w-5" />;
    } else if (log.action.includes('Mission')) {
      return <Calendar className="h-5 w-5" />;
    } else if (log.action.includes('System')) {
      return <Settings className="h-5 w-5" />;
    } else {
      return <Activity className="h-5 w-5" />;
    }
  };

  const getUserInitials = (userId: string) => {
    return userId.split('-')[0].substring(0, 2).toUpperCase();
  };

  const getRelativeTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getActionColor = () => {
    if (log.action.includes('Created') || log.action.includes('Added')) {
      return 'text-green-500';
    } else if (log.action.includes('Deleted') || log.action.includes('Removed')) {
      return 'text-red-500';
    } else if (log.action.includes('Updated') || log.action.includes('Changed')) {
      return 'text-amber-500';
    } else {
      return 'text-blue-500';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="mt-0.5 h-9 w-9 border bg-accent">
            <AvatarFallback className="text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <div className="flex flex-col justify-between sm:flex-row sm:items-center">
              <p className="font-medium">
                <span className={`mr-2 ${getActionColor()}`}>{log.action}</span>
                <span className="text-muted-foreground text-sm">by User {getUserInitials(log.userId)}</span>
              </p>
              <time 
                className="text-xs text-muted-foreground"
                title={format(new Date(log.timestamp), 'PPpp')}
              >
                {getRelativeTime(log.timestamp)}
              </time>
            </div>
            
            <p className="text-sm text-muted-foreground">{log.details}</p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {getIcon()}
              <span>{format(new Date(log.timestamp), 'PPp')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
