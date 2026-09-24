import {
  CalendarDays,
  CircleCheck,
  MessageCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type TimelineEvent = {
  date: string;
  description: string;
  icon: LucideIcon;
  title: string;
};

export const contactProfile = {
  name: "Mohab Ali",
  avatarUrl: "https://github.com/shadcn.png",
  initials: "MA",
  phone: "+20 120 839 2186",
  source: "LinkedIn",
  status: "Qualified",
  assignedTo: "Mohab",
  firstContact: "Today",
  label: "Qualified lead",
  deal: {
    name: "Website redesign",
    value: "12.4k",
  },
  timeline: [
    {
      date: "Today, 10:24 AM",
      description: "Mohab Ali was added to your contacts.",
      icon: UserRound,
      title: "Contact created",
    },
    {
      date: "Today, 10:31 AM",
      description: "A conversation was started in Inbox.",
      icon: MessageCircle,
      title: "First conversation",
    },
    {
      date: "Today, 10:42 AM",
      description: "Contact moved to Qualified.",
      icon: CircleCheck,
      title: "Status updated",
    },
    {
      date: "Tomorrow, 9:00 AM",
      description: "Follow up with Mohab Ali.",
      icon: CalendarDays,
      title: "Follow-up scheduled",
    },
  ] satisfies TimelineEvent[],
};
