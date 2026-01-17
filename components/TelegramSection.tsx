import Link from 'next/link';
import { FaTelegramPlane } from 'react-icons/fa';

export default function TelegramSection() {
  return (
    <div className=" text-center mb-12 fade-in">
      <Link
        href="https://t.me/nursing2bu"
        target="_blank"
        rel="noopener"
        className=" inline-flex items-center gap-4 bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-indigo-500/50"
      >
        <FaTelegramPlane size={24} />
        انضم إلينا على Telegram
      </Link>
    </div>
  );
}
