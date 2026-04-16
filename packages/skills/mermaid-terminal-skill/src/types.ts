/**
 * Mermaid Terminal Skill Types
 */

export type DiagramType = 'flowchart' | 'sequence' | 'class' | 'state' | 'erDiagram' | 'gantt' | 'graph';

export interface DiagramNode {
  id: string;
  label: string;
  type?: string;
  shape?: string;
}

export interface DiagramEdge {
  source: string;
  target: string;
  label?: string;
  style?: string;
}

export interface MermaidDiagram {
  id: string;
  title: string;
  type: DiagramType;
  description?: string;
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  code: string;
  createdAt: number;
  updatedAt: number;
}

export interface ArchitectureComponent {
  name: string;
  type: 'service' | 'database' | 'frontend' | 'api' | 'queue' | 'cache' | 'storage';
  description?: string;
  technologies?: string[];
}

export interface ArchitectureDiagram {
  title: string;
  components: ArchitectureComponent[];
  connections: {
    from: string;
    to: string;
    protocol?: string;
  }[];
}

export interface FlowchartNode {
  id: string;
  text: string;
  shape: 'rectangle' | 'roundBox' | 'diamond' | 'circle' | 'hexagon';
}

export interface SequenceActor {
  id: string;
  label: string;
}

export interface SequenceMessage {
  from: string;
  to: string;
  label: string;
  type: 'sync' | 'async' | 'return';
}

export interface GenerateDiagramResult {
  success: boolean;
  diagram?: MermaidDiagram;
  code: string;
  error?: string;
}
