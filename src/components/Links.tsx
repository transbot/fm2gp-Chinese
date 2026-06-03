import React from 'react';

interface LinksProps {
  lang: 'en' | 'zh';
}

export function Links({ lang }: LinksProps) {
  const links = {
    en: {
      blog: "Zhou Jing's Blog",
      github: "GitHub"
    },
    zh: {
      blog: "周靖的博客",
      github: "GitHub"
    }
  };

  const t = links[lang];

  return (
    <div className="mt-8 text-sm text-gray-600">
      <div className="flex gap-4 justify-center">
        <a 
          href="https://bookzhou.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        > 
          {t.blog}
        </a>
        <a 
          href="https://github.com/transbot/fm2gp-Chinese" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          {t.github}
        </a>
      </div>
    </div>
  );
}