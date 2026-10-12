/**
 * Shared types for the UX journeymapper skill.
 */

export type TechProficiency = "novice" | "intermediate" | "expert";

export const TECH_PROFICIENCY_VALUES: readonly TechProficiency[] = [
  "novice",
  "intermediate",
  "expert",
];

/** Persona input accepted by the map-user-journey tool. */
export interface Persona {
  name: string;
  role: string;
  goals: string[];
  painPoints?: string[];
  techProficiency?: TechProficiency;
}

export interface JourneyStage {
  stage: string;
  description: string;
  touchpoints: string[];
  emotions: string[];
  painPoints: string[];
  opportunities: string[];
}

/** One structured problem found by a validator. `path` is a JSON-style pointer-like key. */
export interface ValidationIssue {
  path: string;
  message: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; issues: ValidationIssue[] };

export interface JourneyMapSuccess extends Record<string, unknown> {
  success: true;
  persona: string;
  personaProfile?: Persona;
  goal: string;
  stages: JourneyStage[];
  summary: string;
  keyInsights: string[];
}

export interface JourneyMapFailure extends Record<string, unknown> {
  success: false;
  error: string;
  issues?: ValidationIssue[];
}

/** Output contract returned by the map-user-journey tool. */
export type JourneyMapResult = JourneyMapSuccess | JourneyMapFailure;
