"use client";
import { FaTelegramPlane, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { useTheme } from "./ThemeProvider";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`footer relative overflow-hidden border-t ${
      theme === "dark"
        ? "bg-gray-100 border-gray-700"
        : "bg-gray-50 border-gray-200"
    }`}>
      <div className={`absolute top-0 left-0 w-full h-full ${
        theme === "dark"
          ? "bg-linear-to-r from-gray-900 to-gray-800"
          : "bg-linear-to-br from-indigo-50 to-purple-50"
      }`}></div>
      <div className="footer-container relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="social-media flex justify-center gap-6 mb-8">
          <a
            href="https://t.me/nursing2bu"
            target="_blank"
            rel="noopener"
            className="social-icon telegram w-14 h-14 bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-indigo-500/30"
            title="انضم لقناتنا على Telegram"
          >
            <FaTelegramPlane size={20} />
          </a>
          <a
            href="mailto:info@gaithteam.com"
            className="social-icon email w-14 h-14 bg-linear-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
            title="راسلنا على البريد الإلكتروني"
          >
            <FaEnvelope size={20} />
          </a>
          <a
            href="#"
            className="social-icon whatsapp w-14 h-14 bg-linear-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-green-500/30"
            title="تواصل معنا على WhatsApp"
          >
            <FaWhatsapp size={20} />
          </a>
        </div>

        <div className={`copyright text-center rounded-2xl p-6 max-w-md mx-auto shadow-lg ${
          theme === "dark"
            ? "bg-white/5 backdrop-blur-lg border border-white/10"
            : "bg-white border border-gray-200"
        }`}>
          <p className={`text-lg font-semibold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}>
            جميع الحقوق محفوظة |{" "}
            <span id="currentYear">{new Date().getFullYear()}</span> GAITH TEAM
          </p>
          <p className={`subtitle ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            منصة اختبارات التمريض الإلكترونية
          </p>
        </div>
      </div>
    </footer>
  );
}
