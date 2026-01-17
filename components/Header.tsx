import Image from "next/image";
import { useTheme } from "./ThemeProvider";

export default function Header() {

  const { theme } = useTheme();
  return (
    <div className="header pt-24 pb-12 px-5 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl bg-indigo-500/20 dark:bg-indigo-400/20"></div>
      <div className="header-content relative z-10">
        <div className="logo text-6xl mb-3 animate-pulse">
          <Image
            src="/logo.webp"
            alt="GAITH TEAM Logo"
            width={192}
            height={192}
            className="w-48 h-48 border border-indigo-400/30 mx-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h1 className="text-5xl font-black mb-4 bg-linear-to-r from-indigo-400 to-pink-400 dark:from-indigo-600 dark:to-pink-600 bg-clip-text text-transparent leading-tight">
          GAITH TEAM
        </h1>
        <p className={`text-xl max-w-md mx-auto leading-relaxed ${theme==='dark' ? 'text-gray-300' : 'text-gray-700'} `}>
          الامتحان في جيبك - منصة متكاملة لاختبارات التمريض
        </p>
      </div>
    </div>
  );
}
