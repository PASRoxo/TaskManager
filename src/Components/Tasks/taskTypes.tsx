import { Task } from "../../Features/tasksSlice";

export interface SimpleTask extends Task {
    type: "simple_task";
    priority: "low" | "medium" | "high";
    description: string;
}

export interface Project extends Task {
    type: "project";
    priority: "low" | "medium" | "high";
    description: string;
    startDate: string;
    endDate: string;
}

export interface Meeting extends Task {
    type: "meeting";
    date: string;
    time: string;
    duration?: number;
}

export interface FollowUpTask extends Task {
    type: "follow_up_task";
    meeting: string;
}
