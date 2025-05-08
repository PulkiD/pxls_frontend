import * as d3 from 'd3';
import type { Node, Relationship } from '../../types/GraphVisualization.types';

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

interface SetupSVGResult {
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
  width: number;
  height: number;
}

export const setupSVG = (
  svgRef: React.RefObject<SVGSVGElement | null>,
  container: HTMLElement
): SetupSVGResult => {
  if (!svgRef.current) throw new Error('SVG ref is null');
  
  // Get the computed style to account for padding/borders
  const containerStyle = window.getComputedStyle(container);
  const width = container.clientWidth - 
    parseFloat(containerStyle.paddingLeft) - 
    parseFloat(containerStyle.paddingRight);
  const height = container.clientHeight - 
    parseFloat(containerStyle.paddingTop) - 
    parseFloat(containerStyle.paddingBottom);

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

  return { svg, g, width, height };
};

export function setupMarkers(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
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
}

export function createD3Nodes(
  nodes: Node[],
  width: number,
  height: number
): D3Node[] {
  return nodes.map(node => ({
    ...node,
    x: width / 2 + (Math.random() - 0.5) * 200,
    y: height / 2 + (Math.random() - 0.5) * 200,
    fx: null,
    fy: null
  })) as D3Node[];
}

export function createD3Links(
  relationships: (Relationship & { isActive?: boolean })[],
  nodeMap: Map<string, D3Node>
): D3Link[] {
  return relationships
    .map(rel => {
      const source = nodeMap.get(rel.source);
      const target = nodeMap.get(rel.target);
      if (!source || !target) return null;
      return {
        ...rel,
        source,
        target,
        isActive: typeof rel.isActive === 'boolean' ? rel.isActive : true
      } as D3Link;
    })
    .filter((link): link is D3Link => link !== null);
}

export function renderLinks(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  d3Links: D3Link[],
  onLinkClick: (event: MouseEvent, d: D3Link) => void
) {
  const linkElements = g.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(d3Links)
    .join('line')
    .attr('stroke', '#222')
    .attr('stroke-opacity', d => d.isActive !== false ? 0.8 : 0.3)
    .attr('stroke-width', 2)
    .attr('marker-end', d => d.isActive !== false ? 'url(#arrow)' : 'url(#arrow-inactive)')
    .style('cursor', 'pointer')
    .on('click', onLinkClick);

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
    .attr('fill', '#222')
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

  return { linkElements, linkLabels };
}

export function renderNodes(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  d3Nodes: D3Node[],
  nodeColors: Record<string, string>,
  onNodeClick: (event: MouseEvent, d: D3Node) => void,
  onDragStart: (event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) => void,
  onDrag: (event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) => void,
  onDragEnd: (event: d3.D3DragEvent<SVGGElement, D3Node, D3Node>, d: D3Node) => void
) {
  const nodeElements = g.append('g')
    .attr('class', 'nodes')
    .selectAll<SVGGElement, D3Node>('g.node-group')
    .data(d3Nodes, d => d.id)
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
    .attr('dy', 30)
    .attr('fill', '#222')
    .style('font-size', '12px');

  nodeElements
    .on('click', onNodeClick)
    .call(d3.drag<SVGGElement, D3Node>()
      .on('start', onDragStart)
      .on('drag', onDrag)
      .on('end', onDragEnd) as any);

  return nodeElements;
}

export function initializeSimulation(
  d3Nodes: D3Node[],
  d3Links: D3Link[],
  width: number,
  height: number,
  onTick: () => void
) {
  return d3.forceSimulation<D3Node>(d3Nodes)
    .force('link', d3.forceLink<D3Node, D3Link>(d3Links)
      .id(d => d.id)
      .distance(200))
    .force('charge', d3.forceManyBody().strength(-1000))
    .force('collide', d3.forceCollide().radius(50))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .on('tick', onTick);
} 