interface StatsBannerProps {
  stats: {
    quizCount: number;
    questionCount: number;
    userCount: number;
  };
}

export default function StatsBanner({ stats }: StatsBannerProps) {
  return (
    <div className="stats-banner bg-linear-to-r from-indigo-500/10 to-indigo-500/10 rounded-2xl p-6 mb-8 flex justify-around text-center border border-white/5">
      <div className="stat-item">
        <div className="stat-number text-3xl font-bold text-indigo-400 mb-2">{stats.quizCount}</div>
        <div className="stat-label text-white/70">كويز متاح</div>
      </div>
      <div className="stat-item">
        <div className="stat-number text-3xl font-bold text-green-400 mb-2">{stats.questionCount}</div>
        <div className="stat-label text-white/70">سؤال</div>
      </div>
      <div className="stat-item">
        <div className="stat-number text-3xl font-bold text-indigo-400 mb-2">{stats.userCount}</div>
        <div className="stat-label text-white/70">مستخدم</div>
      </div>
    </div>
  );
}
