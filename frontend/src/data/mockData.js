// ============================================
// QuietSpace - Mock Data
// All dummy data used across the application
// No backend or database required
// ============================================

// --- User Profile ---
export const mockUser = {
  name: "Alex Johnson",
  email: "alex@student.edu",
  avatar: "AJ",
  joinDate: "January 2026",
  level: "Focus Pro",
};

// --- Dashboard Stats ---
export const dashboardStats = {
  dailyGoal: {
    target: 4,       // hours
    completed: 2.5,  // hours
    percentage: 63,
  },
  weeklyProgress: {
    target: 20,      // hours
    completed: 13.5, // hours
    percentage: 68,
  },
  studyStreak: {
    current: 7,      // days
    longest: 14,     // days
    lastStudied: "Today",
  },
  totalSessions: 42,
  totalHours: 87,
};

// --- Weekly Focus Hours (for Progress Chart) ---
export const weeklyFocusData = [
  { day: "Mon", hours: 2.5, sessions: 3 },
  { day: "Tue", hours: 3.0, sessions: 4 },
  { day: "Wed", hours: 1.5, sessions: 2 },
  { day: "Thu", hours: 4.0, sessions: 5 },
  { day: "Fri", hours: 2.0, sessions: 3 },
  { day: "Sat", hours: 0.5, sessions: 1 },
  { day: "Sun", hours: 0,   sessions: 0 },
];

// --- Tasks ---
export const initialTasks = [
  { id: 1, text: "Review Chapter 5 – Data Structures", completed: true,  priority: "high",   subject: "Computer Science" },
  { id: 2, text: "Complete Math Assignment #3",        completed: false, priority: "high",   subject: "Mathematics" },
  { id: 3, text: "Read Psychology lecture notes",      completed: false, priority: "medium", subject: "Psychology" },
  { id: 4, text: "Prepare presentation slides",        completed: true,  priority: "medium", subject: "Business" },
  { id: 5, text: "Practice coding problems on LeetCode", completed: false, priority: "low", subject: "Computer Science" },
  { id: 6, text: "Write essay introduction",           completed: false, priority: "high",   subject: "English" },
];

// --- AI Recommendations ---
export const aiRecommendations = [
  {
    id: 1,
    type: "focus",
    icon: "🎯",
    title: "Optimal Focus Duration",
    description: "Based on your session history, you perform best with 25-minute focus blocks followed by 5-minute breaks. Your concentration peaks between 9–11 AM.",
    tag: "Personalized",
    color: "#6C63FF",
  },
  {
    id: 2,
    type: "schedule",
    icon: "⏰",
    title: "Best Study Times",
    description: "Your data shows highest productivity on Tuesday and Thursday mornings. Schedule your most challenging tasks during these windows for maximum output.",
    tag: "Schedule",
    color: "#43D9AD",
  },
  {
    id: 3,
    type: "break",
    icon: "🧘",
    title: "Break Optimization",
    description: "You tend to skip breaks, which reduces focus quality by 30%. Try the 52/17 method — 52 minutes of work followed by a 17-minute break.",
    tag: "Wellness",
    color: "#FF6584",
  },
  {
    id: 4,
    type: "subject",
    icon: "📚",
    title: "Subject Rotation Strategy",
    description: "Alternating between Math and English every 2 sessions can improve retention by up to 40%. Avoid studying the same subject for more than 90 minutes.",
    tag: "Learning",
    color: "#FFB347",
  },
  {
    id: 5,
    type: "environment",
    icon: "🎵",
    title: "Focus Environment",
    description: "Students who use ambient sounds (lo-fi, white noise) report 25% better concentration. Try enabling background sounds during your next session.",
    tag: "Environment",
    color: "#4FC3F7",
  },
];

// --- Weekly Productivity Challenge ---
export const weeklyChallenge = {
  title: "7-Day Deep Focus Challenge",
  description: "Complete at least 3 focus sessions every day this week to build a powerful study habit.",
  progress: 4,   // days completed
  total: 7,
  reward: "🏆 Focus Master Badge",
  daysLeft: 3,
};

// --- Motivational Messages (shown during focus sessions) ---
export const motivationalMessages = [
  "Stay focused — every minute counts! 💪",
  "You're doing amazing. Keep going! 🌟",
  "Deep work creates deep results. 🎯",
  "Silence the noise. Own this moment. 🧘",
  "Progress, not perfection. One step at a time. 🚀",
  "Your future self will thank you for this. ✨",
  "Champions are built in moments like these. 🏆",
  "Breathe. Focus. Achieve. 🌿",
];

// --- Progress Milestones ---
export const milestones = [
  { id: 1, title: "First Session",     icon: "🌱", achieved: true,  description: "Completed your first focus session" },
  { id: 2, title: "3-Day Streak",      icon: "🔥", achieved: true,  description: "Studied 3 days in a row" },
  { id: 3, title: "7-Day Streak",      icon: "⚡", achieved: true,  description: "Studied 7 days in a row" },
  { id: 4, title: "10 Hours Focused",  icon: "⏱️", achieved: true,  description: "Accumulated 10 hours of focus time" },
  { id: 5, title: "25 Sessions",       icon: "🎯", achieved: true,  description: "Completed 25 focus sessions" },
  { id: 6, title: "14-Day Streak",     icon: "🏆", achieved: false, description: "Study 14 days in a row" },
  { id: 7, title: "50 Hours Focused",  icon: "💎", achieved: false, description: "Accumulate 50 hours of focus time" },
  { id: 8, title: "100 Sessions",      icon: "🚀", achieved: false, description: "Complete 100 focus sessions" },
];

// --- Suggested Study Times ---
export const suggestedStudyTimes = [
  { time: "9:00 AM – 11:00 AM", label: "Peak Focus",    score: 95, icon: "🌅" },
  { time: "2:00 PM – 4:00 PM",  label: "Good Focus",   score: 78, icon: "☀️" },
  { time: "7:00 PM – 9:00 PM",  label: "Moderate",     score: 65, icon: "🌙" },
  { time: "11:00 PM – 1:00 AM", label: "Low Energy",   score: 35, icon: "😴" },
];
