import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, CheckCircle, Circle, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RewardTask {
  id: string;
  name: string;
  description: string;
  points: number;
  completed: boolean;
  icon: React.ReactNode;
}

export const DailyRewards = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<RewardTask[]>([
    {
      id: "login",
      name: "Daily Login",
      description: "Log in to Atlas Hedge",
      points: 1,
      completed: true,
      icon: <CheckCircle className="w-4 h-4 text-green-600" />
    },
    {
      id: "quiz",
      name: "Financial Quiz",
      description: "Complete daily finance quiz",
      points: 1,
      completed: false,
      icon: <Circle className="w-4 h-4 text-slate-400" />
    },
    {
      id: "portfolio",
      name: "Review Portfolio",
      description: "Check your portfolio dashboard",
      points: 1,
      completed: false,
      icon: <Circle className="w-4 h-4 text-slate-400" />
    },
    {
      id: "news",
      name: "Read Market News",
      description: "Stay updated with market insights",
      points: 1,
      completed: false,
      icon: <Circle className="w-4 h-4 text-slate-400" />
    },
    {
      id: "social",
      name: "Social Engagement",
      description: "Engage with the community",
      points: 1,
      completed: false,
      icon: <Circle className="w-4 h-4 text-slate-400" />
    }
  ]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = (completedTasks / totalTasks) * 100;
  const isAllCompleted = completedTasks === totalTasks;

  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true, icon: <CheckCircle className="w-4 h-4 text-green-600" /> } : task
    ));
    
    toast({
      title: "Task Completed!",
      description: "You earned 1 point towards your daily reward",
    });
  };

  const claimReward = () => {
    toast({
      title: "Daily Reward Claimed! 🎉",
      description: "You earned 1 free day token for Atlas Hedge Premium!",
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span>Daily Rewards</span>
          {isAllCompleted && <Badge className="bg-green-100 text-green-800">Ready to Claim!</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress: {completedTasks}/{totalTasks} tasks</span>
              <span className="text-sm text-slate-500">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg border transition-colors ${
                  task.completed ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {task.icon}
                  <span className="text-xs font-medium">{task.name}</span>
                </div>
                <p className="text-xs text-slate-600">{task.description}</p>
                {!task.completed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 text-xs"
                    onClick={() => completeTask(task.id)}
                  >
                    Complete
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isAllCompleted && (
            <div className="text-center pt-4 border-t">
              <Button 
                onClick={claimReward}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim Free Day Token
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};