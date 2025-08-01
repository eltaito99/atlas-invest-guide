import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Calculate target date (2 months from today)
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 2);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 shadow-2xl">
      <CardContent className="p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Next Platform Release</h3>
        <p className="text-slate-300 mb-6">Enhanced AI features coming soon</p>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-4xl font-bold text-white mb-1">{formatNumber(timeLeft.days)}</div>
            <div className="text-sm text-slate-300 uppercase tracking-wide">Days</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-4xl font-bold text-white mb-1">{formatNumber(timeLeft.hours)}</div>
            <div className="text-sm text-slate-300 uppercase tracking-wide">Hours</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-4xl font-bold text-white mb-1">{formatNumber(timeLeft.minutes)}</div>
            <div className="text-sm text-slate-300 uppercase tracking-wide">Minutes</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-4xl font-bold text-white mb-1">{formatNumber(timeLeft.seconds)}</div>
            <div className="text-sm text-slate-300 uppercase tracking-wide">Seconds</div>
          </div>
        </div>
        
        <div className="text-slate-400 text-sm">
          Stay tuned for advanced portfolio optimization and AI-driven insights
        </div>
      </CardContent>
    </Card>
  );
};