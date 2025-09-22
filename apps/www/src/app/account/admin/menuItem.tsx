import Link from 'next/link';
import React from 'react';

interface MenuItemProps {
    label: string;
    icon: string;
    href: string;
}

const MenuItem = ({ label, icon, href }: MenuItemProps) => {
    return (
        <li>
            <Link
                href={href}
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
                <span className="mr-3">{icon}</span>
                <span>{label}</span>
            </Link>
        </li>
    );
};

export default MenuItem;