'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '../utils/store';
import type { Notification, NotificationType } from '../utils/store';
import { cn } from '@/lib/utils';

const actionRoutes: Record<string, string> = {
  'view-orders': '/dashboard/orders',
  view: '/dashboard/workspaces',
  'view-product': '/dashboard/product',
  billing: '/dashboard/billing',
  open: '/dashboard/kanban',
  'open-chat': '/dashboard/chat'
};

function typeIcon(type?: NotificationType) {
  switch (type) {
    case 'order':
      return <Icons.billing className='h-4 w-4' />;
    case 'product':
      return <Icons.product className='h-4 w-4' />;
    default:
      return <Icons.notification className='h-4 w-4' />;
  }
}

function typeColor(type?: NotificationType) {
  switch (type) {
    case 'order':
      return 'bg-green-500/10 text-green-600 dark:text-green-400';
    case 'product':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

function typeLabel(type?: NotificationType) {
  switch (type) {
    case 'order': return 'Order';
    case 'product': return 'Product';
    default: return 'System';
  }
}

const formatDate = (date: string): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

function NotificationRow({ notification }: { notification: Notification }) {
  const { markAsRead, removeNotification } = useNotificationStore();
  const router = useRouter();
  const isUnread = notification.status === 'unread';

  return (
    <div
      className={cn(
        'group relative flex gap-4 rounded-xl p-4 transition-colors',
        isUnread ? 'bg-muted' : 'bg-muted/30 hover:bg-muted/50'
      )}
    >
      {/* Type icon */}
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', typeColor(notification.type))}>
        {typeIcon(notification.type)}
      </div>

      {/* Content */}
      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2 flex-wrap'>
            <p className={cn('text-sm font-semibold leading-tight', !isUnread && 'text-muted-foreground')}>
              {notification.title}
            </p>
            {isUnread && <span className='h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0' />}
            <Badge variant='outline' className='text-[10px] px-1.5 py-0 h-4'>
              {typeLabel(notification.type)}
            </Badge>
          </div>
          <span className='text-muted-foreground/60 shrink-0 text-[11px]'>
            {formatDate(notification.createdAt)}
          </span>
        </div>

        <p className={cn('mt-0.5 text-sm', isUnread ? 'text-muted-foreground' : 'text-muted-foreground/60')}>
          {notification.body}
        </p>

        {/* Actions */}
        {notification.actions && notification.actions.length > 0 && (
          <div className='mt-2 flex flex-wrap gap-2'>
            {notification.actions.map((action) => (
              <button
                key={action.id}
                type='button'
                onClick={() => {
                  const route = actionRoutes[action.id];
                  if (route) {
                    markAsRead(notification.id);
                    router.push(route);
                  }
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors',
                  action.style === 'primary'
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'bg-accent text-muted-foreground hover:text-foreground'
                )}
              >
                {action.label}
                <Icons.externalLink className='h-3 w-3' />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right-side actions (appear on hover) */}
      <div className='flex shrink-0 flex-col items-end gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
        {isUnread && (
          <button
            type='button'
            onClick={() => markAsRead(notification.id)}
            className='rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground'
            title='Mark as read'
          >
            <Icons.check className='h-3.5 w-3.5' />
          </button>
        )}
        <button
          type='button'
          onClick={() => removeNotification(notification.id)}
          className='rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
          title='Dismiss'
        >
          <Icons.close className='h-3.5 w-3.5' />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className='flex flex-col items-center justify-center py-20 text-center'>
      <div className='bg-muted flex h-14 w-14 items-center justify-center rounded-full mb-4'>
        <Icons.notification className='text-muted-foreground/50 h-6 w-6' />
      </div>
      <p className='font-medium text-sm'>No {label}</p>
      <p className='text-muted-foreground text-xs mt-1'>
        {label === 'notifications' ? 'New orders and events will appear here.' : `No ${label} right now.`}
      </p>
    </div>
  );
}

export default function NotificationsPage() {
  const { notifications, markAllAsRead, unreadCount } = useNotificationStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Use empty arrays until mounted so server HTML matches client initial render
  const liveNotifications = mounted ? notifications : [];
  const count = mounted ? unreadCount() : 0;

  const unreadNotifications = liveNotifications.filter((n) => n.status === 'unread');
  const readNotifications = liveNotifications.filter((n) => n.status === 'read');
  const orderNotifications = liveNotifications.filter((n) => n.type === 'order');

  const renderList = (items: Notification[], emptyLabel: string) => {
    if (items.length === 0) return <EmptyState label={emptyLabel} />;
    return (
      <div className='space-y-2'>
        {items.map((n) => <NotificationRow key={n.id} notification={n} />)}
      </div>
    );
  };

  return (
    <PageContainer
      pageTitle='Notifications'
      pageDescription='View and manage all your notifications.'
      pageHeaderAction={
        count > 0 ? (
          <Button variant='outline' size='sm' onClick={markAllAsRead}>
            <Icons.check className='mr-2 h-3.5 w-3.5' />
            Mark all as read
          </Button>
        ) : undefined
      }
    >
      <Tabs defaultValue='all'>
        <TabsList>
          <TabsTrigger value='all'>
            All
            {liveNotifications.length > 0 && (
              <span className='ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums'>
                {liveNotifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value='unread'>
            Unread
            {unreadNotifications.length > 0 && (
              <span className='ml-1.5 rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums'>
                {unreadNotifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value='orders'>
            Orders
            {orderNotifications.length > 0 && (
              <span className='ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums'>
                {orderNotifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value='read'>Read</TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='mt-4'>
          {renderList(liveNotifications, 'notifications')}
        </TabsContent>
        <TabsContent value='unread' className='mt-4'>
          {renderList(unreadNotifications, 'unread notifications')}
        </TabsContent>
        <TabsContent value='orders' className='mt-4'>
          {renderList(orderNotifications, 'order notifications')}
        </TabsContent>
        <TabsContent value='read' className='mt-4'>
          {renderList(readNotifications, 'read notifications')}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
