import React from 'react';
import MenuItem from './menuItem';

interface MenuItemType {
    id: string;
    label: string;
    icon: string;
    href: string;
}

const menuItems: MenuItemType[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/account/admin' },
    { id: 'users', label: 'Admin Panel', icon: '👑', href: '/account/admin/users' },
    { id: 'listings', label: 'Projects', icon: '📁', href: '/account/admin/listings' },
    { id: 'tasks', label: 'Tasks', icon: '✓', href: '/account/admin/tasks' },
    { id: 'calendar', label: 'Calendar', icon: '📅', href: '/account/admin/calendar' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/account/admin/settings' },
];

const Sidepanel = () => {
    return (
        <aside className="bg-card text-card-foreground h-full w-fit shadow rounded-xl border">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-8">App Name</h1>
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <MenuItem key={item.id} {...item} />
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidepanel;