"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

// Dynamically import ForceGraph2D to prevent SSR issues with Canvas/window
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-xl border border-border">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
});

interface GraphNode {
    id: string;
    group: string;
    label: string;
    val: number;
}

interface GraphLink {
    source: string;
    target: string;
    type: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

// Generate 500+ mock nodes with semantic clustering (groups) for Manager View
const generateMockGraphData = (): GraphData => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const groups = ["HR", "IT", "Finance", "Legal", "Operations", "Security"];
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#14b8a6"];

    // Central cluster hubs
    groups.forEach((g, i) => {
        nodes.push({ id: `HUB_${g}`, group: g, label: `${g} Core Policy`, val: 12 });
    });

    // 500 minor policy nodes
    for (let i = 0; i < 500; i++) {
        const groupIndex = Math.floor(Math.random() * groups.length);
        const group = groups[groupIndex];
        const id = `Node_${i}`;

        nodes.push({ id, group, label: `Clause §${i}`, val: Math.random() * 2 + 1 });

        // Connect to hub (Semantic Clustering)
        links.push({ source: id, target: `HUB_${group}`, type: "belongs_to" });

        // Random inter-connections (Conflicts / References)
        if (Math.random() > 0.95) {
            const targetIndex = Math.floor(Math.random() * i);
            links.push({ source: id, target: `Node_${targetIndex}`, type: "cites" });
        }
    }

    return { nodes, links };
};

export default function MacroGraph() {
    const { theme } = useTheme();
    const fgRef = useRef<any>(null);
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

    useEffect(() => {
        // Fetch real graph data from Neo4j backend
        fetch("http://localhost:8000/graphrag/macro_graph")
            .then((res) => res.json())
            .then((data) => {
                if (data.nodes && data.links) {
                    setGraphData(data);
                } else {
                    console.error("Invalid data format from backend", data);
                }
            })
            .catch((err) => console.error("Could not fetch graph data", err));
    }, []);

    const isDark = theme === "dark";
    const backgroundColor = isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)";
    const linkColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
    const textColor = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";

    const groupColors: Record<string, string> = {
        "HR": "#ef4444",
        "IT": "#3b82f6",
        "Finance": "#10b981",
        "Legal": "#f59e0b",
        "Operations": "#8b5cf6",
        "Security": "#14b8a6",
    };

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-border bg-card shadow-sm cursor-grab active:cursor-grabbing relative">
            <div className="absolute top-4 left-4 z-10 p-3 rounded-lg bg-background/80 backdrop-blur-md border border-border text-xs space-y-2">
                <div className="font-semibold text-sm mb-2">Semantic Clusters</div>
                {Object.entries(groupColors).map(([group, color]) => (
                    <div key={group} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span>{group} Layer</span>
                    </div>
                ))}
            </div>

            <div className="w-full h-[600px]">
                <ForceGraph2D
                    ref={fgRef}
                    graphData={graphData}
                    backgroundColor={backgroundColor}
                    nodeRelSize={4}
                    nodeVal={(node: any) => node.val}
                    nodeColor={(node: any) => groupColors[node.group] || "#999"}
                    linkColor={() => linkColor}
                    linkWidth={1}
                    d3AlphaDecay={0.02} // Slow decay for smooth clustering
                    d3VelocityDecay={0.3}
                    warmupTicks={100} // Pre-calculate physics
                    cooldownTicks={100}
                    // Custom canvas drawing for labels on Hub nodes
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                        const label = node.label;
                        const fontSize = node.val > 5 ? 12 / globalScale : 0;

                        // Draw Node
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
                        ctx.fillStyle = groupColors[node.group] || "#999";
                        ctx.fill();

                        // Draw Label only for Hubs if zoomed out, or for minor nodes if zoomed in
                        if (fontSize > 0) {
                            ctx.font = `${fontSize}px Inter, sans-serif`;
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = textColor;
                            ctx.fillText(label, node.x, node.y + node.val + (4 / globalScale));
                        }
                    }}
                    onEngineStop={() => {
                        // Fit to screen when physics settle
                        if (fgRef.current) {
                            fgRef.current.zoomToFit(400, 50);
                        }
                    }}
                />
            </div>
        </div>
    );
}
