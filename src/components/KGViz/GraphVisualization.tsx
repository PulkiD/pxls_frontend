import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
// Assuming types are in a 'types' folder relative to the component or project root
import type { GraphData, Node, Relationship } from './types';
import EvolutionControl from '../../features/NetworkEvolution/EvolutionControl'; // Re-add import

// Assuming config is in a 'config' folder relative to the component or project root
import { getNodeColors } from '../../config/kgviz'; // Adjust path as needed

import styled from 'styled-components';

interface GraphVisualizationProps {
  data: GraphData;
  searchQuery?: string;
  evolutionYear?: number | null;
  // Add a prop to hide controls if needed, for uses like the mini-graph
  hideControls?: boolean; 
}

// Get node colors from configuration
const nodeColors = getNodeColors();

interface NodeInfo {
  node: Node;
  x: number;
  y: number;
}

interface EdgeInfo {
  edge: D3Link;
  x: number;
  y: number;
}

// D3 specific node type, extending the base Node type
interface D3Node extends Node, d3.SimulationNodeDatum {
  // x, y, vx, vy, fx, fy are added by d3 simulation
  // Explicitly define fx and fy as they are used for fixing node positions
  fx: number | null;
  fy: number | null;
}

// D3 specific link type, extending the base Relationship type
interface D3Link extends Omit<Relationship, 'source' | 'target'>, d3.SimulationLinkDatum<D3Node> {
  source: D3Node; // In D3, source and target are D3Node objects after processing
  target: D3Node;
  isActive?: boolean; // Custom property for evolution filtering
}

// Add a styled container for modularity
const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
`;

// Add styled components for layout
const ModalLayout = styled.div`
  display: flex;
  height: 100%;
`;
const LeftSidebar = styled.div`
  width: 260px;
  background: #f7f7f7;
  border-right: 1px solid #e5e7eb;
  padding: 1.5rem 1rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* Adjusted gap */
  z-index: 2;
  overflow-y: auto; /* Allow sidebar to scroll if content overflows */
