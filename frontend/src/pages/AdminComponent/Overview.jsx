import { useState, useEffect, useRef } from "react";

const useCountUp = (target, duration = 2000) => {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);

  return count;
};

const StatCard = ({ label, value, icon, delay, accentColor }) => {
  const count = useCountUp(value, 1800);

  return (
    <div
      style={{
        animationDelay: `${delay}ms`,
        "--accent": accentColor,
      }}
      className="stat-card"
    >
      <div className="card-inner">
        <div className="card-glow" />
        <div className="icon-wrap">{icon}</div>
        <div className="stat-value">{count}</div>
        <div className="stat-label">{label}</div>
        <div className="bottom-bar" />
      </div>
    </div>
  );
};

export default function Overview() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');

        .overview-root {
          font-family: 'Syne', sans-serif;
          background: #080c14;
          min-height: 100vh;
          padding: 48px 32px;
          position: relative;
          overflow: hidden;
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 {
          width: 400px; height: 400px;
          background: rgba(56, 189, 248, 0.07);
          top: -100px; left: -100px;
        }
        .orb-2 {
          width: 300px; height: 300px;
          background: rgba(139, 92, 246, 0.06);
          bottom: -80px; right: 50px;
        }
        .orb-3 {
          width: 200px; height: 200px;
          background: rgba(34, 211, 153, 0.05);
          top: 40%; left: 55%;
        }

        .section-header {
          position: relative;
          z-index: 1;
          margin-bottom: 40px;
          text-align: center;
        }

        .eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #38bdf8;
          margin-bottom: 10px;
          opacity: 0;
          animation: fadeSlideUp 0.6s ease forwards;
        }

        .section-title {
          font-size: 36px;
          font-weight: 800;
          color: #f0f6ff;
          letter-spacing: -0.02em;
          line-height: 1;
          opacity: 0;
          animation: fadeSlideUp 0.6s ease 0.1s forwards;
        }

        .title-accent {
          color: transparent;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #38bdf8, transparent);
          margin: 16px auto 0;
          opacity: 0;
          animation: fadeSlideUp 0.6s ease 0.2s forwards;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          opacity: 0;
          animation: cardReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .card-inner {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 32px 24px 28px;
          position: relative;
          overflow: hidden;
          cursor: default;
          transition: transform 0.3s ease, border-color 0.3s ease;
          backdrop-filter: blur(12px);
        }

        .card-inner:hover {
          transform: translateY(-4px);
          border-color: rgba(var(--accent-rgb, 56, 189, 248), 0.3);
        }

        .card-glow {
          position: absolute;
          top: -40px; left: 50%;
          transform: translateX(-50%);
          width: 120px; height: 120px;
          background: var(--accent, #38bdf8);
          opacity: 0.08;
          border-radius: 50%;
          filter: blur(30px);
          transition: opacity 0.3s ease;
        }

        .card-inner:hover .card-glow {
          opacity: 0.15;
        }

        .icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          margin-bottom: 20px;
        }

        .stat-value {
          font-family: 'DM Mono', monospace;
          font-size: 48px;
          font-weight: 500;
          color: #f0f6ff;
          line-height: 1;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .stat-label {
          font-size: 13px;
          font-weight: 400;
          color: #64748b;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .bottom-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent, #38bdf8), transparent);
          opacity: 0.4;
          border-radius: 0 0 20px 20px;
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="overview-root">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />

        <div className="section-header">
          <p className="eyebrow">Dashboard</p>
          <h1 className="section-title">
            System <span className="title-accent">Overview</span>
          </h1>
          <div className="divider" />
        </div>

        <div className="cards-grid">
          <StatCard
            label="Total Requests"
            value={100}
            icon="📥"
            delay={300}
            accentColor="#38bdf8"
          />
          <StatCard
            label="Total Volunteers"
            value={50}
            icon="🙌"
            delay={450}
            accentColor="#818cf8"
          />
          <StatCard
            label="Total Admins"
            value={10}
            icon="🛡️"
            delay={600}
            accentColor="#34d399"
          />
        </div>
      </div>
    </>
  );
}