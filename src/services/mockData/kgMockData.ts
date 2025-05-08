import type { GraphData } from '../../types/GraphVisualization.types';
import type { SavedQuery } from '../../types/kgApi.types';

// Node types and their colors
const NODE_TYPES = ['drug', 'disease', 'protein', 'pathway', 'gene', 'compound'] as const;
const RELATION_TYPES = ['TREATS', 'CAUSES', 'INTERACTS_WITH', 'REGULATES', 'PARTICIPATES_IN', 'ENCODES'] as const;
const NODES_PER_TYPE = 3;

// Mock data store
let mockSavedQueries: SavedQuery[] = [];
let mockIdCounter = 1;

// Load mock data from localStorage
if (typeof window !== 'undefined') {
  const storedQueries = localStorage.getItem('mockSavedQueries');
  const storedCounter = localStorage.getItem('mockSavedQueriesCounter');
  if (storedQueries) mockSavedQueries = JSON.parse(storedQueries);
  if (storedCounter) mockIdCounter = parseInt(storedCounter, 10);
}

// Save mock data to localStorage
function saveMockData() {
  localStorage.setItem('mockSavedQueries', JSON.stringify(mockSavedQueries));
  localStorage.setItem('mockSavedQueriesCounter', mockIdCounter.toString());
}

// Generate evolution data for a relationship
function generateEvolutionData(): Record<string, number> {
    const evolution: Record<string, number> = {};
  
    const minOverallYear = 2015;
    const maxOverallYear = 2025;
  
    // Determine random start and end years for the evolution sequence
    // ensure startYear <= endYear and both are within [minOverallYear, maxOverallYear]
    const startYear = Math.floor(Math.random() * (maxOverallYear - minOverallYear + 1)) + minOverallYear;
    const endYear = Math.floor(Math.random() * (maxOverallYear - startYear + 1)) + startYear;
  
    const years: number[] = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
  
    let baseValue = 0.8; // Initial base value for the startYear
    const incrementPerYear = 0.1; // Increment for each subsequent year in the sequence
    const randomVariationFactor = 0.1; // Determines the magnitude of random variation
  
    years.forEach(year => {
      // Add random variation (e.g., +/- 0.05 if randomVariationFactor is 0.1)
      const randomVariation = (Math.random() - 0.5) * randomVariationFactor;
      const calculatedValue = baseValue + randomVariation;
  
      // Ensure the value is clamped between 0.8 and 3.0
      evolution[year.toString()] = Math.max(0.8, Math.min(3, calculatedValue));
  
      baseValue += incrementPerYear;
    });
  
    return evolution;
  }

// Generate a random node
function generateNode(id: string, type: typeof NODE_TYPES[number]): GraphData['nodes'][0] {
  return {
    id,
    name: `${type}_${id}`,
    type,
    properties: {
      confidence: Math.random().toFixed(2),
      source: 'Mock Data',
      lastUpdated: new Date().toISOString(),
    },
  };
}

// Generate a random relationship
function generateRelationship(
  sourceId: string,
  targetId: string,
  sourceType: typeof NODE_TYPES[number],
  targetType: typeof NODE_TYPES[number]
): GraphData['relationships'][0] {
  const relation = RELATION_TYPES[Math.floor(Math.random() * RELATION_TYPES.length)];
  const weight = Math.random();
  
  return {
    source: sourceId,
    target: targetId,
    relation,
    weight,
    evolution: generateEvolutionData(), // Always include evolution data
    properties: {
      confidence: Math.random().toFixed(2),
      source: 'Mock Data',
      lastUpdated: new Date().toISOString(),
    },
  };
}

// Generate a complete graph based on a query
export function generateMockGraphData(query: string): GraphData {
  const nodes: GraphData['nodes'] = [];
  const relationships: GraphData['relationships'] = [];
  
  // Generate nodes for each type
  NODE_TYPES.forEach((nodeType) => {
    for (let i = 1; i < Math.floor(Math.random() * NODES_PER_TYPE) + 1; i++) {
      const node = generateNode(`${nodeType}_${i}`, nodeType);
      nodes.push(node);
    }
  });
  
  // Generate relationships
  for (let i = 0; i < nodes.length; i++) {
    const sourceNode = nodes[i];
    const targetCount = Math.floor(Math.random() * 3) + 1; // 1-3 relationships per node
    
    for (let j = 0; j < targetCount; j++) {
      const targetIndex = Math.floor(Math.random() * nodes.length);
      if (targetIndex !== i) {
        const targetNode = nodes[targetIndex];
        const relationship = generateRelationship(
          sourceNode.id,
          targetNode.id,
          sourceNode.type as typeof NODE_TYPES[number],
          targetNode.type as typeof NODE_TYPES[number]
        );
        relationships.push(relationship);
      }
    }
  }
  
  return { nodes, relationships };
}

// Saved Queries CRUD operations
export function getMockSavedQueries(): SavedQuery[] {
  return [...mockSavedQueries];
}

export function saveMockQuery(query: { queryText: string; description?: string; tags?: string[] }): SavedQuery {
  const newQuery: SavedQuery = {
    id: `query_${mockIdCounter++}`,
    queryText: query.queryText,
    description: query.description,
    tags: query.tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockSavedQueries.push(newQuery);
  saveMockData();
  return newQuery;
}

export function deleteMockQuery(queryId: string): boolean {
  const initialLength = mockSavedQueries.length;
  mockSavedQueries = mockSavedQueries.filter(q => q.id !== queryId);
  
  if (mockSavedQueries.length !== initialLength) {
    saveMockData();
    return true;
  }
  return false;
}

export function updateMockQuery(queryId: string, updates: Partial<SavedQuery>): SavedQuery | null {
  const index = mockSavedQueries.findIndex(q => q.id === queryId);
  if (index === -1) return null;
  
  const updatedQuery = {
    ...mockSavedQueries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  mockSavedQueries[index] = updatedQuery;
  saveMockData();
  return updatedQuery;
} 