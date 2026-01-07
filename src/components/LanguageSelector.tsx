import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SUPPORTED_LANGUAGES, saveLanguage, SupportedLanguage } from '@/i18n';

// SVG flag components for each supported language
const FlagIcon: React.FC<{ code: string; className?: string }> = ({ code, className = "w-5 h-4" }) => {
  const flags: Record<string, React.ReactNode> = {
    ES: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#c60b1e" d="M0 0h640v480H0z"/>
        <path fill="#ffc400" d="M0 120h640v240H0z"/>
      </svg>
    ),
    GL: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#fff" d="M0 0h640v480H0z"/>
        <path fill="#0091da" d="M0 200h640v80H0z"/>
        <path fill="#0091da" d="M280 0h80v480h-80z"/>
      </svg>
    ),
    AST: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#0091da" d="M0 0h640v480H0z"/>
        <path fill="#fcdd09" d="M280 200h80v80h-80z"/>
        <g fill="#fcdd09">
          <circle cx="320" cy="160" r="15"/>
          <circle cx="360" cy="200" r="15"/>
          <circle cx="360" cy="280" r="15"/>
          <circle cx="320" cy="320" r="15"/>
          <circle cx="280" cy="280" r="15"/>
          <circle cx="280" cy="200" r="15"/>
        </g>
      </svg>
    ),
    EU: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#d52b1e" d="M0 0h640v480H0z"/>
        <path fill="#009b48" d="M0 200h640v80H0z"/>
        <path fill="#009b48" d="M280 0h80v480h-80z"/>
        <path fill="#fff" d="M300 220h40v40h-40z"/>
      </svg>
    ),
    CA: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#fcdd09" d="M0 0h640v480H0z"/>
        <path fill="#da121a" d="M0 0h640v107H0zM0 373h640v107H0zM0 160h640v53H0zM0 267h640v53H0z"/>
      </svg>
    ),
    OC: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#fff" d="M0 0h640v480H0z"/>
        <path fill="#da121a" d="M0 160h640v160H0z"/>
        <circle fill="#da121a" cx="320" cy="240" r="60"/>
      </svg>
    ),
    AD: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#0018a8" d="M0 0h213v480H0z"/>
        <path fill="#fedf00" d="M213 0h214v480H213z"/>
        <path fill="#d0103a" d="M427 0h213v480H427z"/>
      </svg>
    ),
    GB: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#012169" d="M0 0h640v480H0z"/>
        <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
        <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
        <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
        <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
      </svg>
    ),
    FR: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#002654" d="M0 0h213v480H0z"/>
        <path fill="#fff" d="M213 0h214v480H213z"/>
        <path fill="#ce1126" d="M427 0h213v480H427z"/>
      </svg>
    ),
    DE: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#000" d="M0 0h640v160H0z"/>
        <path fill="#D00" d="M0 160h640v160H0z"/>
        <path fill="#FFCE00" d="M0 320h640v160H0z"/>
      </svg>
    ),
    IT: (
      <svg className={className} viewBox="0 0 640 480">
        <path fill="#009246" d="M0 0h213v480H0z"/>
        <path fill="#fff" d="M213 0h214v480H213z"/>
        <path fill="#ce2b37" d="M427 0h213v480H427z"/>
      </svg>
    ),
  };

  return <span className="inline-block rounded overflow-hidden shadow-sm border border-border/50">{flags[code] || <Globe className="w-4 h-4" />}</span>;
};

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    i18n.changeLanguage(langCode);
    saveLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 px-3">
          <FlagIcon code={currentLang.flag} />
          <span className="hidden sm:inline text-sm">{currentLang.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              i18n.language === lang.code ? 'bg-primary/10 text-primary' : ''
            }`}
          >
            <FlagIcon code={lang.flag} />
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
