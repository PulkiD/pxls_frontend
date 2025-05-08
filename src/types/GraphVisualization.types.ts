import type { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface Node {
  id: string;
  name: string;
  type: string;
  properties?: Record<string, any>;
}

export interface Relationship {
  source: string;
  target: string;
  relation: string;
  weight?: number;
  evolution?: number;
  properties?: Record<string, any>;
}

export interface GraphData {
  nodes: Node[];
  relationships: Relationship[];
}

// D3 specific types
export interface D3Node extends Node, SimulationNodeDatum {
  fx: number | null;
  fy: number | null;
}

export interface D3Link extends Omit<Relationship, 'source' | 'target'>, SimulationLinkDatum<D3Node> {
  source: D3Node;
  target: D3Node;
  isActive?: boolean;
} 