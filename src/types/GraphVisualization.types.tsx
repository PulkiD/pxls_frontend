import type { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface Evolution {
    [year: string]: number;
}

export interface NodeProperties {
    id: string;
    type: string;
    name: string;
    description?: string;
    url?: string;
    score?: number;
}

export interface Node {
    id: string;
    name: string;
    type: string;
    properties?: Record<string, string | number | boolean>;
}

export interface Relationship {
    source: string;
    target: string;
    relation: string;
    weight: number;
    evolution?: Evolution;
    properties?: Record<string, string | number | boolean>;
    isActive?: boolean;
}

export interface GraphData {
    nodes: Node[];
    relationships: Relationship[];
}

export interface GraphResponse {
    success: boolean;
    data?: GraphData;
    error?: string;
}

export interface GraphQuery {
    query: string;
    parameters?: Record<string, string | number | boolean | null>;
}

// D3 specific types
export interface D3Node extends Node, SimulationNodeDatum {
    fx: number | null;
    fy: number | null;
}

export interface D3Link extends Omit<Relationship, 'source' | 'target'>, SimulationLinkDatum<D3Node> {
    source: D3Node;
    target: D3Node;
} 