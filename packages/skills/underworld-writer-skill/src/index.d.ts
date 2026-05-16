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
interface ValidationResult {
    isValid: boolean;
    completeness: number;
    errors: string[];
    warnings: string[];
    suggestions: string[];
}
export declare function createCharacter(foundation: CharacterFoundation, integration: UnderworldIntegration, narrative: NarrativeArchitecture): UnderWorldCharacter;
export declare function validateCharacter(character: Partial<UnderWorldCharacter>): ValidationResult;
export declare function generateCharacterSummary(character: UnderWorldCharacter): string;
export declare function validateRelationships(character1: UnderWorldCharacter, character2: UnderWorldCharacter): {
    consistent: boolean;
    notes: string[];
};
export declare function exportCharacterAsMarkdown(character: UnderWorldCharacter): string;
declare const _default: {
    createCharacter: typeof createCharacter;
    validateCharacter: typeof validateCharacter;
    generateCharacterSummary: typeof generateCharacterSummary;
    validateRelationships: typeof validateRelationships;
    exportCharacterAsMarkdown: typeof exportCharacterAsMarkdown;
};
export default _default;
//# sourceMappingURL=index.d.ts.map