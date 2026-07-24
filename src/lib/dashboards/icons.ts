import {
  BookOpen,
  CloudRain,
  HandHeart,
  HeartPulse,
  Landmark,
  Leaf,
  Shield,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { DashboardIconName } from "./types";

export const DASHBOARD_ICONS: Record<DashboardIconName, LucideIcon> = {
  leaf: Leaf,
  users: Users,
  "book-open": BookOpen,
  "heart-pulse": HeartPulse,
  "hand-heart": HandHeart,
  shield: Shield,
  sprout: Sprout,
  "cloud-rain": CloudRain,
  landmark: Landmark,
};
