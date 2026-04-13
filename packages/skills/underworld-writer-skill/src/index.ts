/**
 * Underworld Writer Skill
 *
 * A creative skill for developing characters and narratives in underworld-themed fiction.
 * Provides a three-phase structured methodology for character and narrative development.
 */

// Character Foundation Phase Types
interface CharacterFoundation {
  name: string;
  aliases: string[];
  origin: string;
  physicalCharacteristics: {
    appearance: string;
    distinctiveFeatures: string;
    transformationAbilities?: string;
  };
  background: string;
  coreMotivation: string;
}

// Underworld Integration Phase Types
interface UnderworldIntegration {
  roleAndRank: string;
  responsibilities: string[];
  factionAffiliation: {
    primary: string;
    allies: string[];
    opposition: string[];
  };
  powersAndAbilities: {
    abilities: string[];
    limitations: string[];
  };
  relationships: {
    name: string;
    type: 'ally' | 'enemy' | 'mentor' | 'protégé' | 'rival' | 'romantic' | 'complicated';
    description: string;
  }[];
  resources: {
    territory?: string;
    followers?: number;
    artifacts?: string[];
    wealth?: string;
  };
}

// Narrative Architecture Phase Types
interface NarrativeArchitecture {
  mythologicalFoundation: string;
  hierarchiesAndConflicts: {
    internal: string[];
    external: string[];
    personal: string[];
  };
  storyArc: {
    act1: string;
    act2: string;
    act3: string;
  };
  thematicElements: string[];
  interactionPoints: string[];
}

// Complete Character Profile
export interface UnderWorldCharacter {
  phase1: CharacterFoundation;
  phase2: UnderworldIntegration;
  phase3: NarrativeArchitecture;
  metadata: {
    characterType: string;
    developmentLevel: 'concept' | 'developing' | 'complete';
    complexity: 'simple' | 'moderate' | 'complex';
    createdDate: string;
    lastModified: string;
  };
}