`;
const MainGraphArea = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
  overflow: hidden;
`;

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ data, searchQuery, evolutionYear: evolutionYearProp, hideControls = false }) => {
  // Defensive: If data is missing or malformed, show an error message
  if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.relationships)) {
    return <div style={{ color: 'red', padding: '2rem', textAlign: 'center' }}>Invalid or missing graph data.</div>;
  }

  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<EdgeInfo | null>(null);
  
  // Get unique node types for filter options
  const allNodeTypes = React.useMemo(() => Array.from(new Set(data.nodes.map(node => node.type))), [data.nodes]);
  
  // Initialize nodeTypeFilter with all node types by default (show everything)
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string[]>(allNodeTypes);
  
  // Internal state for evolution year, initialized by prop or null
  const [currentEvolutionYear, setCurrentEvolutionYear] = useState<number | null>(evolutionYearProp !== undefined ? evolutionYearProp : null);

  // Update nodeTypeFilter if allNodeTypes changes (e.g., data prop changes)
  useEffect(() => {
    setNodeTypeFilter(allNodeTypes);
  }, [allNodeTypes]);

  // Effect to update internal evolution year if prop changes
  useEffect(() => {
    if (evolutionYearProp !== undefined) {
        setCurrentEvolutionYear(evolutionYearProp);
    }
  }, [evolutionYearProp]);

  // Calculate min and max years from evolution data - RESTORED
  const { minYear, maxYear } = React.useMemo(() => {
    let min = 2020;
    let max = 2025;
    const years = new Set<number>();
    data.relationships.forEach(rel => {
      if (rel.evolution) {
        Object.entries(rel.evolution).forEach(([yearStr, weight]) => {
          if (typeof weight === 'number' && weight > 0) {
            const year = parseInt(yearStr);
            if (!isNaN(year)) {
              years.add(year);
            }
          }
        });
      }
    });
    if (years.size > 0) {
      min = Math.min(...years);
      max = Math.max(...years);
    }
    return { minYear: min, maxYear: max };
  }, [data.relationships]);
  
  // Function to get filtered data
  const getFilteredData = React.useCallback(() => {
    if (!data) return { nodes: [], relationships: [] };

    let filteredNodes = data.nodes;
    if (nodeTypeFilter.length !== allNodeTypes.length) {
      filteredNodes = data.nodes.filter(node => 
        nodeTypeFilter.includes(node.type)
      );
    }
    
    const filteredNodeIds = new Set(filteredNodes.map(node => node.id));
    
    let filteredRelationships = data.relationships.filter(rel =>
      filteredNodeIds.has(rel.source) && filteredNodeIds.has(rel.target)
    );
    
    // Use internal currentEvolutionYear for filtering
    if (currentEvolutionYear !== null && currentEvolutionYear !== undefined) {
      filteredRelationships = filteredRelationships.map(rel => {
        let isActive = true;
        if (rel.evolution && Object.keys(rel.evolution).length > 0) {
          isActive = Object.entries(rel.evolution).some(([yearStr, weight]) => {
            const year = parseInt(yearStr);
            return !isNaN(year) && year <= currentEvolutionYear && typeof weight === 'number' && weight > 0;
          });
        }
        return {
          ...rel,
          isActive
        };
      });
    } else {
        // If no year is selected, all relationships are considered active by default
        // or explicitly mark them based on whether isActive was part of the original data or not.
        // Assuming if evolutionYear is null, evolution filtering is off.
        filteredRelationships = filteredRelationships.map(rel => ({
            ...rel,
            isActive: true // Default to active if no year is selected
        }));
    }

    return {
      nodes: filteredNodes,
      relationships: filteredRelationships as (Relationship & { isActive?: boolean })[] // Ensure type for isActive
    };
  }, [data, nodeTypeFilter, allNodeTypes.length, currentEvolutionYear]);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) {
      console.log("No SVG ref or data:", { svgRef: !!svgRef.current, nodeCount: data?.nodes?.length });
      return;
    }
    
    const currentFilteredData = getFilteredData();
    console.log("Rendering graph with data:", { 
      nodes: data.nodes.length, 
      relationships: data.relationships.length,
      filteredNodeCount: currentFilteredData.nodes.length,
      filteredRelCount: currentFilteredData.relationships.length,
      evolutionYearUsed: currentEvolutionYear // Log the year being used
    });

    d3.select(svgRef.current).selectAll('*').remove();

    const container = svgRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    
    const d3Nodes: D3Node[] = currentFilteredData.nodes.map(node => ({
      ...node,
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200,
      fx: null,
      fy: null
    }));

    const nodeMap = new Map<string, D3Node>();
    d3Nodes.forEach(node => nodeMap.set(node.id, node));

    const d3Links = currentFilteredData.relationships
      .map(rel => {
        const source = nodeMap.get(rel.source);
        const target = nodeMap.get(rel.target);
        if (!source || !target) return null;
        return {
          ...rel,
          source,
          target,
          isActive: typeof rel.isActive === 'boolean' ? rel.isActive : true // always boolean
        };
      })
      .filter(Boolean) as D3Link[];

    console.log("D3 data prepared:", { nodes: d3Nodes.length, links: d3Links.length });

    svg.append('defs').selectAll('marker')
      .data(['end', 'end-inactive'])
      .join('marker')
      .attr('id', d => d === 'end' ? 'arrow' : 'arrow-inactive')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', d => d === 'end' ? '#999' : '#444');
      
    const linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(d3Links)
      .join('line')
      .attr('stroke', '#222') // Always black for visibility
      .attr('stroke-opacity', d => d.isActive !== false ? 0.8 : 0.3)
      .attr('stroke-width', 2)
      .attr('marker-end', d => d.isActive !== false ? 'url(#arrow)' : 'url(#arrow-inactive)')
      .style('cursor', 'pointer');

    linkElements.append('line')
      .attr('stroke', d => d.isActive !== false ? '#ffffff' : '#444444')
      .attr('stroke-opacity', d => d.isActive !== false ? 0.6 : 0.3)
      .attr('stroke-width', 2)
      .attr('marker-end', d => d.isActive !== false ? 'url(#arrow)' : 'url(#arrow-inactive)')
      .style('cursor', 'pointer')
      .on('click', (event, d: D3Link) => {
        event.stopPropagation();
        const [xCoord, yCoord] = d3.pointer(event, svg.node());
        setSelectedEdge(prev => (prev?.edge.source.id === d.source.id && prev?.edge.target.id === d.target.id && prev?.edge.relation === d.relation) ? null : { edge: d, x: xCoord, y: yCoord });
        setSelectedNode(null);
      });

    const linkLabels = linkElements
      .append('g')
      .attr('class', 'link-label')
      .style('opacity', d => d.isActive !== false ? 1 : 0.5);

    linkLabels.append('rect')
      .attr('fill', '#e5e7eb')
      .attr('opacity', 0.8)
      .attr('rx', 4)
      .attr('ry', 4);

    linkLabels.append('text')
      .text(d => d.relation)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#222') // Black text for visibility
      .style('font-size', '10px')
      .style('pointer-events', 'none')
      .each(function(this: SVGTextElement) {
        const bbox = this.getBBox();
        const parent = this.parentElement;
        if (parent) {
          d3.select(parent)
            .select('rect')
            .attr('x', bbox.x - 4)
            .attr('y', bbox.y - 2)
            .attr('width', bbox.width + 8)
            .attr('height', bbox.height + 4);
        }
      });

    const nodeElements = g.append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, D3Node>('g.node-group') // More specific selector
      .data(d3Nodes, d => d.id) // Add key function
      .join('g')
      .attr('class', 'node-group');

    nodeElements.append('circle')
      .attr('r', 20)
      .attr('fill', d => nodeColors[d.type] || '#999')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    nodeElements.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', 30) // Position label below the circle
      .attr('fill', '#222') // Black text for node names
      .style('font-size', '12px');

    nodeElements.on('click', (event, d: D3Node) => {
      event.stopPropagation();
      const [xCoord, yCoord] = d3.pointer(event, svg.node());
      setSelectedNode(prev => prev?.node.id === d.id ? null : { node: d, x: xCoord, y: yCoord });
      setSelectedEdge(null);
    });

    svg.on('click', (event) => {
      if (event.target === svg.node()) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    const drag = d3.drag<SVGGElement, D3Node>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x ?? null;
        d.fy = d.y ?? null;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeElements.call(drag as any); // Use 'as any' if type issues with D3 drag and React/TS

    const simulation = d3.forceSimulation<D3Node>(d3Nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(d3Links)
        .id(d => d.id)
        .distance(200))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('collide', d3.forceCollide().radius(50)) // Radius should be larger than node radius to prevent overlap
      .force('center', d3.forceCenter(width / 2, height / 2));

    simulation.on('tick', () => {
      linkElements
        .attr('x1', d => d && d.source ? d.source.x! : 0)
        .attr('y1', d => d && d.source ? d.source.y! : 0)
        .attr('x2', d => d && d.target ? d.target.x! : 0)
        .attr('y2', d => d && d.target ? d.target.y! : 0);

      linkLabels.attr('transform', d => {
        return `translate(${(d.source.x! + d.target.x!) / 2},${(d.source.y! + d.target.y!) / 2})`;
      });

      nodeElements.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // It's usually not recommended to manually run simulation like this for too long.
    // simulation.alpha(1).restart(); // Restarting alpha might be better done once after setup.

    return () => {
      simulation.stop();
      // Clean up D3 elements and event listeners if necessary, though React unmounting should handle SVG
      g.selectAll('*').remove(); // Clear group content
      svg.on('.zoom', null); // Remove zoom listener
      svg.on('click', null); // Remove svg click listener
    };
  }, [data, nodeTypeFilter, getFilteredData, currentEvolutionYear]); // Add currentEvolutionYear to dependencies of D3 effect

  const filteredDataForStats = getFilteredData(); // Call once for stats display

  return (
    <GraphContainer>
      <ModalLayout>
        {!hideControls && ( // Conditionally render LeftSidebar
          <LeftSidebar>
            {/* Stats Section */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Graph Stats</h4>
              <div style={{ fontSize: '0.97rem', color: '#333', marginBottom: 4 }}>Nodes: <b>{filteredDataForStats.nodes.length}</b></div>
              <div style={{ fontSize: '0.97rem', color: '#333' }}>Edges: <b>{filteredDataForStats.relationships.length}</b></div>
            </div>
            {/* Node Type Filter */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Node Types</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {allNodeTypes.map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', fontSize: '0.97rem', color: '#444', marginBottom: 2 }}>
                    <input
                      type="checkbox"
                      checked={nodeTypeFilter.includes(type)}
                      onChange={e => {
                        if (e.target.checked) {
                          setNodeTypeFilter(prev => [...prev, type]);
                        } else {
                          setNodeTypeFilter(prev => prev.filter(t => t !== type));
                        }
                      }}
                      style={{ marginRight: 8 }}
                    />
                    <span style={{ color: nodeColors[type] || '#333', fontWeight: 500 }}>{type}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* EvolutionControl moved to LeftSidebar */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Evolution View</h4>
              <EvolutionControl 
                minYear={minYear} 
                maxYear={maxYear} 
                onYearChange={setCurrentEvolutionYear} // Update internal state
              />
            </div>
          </LeftSidebar>
        )}
        <MainGraphArea>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
          {selectedNode && (
            <div 
              className="absolute bg-gray-900 bg-opacity-90 border border-gray-700 rounded-lg p-4 shadow-xl"
              style={{
                left: `${selectedNode.x + 20}px`,
                top: `${selectedNode.y}px`,
                maxWidth: '300px',
                zIndex: 1000
              }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">{selectedNode.node.name}</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Type: <span className="text-white">{selectedNode.node.type}</span></p>
                {Object.entries(selectedNode.node.properties || {}).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-400">
                    {key}: <span className="text-white">{String(value)}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
          {selectedEdge && (
            <div 
              className="absolute bg-gray-900 bg-opacity-90 border border-gray-700 rounded-lg p-4 shadow-xl"
              style={{
                left: `${selectedEdge.x + 20}px`,
                top: `${selectedEdge.y}px`,
                maxWidth: '350px',
                zIndex: 1000
              }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Relationship</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Type: <span className="text-white">{selectedEdge.edge.relation}</span></p>
                <p className="text-sm text-gray-400">From: <span className="text-white">{selectedEdge.edge.source.name}</span></p>
                <p className="text-sm text-gray-400">To: <span className="text-white">{selectedEdge.edge.target.name}</span></p>
                <p className="text-sm text-gray-400">Weight: <span className="text-white">{selectedEdge.edge.weight}</span></p>
                {selectedEdge.edge.evolution && (
                  <div className="text-sm text-gray-400">
                    Evolution:
                    <ul style={{ marginLeft: 12 }}>
                      {Object.entries(selectedEdge.edge.evolution).map(([year, value]) => (
                        <li key={year}><span className="text-white">{year}: {value}</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                {Object.entries(selectedEdge.edge.properties || {}).map(([key, value]) => (
                  <p key={key} className="text-sm text-gray-400">
                    {key}: <span className="text-white">{String(value)}</span>
                  </p>
                ))}
                {selectedEdge.edge.isActive !== undefined && (
                  <p className="text-sm text-gray-400">Status: <span className="text-white">{selectedEdge.edge.isActive ? 'Active' : 'Inactive'}</span></p>
                )}
              </div>
            </div>
          )}
        </MainGraphArea>
      </ModalLayout>
    </GraphContainer>
  );
}

export default GraphVisualization;