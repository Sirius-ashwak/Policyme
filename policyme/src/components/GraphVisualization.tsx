"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { AlertCircle, Loader2 } from "lucide-react";
import type { ForceGraphMethods } from "react-force-graph-2d";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-xl border border-border">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    ),
});

interface GraphNode {
    id: string;
    group: string;
    label: string;
    val: number;
    x?: number;
    y?: number;
}

interface GraphLink {
    source: string;
    target: string;
    type: string;
}

interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
    source?: "backend" | "demo";
}

type ForceGraphNode = {
    id?: string | number;
    x?: number;
    y?: number;
    val?: number;
    group?: string;
    label?: string;
};

type GraphResponse = GraphData & {
    error?: string;
};

export default function MacroGraph() {
    const { theme } = useTheme();
    const fgRef = useRef<ForceGraphMethods<ForceGraphNode, GraphLink> | undefined>(undefined);
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadGraphData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/graph/macro", { cache: "no-store" });
                const payload = (await response.json()) as GraphResponse;

                if (!response.ok) {
                    throw new Error(payload.error || "Unable to load macro graph.");
                }

                if (isMounted) {
                    setGraphData({
                        nodes: Array.isArray(payload.nodes) ? payload.nodes : [],
                        links: Array.isArray(payload.links) ? payload.links : [],
                        source: payload.source,
                    });
                    setError(null);
                }
            } catch (loadError: unknown) {
                if (isMounted) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load macro graph.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        void loadGraphData();

        return () => {
            isMounted = false;
        };
    }, []);

    const isDark = theme === "dark";
    const backgroundColor = isDark ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)";
    const linkColor = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";
    const textColor = isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)";

    const groupColors: Record<string, string> = {
        HR: "#ef4444",
        IT: "#3b82f6",
        Finance: "#10b981",
        Legal: "#f59e0b",
        Operations: "#8b5cf6",
        Security: "#14b8a6",
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
                {graphData.source && (
                    <div className="pt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                        Source: {graphData.source}
                    </div>
                )}
            </div>

            {error && (
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 shadow-sm">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            )}

            <div className="w-full h-[600px]">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-muted/10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <ForceGraph2D
                        ref={fgRef}
                        graphData={graphData}
                        backgroundColor={backgroundColor}
                        nodeRelSize={4}
                        nodeVal={(node: ForceGraphNode) => (typeof node.val === "number" ? node.val : 1)}
                        nodeColor={(node: ForceGraphNode) => (typeof node.group === "string" ? groupColors[node.group] || "#999" : "#999")}
                        linkColor={() => linkColor}
                        linkWidth={1}
                        d3AlphaDecay={0.02}
                        d3VelocityDecay={0.3}
                        warmupTicks={100}
                        cooldownTicks={100}
                        nodeCanvasObject={(node: ForceGraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
                            if (typeof node.x !== "number" || typeof node.y !== "number") {
                                return;
                            }

                            const nodeValue = typeof node.val === "number" ? node.val : 1;
                            const nodeGroup = typeof node.group === "string" ? node.group : "";
                            const nodeLabel = typeof node.label === "string" ? node.label : String(node.id ?? "");
                            const fontSize = nodeValue > 5 ? 12 / globalScale : 0;

                            ctx.beginPath();
                            ctx.arc(node.x, node.y, nodeValue, 0, 2 * Math.PI, false);
                            ctx.fillStyle = groupColors[nodeGroup] || "#999";
                            ctx.fill();

                            if (fontSize > 0) {
                                ctx.font = `${fontSize}px Inter, sans-serif`;
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.fillStyle = textColor;
                                ctx.fillText(nodeLabel, node.x, node.y + nodeValue + (4 / globalScale));
                            }
                        }}
                        onEngineStop={() => {
                            fgRef.current?.zoomToFit(400, 50);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
