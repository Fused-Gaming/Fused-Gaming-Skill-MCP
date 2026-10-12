/**
 * Validators for persona input and the journey map output contract.
 * Validators never throw; they return a structured result.
 */

import {
  TECH_PROFICIENCY_VALUES,
  type JourneyMapResult,
  type JourneyMapSuccess,
  type Persona,
  type ValidationIssue,
  type ValidationResult,
} from "./types.js";

const PERSONA_KEYS = new Set(["name", "role", "goals", "painPoints", "techProficiency"]);
const MAX_NAME_LENGTH = 120;
const MAX_LIST_ITEMS = 20;
const MAX_ITEM_LENGTH = 300;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkString(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  maxLength: number
): value is string {
  if (typeof value !== "string") {
    issues.push({ path, message: "must be a string" });
    return false;
  }
  if (value.trim().length === 0) {
    issues.push({ path, message: "must not be empty" });
    return false;
  }
  if (value.length > maxLength) {
    issues.push({ path, message: `must be at most ${maxLength} characters` });
    return false;
  }
  return true;
}

function checkStringList(
  value: unknown,
  path: string,
  issues: ValidationIssue[],
  minItems: number
): value is string[] {
  if (!Array.isArray(value)) {
    issues.push({ path, message: "must be an array of strings" });
    return false;
  }
  if (value.length < minItems) {
    issues.push({ path, message: `must contain at least ${minItems} item(s)` });
  }
  if (value.length > MAX_LIST_ITEMS) {
    issues.push({ path, message: `must contain at most ${MAX_LIST_ITEMS} items` });
  }
  let allValid = true;
  value.forEach((item, index) => {
    if (!checkString(item, `${path}[${index}]`, issues, MAX_ITEM_LENGTH)) {
      allValid = false;
    }
  });
  return allValid && value.length >= minItems && value.length <= MAX_LIST_ITEMS;
}

/**
 * Validates persona input. Unknown keys are reported as issues so typos
 * (for example `painPoint`) do not pass silently.
 */
export function validatePersona(input: unknown): ValidationResult<Persona> {
  const issues: ValidationIssue[] = [];

  if (!isPlainObject(input)) {
    return {
      ok: false,
      error: "persona must be an object",
      issues: [{ path: "persona", message: "must be an object" }],
    };
  }

  for (const key of Object.keys(input)) {
    if (!PERSONA_KEYS.has(key)) {
      issues.push({ path: `persona.${key}`, message: "unknown field" });
    }
  }

  const name = input.name;
  const role = input.role;
  const goals = input.goals;
  const painPoints = input.painPoints;
  const techProficiency = input.techProficiency;

  const nameOk = checkString(name, "persona.name", issues, MAX_NAME_LENGTH);
  const roleOk = checkString(role, "persona.role", issues, MAX_NAME_LENGTH);
  const goalsOk = checkStringList(goals, "persona.goals", issues, 1);

  let painPointsOk = true;
  if (painPoints !== undefined) {
    painPointsOk = checkStringList(painPoints, "persona.painPoints", issues, 0);
  }

  let techOk = true;
  if (techProficiency !== undefined) {
    if (
      typeof techProficiency !== "string" ||
      !(TECH_PROFICIENCY_VALUES as readonly unknown[]).includes(techProficiency)
    ) {
      techOk = false;
      issues.push({
        path: "persona.techProficiency",
        message: `must be one of: ${TECH_PROFICIENCY_VALUES.join(", ")}`,
      });
    }
  }

  if (issues.length > 0 || !nameOk || !roleOk || !goalsOk || !painPointsOk || !techOk) {
    return { ok: false, error: "persona failed validation", issues };
  }

  const value: Persona = {
    name: name as string,
    role: role as string,
    goals: goals as string[],
  };
  if (painPoints !== undefined) {
    value.painPoints = painPoints as string[];
  }
  if (techProficiency !== undefined) {
    value.techProficiency = techProficiency as Persona["techProficiency"];
  }
  return { ok: true, value };
}

function validateStage(value: unknown, index: number, issues: ValidationIssue[]): void {
  const base = `stages[${index}]`;
  if (!isPlainObject(value)) {
    issues.push({ path: base, message: "must be an object" });
    return;
  }
  checkString(value.stage, `${base}.stage`, issues, MAX_NAME_LENGTH);
  checkString(value.description, `${base}.description`, issues, MAX_ITEM_LENGTH);
  checkStringList(value.touchpoints, `${base}.touchpoints`, issues, 1);
  checkStringList(value.emotions, `${base}.emotions`, issues, 1);
  checkStringList(value.painPoints, `${base}.painPoints`, issues, 1);
  checkStringList(value.opportunities, `${base}.opportunities`, issues, 1);
}

/**
 * Validates a value against the journey map output contract.
 * Success results must carry at least one stage; each stage must carry
 * touchpoints, emotions, pain points and opportunities.
 */
export function validateJourneyMap(value: unknown): ValidationResult<JourneyMapResult> {
  const issues: ValidationIssue[] = [];

  if (!isPlainObject(value)) {
    return {
      ok: false,
      error: "journey map must be an object",
      issues: [{ path: "$", message: "must be an object" }],
    };
  }

  if (typeof value.success !== "boolean") {
    return {
      ok: false,
      error: "journey map has no boolean success flag",
      issues: [{ path: "success", message: "must be a boolean" }],
    };
  }

  if (value.success === false) {
    checkString(value.error, "error", issues, 1000);
    if (issues.length > 0) {
      return { ok: false, error: "journey map failure is malformed", issues };
    }
    return { ok: true, value: value as unknown as JourneyMapResult };
  }

  checkString(value.persona, "persona", issues, MAX_NAME_LENGTH);
  checkString(value.goal, "goal", issues, MAX_ITEM_LENGTH);
  checkString(value.summary, "summary", issues, 1000);
  checkStringList(value.keyInsights, "keyInsights", issues, 1);

  // personaProfile is optional, but when present it must satisfy the persona contract
  // so consumers can rely on its fields after narrowing.
  if (value.personaProfile !== undefined) {
    const profile = validatePersona(value.personaProfile);
    if (!profile.ok) {
      issues.push(...profile.issues.map((issue) => ({ path: `personaProfile.${issue.path}`, message: issue.message })));
    }
  }

  if (!Array.isArray(value.stages) || value.stages.length === 0) {
    issues.push({ path: "stages", message: "must be a non-empty array" });
  } else {
    value.stages.forEach((stage: unknown, index: number) =>
      validateStage(stage, index, issues)
    );
  }

  if (issues.length > 0) {
    return { ok: false, error: "journey map failed contract validation", issues };
  }
  return { ok: true, value: value as unknown as JourneyMapSuccess };
}

/** Type guard built on validateJourneyMap. */
export function isJourneyMapResult(value: unknown): value is JourneyMapResult {
  return validateJourneyMap(value).ok;
}
