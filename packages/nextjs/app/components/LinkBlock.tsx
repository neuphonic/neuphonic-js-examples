import type React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LinkBlockProps {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function LinkBlock({
  href,
  title,
  description,
  icon
}: LinkBlockProps) {
  return (
    <Link href={href} className="block no-underline">
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900 shadow-lg transition-all duration-300 hover:border-purple-500 hover:shadow-purple-900/20 hover:shadow-xl">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            {icon && <div className="text-purple-500">{icon}</div>}
            <h3 className="font-semibold text-white text-lg">{title}</h3>
          </div>
          <p className="text-gray-400 mb-4">{description}</p>
          <div className="flex items-center text-purple-500 text-sm font-medium">
            <span>View</span>
            <ArrowRight size={16} className="ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
