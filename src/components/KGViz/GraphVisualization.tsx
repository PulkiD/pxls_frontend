import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { GraphData, Node, Relationship } from '../../types/GraphVisualization.types';
import EvolutionControl from '../../features/NetworkEvolution/EvolutionControl';
import { getNodeColors } from '../../constants/kgviz.constants';
import styled from 'styled-components';
import NodeInfoPanel from './NodeInfoPanel';
import EdgeInfoPanel from './EdgeInfoPanel';
import {
  setupSVG,
  setupMarkers,
  createD3Nodes,
  createD3Links,
  renderLinks,
  renderNodes,
  initializeSimulation
} from './d3GraphUtils';
import {
  GraphContainer,
  ModalLayout,
  LeftSidebar,
  MainGraphArea,
  SidebarSection,
  SectionTitle,
  StatsContainer,
  StatItem,
  StatValue,
  NodeTypeList,
  NodeTypeLabel,
  NodeTypeCheckbox,
  NodeTypeName
} from './styles/GraphVisualization.styles';

// Define D3-specific types here since they're only used in this file
interface D3Node extends Node, d3.SimulationNodeDatum {
  fx: number | null;
  fy: number | null;
}

interface D3Link extends Omit<Relationship, 'source' | 'target'>, d3.SimulationLinkDatum<D3Node> {
  source: D3Node;
  target: D3Node;
  isActive?: boolean;
}

interface GraphVisualizationProps {
  data: GraphData;
  searchQuery?: string;
  evolutionYear?: number | null;
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
      filteredRelationships = filteredRelationships.map(rel => ({
        ...rel,
        isActive: true
      }));
    }

    return {
      nodes: filteredNodes,
      relationships: filteredRelationships
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
      evolutionYearUsed: currentEvolutionYear
    });

    d3.select(svgRef.current).selectAll('*').remove();

    const container = svgRef.current.parentElement;
    if (!container) return;

    // Setup SVG and get dimensions
    const { svg, g, width, height } = setupSVG(svgRef, container);
    
    // Setup markers for links
    setupMarkers(svg);

    // Create D3 nodes and links
    const d3Nodes = createD3Nodes(currentFilteredData.nodes, width, height);
    const nodeMap = new Map<string, D3Node>();
    d3Nodes.forEach(node => nodeMap.set(node.id, node));
    const d3Links = createD3Links(currentFilteredData.relationships, nodeMap);

    console.log("D3 data prepared:", { nodes: d3Nodes.length, links: d3Links.length });

    // Event handlers
    const handleNodeClick = (event: MouseEvent, d: D3Node) => {
      event.stopPropagation();
      const [xCoord, yCoord] = d3.pointer(event, svg.node());
      setSelectedNode(prev => prev?.node.id === d.id ? null : { node: d, x: xCoord, y: yCoord });
      setSelectedEdge(null);
    };

    const handleLinkClick = (event: MouseEvent, d: D3Link) => {
      event.stopPropagation();
      const [xCoord, yCoord] = d3.pointer(event, svg.node());
      setSelectedEdge(prev => (prev?.edge.source.id === d.source.id && prev?.edge.target.id === d.target.id && prev?.edge.relation === d.relation) ? null : { edge: d, x: xCoord, y: yCoord });
      setSelectedNode(null);
    };

    const handleDragStart = (event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x ?? null;
      d.fy = d.y ?? null;
    };

    const handleDrag = (event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const handleDragEnd = (event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    // Render links and nodes
    const { linkElements, linkLabels } = renderLinks(g, d3Links, handleLinkClick);
    const nodeElements = renderNodes(g, d3Nodes, nodeColors, handleNodeClick, handleDragStart, handleDrag, handleDragEnd);

    // Setup simulation
    const simulation = initializeSimulation(d3Nodes, d3Links, width, height, () => {
      linkElements
        .attr('x1', d => d.source.x!)
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);

      linkLabels.attr('transform', d => {
        return `translate(${(d.source.x! + d.target.x!) / 2},${(d.source.y! + d.target.y!) / 2})`;
      });

      nodeElements.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
      g.selectAll('*').remove();
      svg.on('.zoom', null);
      svg.on('click', null);
    };
  }, [data, nodeTypeFilter, getFilteredData, currentEvolutionYear]);

  const filteredDataForStats = getFilteredData(); // Call once for stats display

  return (
    <GraphContainer>
      <ModalLayout>
        {!hideControls && (
          <LeftSidebar>
            {/* Stats Section */}
            <SidebarSection>
              <SectionTitle>Graph Stats</SectionTitle>
              <StatsContainer>
                <StatItem>
                  Nodes: <StatValue>{filteredDataForStats.nodes.length}</StatValue>
                </StatItem>
                <StatItem>
                  Edges: <StatValue>{filteredDataForStats.relationships.length}</StatValue>
                </StatItem>
              </StatsContainer>
            </SidebarSection>

            {/* Node Type Filter */}
            <SidebarSection>
              <SectionTitle>Node Types</SectionTitle>
              <NodeTypeList>
                {allNodeTypes.map(type => (
                  <NodeTypeLabel key={type}>
                    <NodeTypeCheckbox
                      type="checkbox"
                      checked={nodeTypeFilter.includes(type)}
                      onChange={e => {
                        if (e.target.checked) {
                          setNodeTypeFilter(prev => [...prev, type]);
                        } else {
                          setNodeTypeFilter(prev => prev.filter(t => t !== type));
                        }
                      }}
                    />
                    <NodeTypeName color={nodeColors[type] || '#333'}>{type}</NodeTypeName>
                  </NodeTypeLabel>
                ))}
              </NodeTypeList>
            </SidebarSection>

            {/* EvolutionControl */}
            <SidebarSection>
              <SectionTitle>Evolution View</SectionTitle>
              <EvolutionControl 
                minYear={minYear} 
                maxYear={maxYear} 
                onYearChange={setCurrentEvolutionYear}
              />
            </SidebarSection>
          </LeftSidebar>
        )}
        <MainGraphArea>
          <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
          {selectedNode && (
            <NodeInfoPanel
              node={selectedNode.node}
              x={selectedNode.x}
              y={selectedNode.y}
            />
          )}
          {selectedEdge && (
            <EdgeInfoPanel
              edge={selectedEdge.edge}
              x={selectedEdge.x}
              y={selectedEdge.y}
            />
          )}
        </MainGraphArea>
      </ModalLayout>
    </GraphContainer>
  );
}

export default GraphVisualization;