// Validation result type
interface ValidationResult {
  isValid: boolean;
  completeness: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Creates a new underworld character using the three-phase methodology
 */
export function createCharacter(
  foundation: CharacterFoundation,
  integration: UnderworldIntegration,
  narrative: NarrativeArchitecture
): UnderWorldCharacter {
  return {
    phase1: foundation,
    phase2: integration,
    phase3: narrative,
    metadata: {
      characterType: 'underworld',
      developmentLevel: 'complete',
      complexity: 'complex',
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    },
  };
}

/**
 * Validates a character profile across all three phases
 */
export function validateCharacter(character: Partial<UnderWorldCharacter>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Validate Phase 1: Character Foundation
  if (character.phase1) {
    const p1 = character.phase1;
    if (!p1.name) errors.push('Phase 1: Character name is required');
    if (!p1.origin) errors.push('Phase 1: Origin is required');
    if (!p1.coreMotivation) errors.push('Phase 1: Core motivation is required');
  } else {
    warnings.push('Phase 1: Character Foundation not provided');
  }

  // Validate Phase 2: Underworld Integration
  if (character.phase2) {
    const p2 = character.phase2;
    if (!p2.roleAndRank) errors.push('Phase 2: Role and rank is required');
    if (!p2.factionAffiliation?.primary) errors.push('Phase 2: Primary faction is required');
    if (!p2.relationships || p2.relationships.length < 3) {
      warnings.push('Phase 2: Consider adding at least 3 relationships for depth');
    }
    if (!p2.powersAndAbilities?.limitations || p2.powersAndAbilities.limitations.length === 0) {
      suggestions.push('Phase 2: Add limitations to balance character power');
    }
  } else {
    warnings.push('Phase 2: Underworld Integration not provided');
  }

  // Validate Phase 3: Narrative Architecture
  if (character.phase3) {
    const p3 = character.phase3;
    if (!p3.mythologicalFoundation) warnings.push('Phase 3: Mythological foundation strengthens narrative');
    if (!p3.storyArc?.act1 || !p3.storyArc?.act2 || !p3.storyArc?.act3) {
      errors.push('Phase 3: Complete story arc required (Act 1, 2, 3)');
    }
    if (!p3.thematicElements || p3.thematicElements.length === 0) {
      suggestions.push('Phase 3: Add thematic elements to deepen character significance');
    }
  } else {
    warnings.push('Phase 3: Narrative Architecture not provided');
  }

  // Calculate completeness score
  let completenessScore = 0;
  if (character.phase1) completenessScore += 33;
  if (character.phase2) completenessScore += 33;
  if (character.phase3) completenessScore += 34;

  return {
    isValid: errors.length === 0,
    completeness: completenessScore,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Generate a character summary for quick reference
 */
export function generateCharacterSummary(character: UnderWorldCharacter): string {
  const { phase1, phase2, phase3 } = character;

  return `
=== ${phase1.name} ===

FOUNDATION:
- Origin: ${phase1.origin}
- Motivation: ${phase1.coreMotivation}

INTEGRATION:
- Role: ${phase2.roleAndRank}
- Primary Faction: ${phase2.factionAffiliation.primary}
- Key Relationships: ${phase2.relationships.slice(0, 3).map(r => r.name).join(', ')}
- Notable Abilities: ${phase2.powersAndAbilities.abilities.slice(0, 2).join(', ')}

NARRATIVE:
- Story Arc: ${phase3.storyArc.act1} → ${phase3.storyArc.act2} → ${phase3.storyArc.act3}
- Key Themes: ${phase3.thematicElements.slice(0, 2).join(', ')}
`;
}

/**
 * Check relationship consistency between two characters
 */
export function validateRelationships(
  character1: UnderWorldCharacter,
  character2: UnderWorldCharacter
): { consistent: boolean; notes: string[] } {
  const notes: string[] = [];

  const rel1 = character1.phase2.relationships.find(r => r.name === character2.phase1.name);
  const rel2 = character2.phase2.relationships.find(r => r.name === character1.phase1.name);

  if (rel1 && rel2) {
    if (rel1.type === 'ally' && rel2.type === 'enemy') {
      notes.push('Relationship types are contradictory between characters');
    }
    notes.push(`Confirmed bidirectional relationship: ${rel1.type}`);
  } else if (rel1 || rel2) {
    notes.push('One-directional relationship detected');
  }

  return {
    consistent: notes.length === 0 || notes[0].includes('Confirmed'),
    notes,
  };
}

/**
 * Export character as formatted documentation
 */
export function exportCharacterAsMarkdown(character: UnderWorldCharacter): string {
  const { phase1, phase2, phase3 } = character;

  return `# ${phase1.name}

## Phase 1: Character Foundation

### Identity
- **Aliases**: ${phase1.aliases.join(', ')}

### Origin
${phase1.origin}

### Characteristics
${phase1.physicalCharacteristics.appearance}

${phase1.physicalCharacteristics.distinctiveFeatures && `**Distinctive Features**: ${phase1.physicalCharacteristics.distinctiveFeatures}`}

### Background
${phase1.background}

### Core Motivation
${phase1.coreMotivation}

---

## Phase 2: Underworld Integration

### Role & Rank
${phase2.roleAndRank}

### Faction
- **Primary**: ${phase2.factionAffiliation.primary}
- **Allies**: ${phase2.factionAffiliation.allies.join(', ')}
- **Opposition**: ${phase2.factionAffiliation.opposition.join(', ')}

### Powers & Abilities
- **Abilities**: ${phase2.powersAndAbilities.abilities.join('; ')}
- **Limitations**: ${phase2.powersAndAbilities.limitations.join('; ')}

### Relationships
${phase2.relationships.map(r => `- **${r.name}** (${r.type}): ${r.description}`).join('\n')}

### Resources
${Object.entries(phase2.resources).map(([key, value]) => `- **${key}**: ${value}`).join('\n')}

---

## Phase 3: Narrative Architecture

### Mythology
${phase3.mythologicalFoundation}

### Conflicts
- **Internal**: ${phase3.hierarchiesAndConflicts.internal.join('; ')}
- **External**: ${phase3.hierarchiesAndConflicts.external.join('; ')}
- **Personal**: ${phase3.hierarchiesAndConflicts.personal.join('; ')}

### Story Arc
1. **Act 1**: ${phase3.storyArc.act1}
2. **Act 2**: ${phase3.storyArc.act2}
3. **Act 3**: ${phase3.storyArc.act3}

### Themes
${phase3.thematicElements.map(t => `- ${t}`).join('\n')}

### Interaction Points
${phase3.interactionPoints.map(i => `- ${i}`).join('\n')}
`;
}

export default {
  createCharacter,
  validateCharacter,
  generateCharacterSummary,
  validateRelationships,
  exportCharacterAsMarkdown,
};
