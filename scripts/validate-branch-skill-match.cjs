#!/usr/bin/env node
/**
 * Validate Branch-to-Skill Matching
 * Ensures changes on feature branches match the intended skill package
 * Enforces proper tagging strategy for version control
 */

const { execSync } = require("child_process");

// Get branch name
function getBranchName() {
  try {
    return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  } catch {
    console.error("Failed to get branch name");
    process.exit(1);
  }
}

// Extract skill name from branch (e.g., feat/linkedin-master-journalist -> linkedin-master-journalist)
function extractSkillFromBranch(branchName) {
  const patterns = [
    /feat\/([a-z0-9-]+)/,
    /feature\/([a-z0-9-]+)/,
    /skill\/([a-z0-9-]+)/,
    /claude\/implement-([a-z0-9-]+?)(?:-[0-9A-Za-z]+)?$/,  // Handles version suffixes like -6WZpc
    /fix\/([a-z0-9-]+)/,
    /chore\/([a-z0-9-]+)/,
  ];

  for (const pattern of patterns) {
    const match = branchName.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

// Get changed files
function getChangedFiles() {
  try {
    return execSync("git diff --name-only origin/main...HEAD").toString().trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

// Find skill package from file path (only source, not dist)
function findSkillInPath(filePath) {
  // Ignore dist/build artifacts
  if (filePath.includes('/dist/') || filePath.endsWith('.js.map') || filePath.endsWith('.d.ts')) {
    return null;
  }

  const skillMatch = filePath.match(/packages\/skills\/([a-z0-9-]+)\/src/);
  return skillMatch ? skillMatch[1] : null;
}

// Validate branch naming convention
function validateBranchNaming(branchName) {
  const validPatterns = [
    /^feat\/[a-z0-9-]+$/,
    /^feature\/[a-z0-9-]+$/,
    /^skill\/[a-z0-9-]+$/,
    /^claude\/implement-[a-z0-9-]+$/,
    /^fix\/[a-z0-9-]+$/,
    /^docs\/[a-z0-9-]+$/,
    /^chore\/[a-z0-9-]+$/,
    /^main$/,
    /^develop$/,
    /^development$/,
  ];

  return validPatterns.some((pattern) => pattern.test(branchName));
}

// Get tags that match this branch's changes
function getMatchingSkillTags() {
  try {
    // Try multiple approaches to get tags in case of shallow clones
    let tags = [];

    // Approach 1: Local tags
    try {
      const localTags = execSync("git tag -l 'skill-*'").toString().trim().split("\n").filter(Boolean);
      tags = [...tags, ...localTags];
    } catch {
      // Ignore if git tag fails
    }

    // Approach 2: Check git describe for current commit tags
    try {
      const describe = execSync("git describe --tags --exact-match 2>/dev/null || echo ''").toString().trim();
      if (describe && describe.startsWith('skill-')) {
        tags = [...tags, describe];
      }
    } catch {
      // Ignore if git describe fails
    }

    // Remove duplicates
    tags = [...new Set(tags)];

    const matchingTags = [];

    tags.forEach((tag) => {
      const skillMatch = tag.match(/skill-([a-z0-9-]+)@/);
      if (skillMatch) {
        matchingTags.push({
          tag,
          skill: skillMatch[1],
        });
      }
    });

    return matchingTags;
  } catch {
    return [];
  }
}

// Check if changes are tagged with a skill
function getSkillFromTags(changedSkills) {
  const tags = getMatchingSkillTags();
  for (const tag of tags) {
    if (changedSkills.has(tag.skill)) {
      return { skill: tag.skill, tag: tag.tag, source: "tag" };
    }
  }
  return null;
}

// Main validation
function validate() {
  const branchName = getBranchName();
  console.log(`\n📋 Validating branch: ${branchName}`);

  // Check branch naming
  const branchNameValid = validateBranchNaming(branchName);
  if (!branchNameValid) {
    console.warn(
      `⚠️  Warning: Branch name "${branchName}" doesn't follow conventions`
    );
    console.log("   Expected format: feat/skill-name, skill/skill-name, etc.");
    console.log("   OR tag changes with: git tag skill-skill-name@X.Y.Z");
  }

  // Skip validation for main/develop branches
  if (branchName.match(/^(main|develop|development)$/)) {
    console.log("✓ Main/develop branch - skipping skill validation");
    return true;
  }

  // Extract skill from branch name
  const branchSkill = extractSkillFromBranch(branchName);
  if (!branchSkill && branchNameValid) {
    console.warn(
      `⚠️  Could not extract skill name from branch "${branchName}"`
    );
    console.log("   Tip: Use branch names like: feat/linkedin-master-journalist");
  }

  // Get changed files
  const changedFiles = getChangedFiles();
  if (changedFiles.length === 0) {
    console.log("✓ No changed files detected");
    return true;
  }

  console.log(`📁 Changed files: ${changedFiles.length}`);

  // Find skills in changed files
  const skillsChanged = new Set();
  const nonSkillChanges = [];

  changedFiles.forEach((file) => {
    const skill = findSkillInPath(file);
    if (skill) {
      skillsChanged.add(skill);
    } else if (!file.match(/^(docs|\.github|scripts|\.)/)) {
      nonSkillChanges.push(file);
    }
  });

  console.log(`🎯 Skills modified: ${Array.from(skillsChanged).join(", ") || "none"}`);

  // Try to find skill from branch name OR tags
  let validatedSkill = null;

  if (branchSkill && skillsChanged.size > 0) {
    const hasMatchingSkill = skillsChanged.has(branchSkill);

    if (hasMatchingSkill) {
      validatedSkill = { skill: branchSkill, source: "branch" };
      console.log(`✓ Branch skill "${branchSkill}" matches changed files`);

      // Check for unrelated skill changes
      if (skillsChanged.size > 1) {
        const otherSkills = Array.from(skillsChanged).filter((s) => s !== branchSkill);
        console.warn(
          `⚠️  Warning: Changes also affect other skills: ${otherSkills.join(", ")}`
        );
        console.log("   Consider splitting changes into separate branches");
      }
    } else {
      // Branch name doesn't match - try tags
      const tagMatch = getSkillFromTags(skillsChanged);
      if (tagMatch) {
        validatedSkill = tagMatch;
        console.log(
          `✓ Branch changes validated via tag: ${tagMatch.tag} (skill: ${tagMatch.skill})`
        );
        console.warn(
          `⚠️  Tip: Consider renaming branch to feat/${tagMatch.skill} for clarity`
        );
      } else {
        console.error(`❌ Branch skill mismatch!`);
        console.error(`   Branch claims: "${branchSkill}"`);
        console.error(`   Actually changed: ${Array.from(skillsChanged).join(", ")}`);
        console.error(`   No matching tags found (format: skill-{name}@X.Y.Z)`);
        return false;
      }
    }
  } else if (skillsChanged.size > 0 && !branchSkill) {
    // No branch skill, check tags
    const tagMatch = getSkillFromTags(skillsChanged);
    if (tagMatch) {
      validatedSkill = tagMatch;
      console.log(`✓ Changes validated via tag: ${tagMatch.tag}`);
    } else {
      console.warn(
        `⚠️  Skills changed but branch doesn't specify skill in name`
      );
      console.log(`   Changed skills: ${Array.from(skillsChanged).join(", ")}`);
      console.log(
        `   To validate without branch naming: git tag skill-{name}@X.Y.Z`
      );
    }
  }

  // Summary
  if (nonSkillChanges.length > 0) {
    console.log(`\n📝 Non-skill changes (allowed):`);
    nonSkillChanges.slice(0, 5).forEach((f) => console.log(`   - ${f}`));
    if (nonSkillChanges.length > 5) {
      console.log(`   ... and ${nonSkillChanges.length - 5} more`);
    }
  }

  // Validation summary
  console.log(`\n🔍 Validation Summary:`);
  if (validatedSkill) {
    console.log(
      `   ✓ Skill validation source: ${validatedSkill.source.toUpperCase()}`
    );
    console.log(`   ✓ Skill: ${validatedSkill.skill}`);
  } else if (skillsChanged.size === 0 && branchNameValid) {
    console.log(`   ✓ No skill changes detected (docs/config branch OK)`);
  } else {
    console.log(`   ⚠️  No skill validation performed`);
  }

  return true;
}

// Run validation
const isValid = validate();
console.log(
  `\n${isValid ? "✓" : "❌"} Validation ${isValid ? "passed" : "failed"}\n`
);
process.exit(isValid ? 0 : 1);
