import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import { Languages } from 'lucide-react';

export function AgentCard({
  id,
  name,
  lang,
  greet,
  image
}: {
  id: string;
  name: string;
  lang: string;
  greet?: string;
  image: StaticImageData;
}) {
  return (
    <Link href={`/talk/${id}`}>
      <div className="w-[225px] rounded-3xl overflow-hidden relative bg-black shadow-xl cursor-pointer">
        <div className="relative aspect-square flex">
          <div className="absolute inset-0">
            <Image src={image} alt="" />
          </div>

          <div className="relative pt-5 mt-auto flex flex-col justify-end w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            <div className="p-5 text-white relative z-10">
              <h2 className="text-2xl font-bold mb-2">{name}</h2>

              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1.5">
                  <Languages/>
                  <span>{lang}</span>
                </div>
              </div>
              <p className="text-sm font-mono leading-tight">{greet}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
