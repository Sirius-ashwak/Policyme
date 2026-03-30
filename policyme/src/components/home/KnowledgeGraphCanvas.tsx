"use client";

import React, { useRef, useEffect, useCallback } from "react";

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    label: string;
    color: string;
    pulse: number;
    pulseSpeed: number;
}

interface Edge {
    from: number;
    to: number;
    progress: number;
    speed: number;
}

const LABELS = [
    "GraphRAG",
    "Policy",
    "Compliance",
    "Claims",
    "Conflict",
    "Coverage",
    "Clause",
    "Audit",
    "HR",
    "Risk",
    "Exclusion",
    "Entity",
    "Citation",
    "Knowledge",
    "Query",
];

const COLORS = [
    "rgba(99,102,241,A)",   // indigo
    "rgba(59,130,246,A)",   // blue
    "rgba(16,185,129,A)",   // emerald
    "rgba(139,92,246,A)",   // violet
    "rgba(236,72,153,A)",   // pink
    "rgba(245,158,11,A)",   // amber
];

function randomBetween(a: number, b: number) {
    return a + Math.random() * (b - a);
}

export function KnowledgeGraphCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const nodesRef = useRef<Node[]>([]);
    const edgesRef = useRef<Edge[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const initializedRef = useRef(false);

    const initGraph = useCallback((w: number, h: number) => {
        const nodeCount = 18;
        const nodes: Node[] = [];
        const padding = 60;

        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: randomBetween(padding, w - padding),
                y: randomBetween(padding, h - padding),
                vx: randomBetween(-0.3, 0.3),
                vy: randomBetween(-0.3, 0.3),
                radius: randomBetween(3, 7),
                label: LABELS[i % LABELS.length],
                color: COLORS[i % COLORS.length],
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: randomBetween(0.01, 0.03),
            });
        }

        // Create edges — connect nearby pairs + some random long-range
        const edges: Edge[] = [];
        for (let i = 0; i < nodeCount; i++) {
            // Connect to 2-3 nearest
            const distances = nodes
                .map((n, j) => ({
                    j,
                    d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y),
                }))
                .filter((d) => d.j !== i)
                .sort((a, b) => a.d - b.d);

            for (let k = 0; k < Math.min(2, distances.length); k++) {
                const existing = edges.find(
                    (e) =>
                        (e.from === i && e.to === distances[k].j) ||
                        (e.from === distances[k].j && e.to === i)
                );
                if (!existing) {
                    edges.push({
                        from: i,
                        to: distances[k].j,
                        progress: Math.random(),
                        speed: randomBetween(0.002, 0.006),
                    });
                }
            }
        }

        // Add a few random long-range connections
        for (let i = 0; i < 5; i++) {
            const a = Math.floor(Math.random() * nodeCount);
            let b = Math.floor(Math.random() * nodeCount);
            while (b === a) b = Math.floor(Math.random() * nodeCount);
            const existing = edges.find(
                (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a)
            );
            if (!existing) {
                edges.push({
                    from: a,
                    to: b,
                    progress: Math.random(),
                    speed: randomBetween(0.001, 0.004),
                });
            }
        }

        nodesRef.current = nodes;
        edgesRef.current = edges;
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const dpr = window.devicePixelRatio || 1;

        ctx.clearRect(0, 0, w, h);

        const nodes = nodesRef.current;
        const edges = edgesRef.current;
        const mouse = mouseRef.current;

        // Draw subtle grid
        ctx.strokeStyle = "rgba(148,163,184,0.06)";
        ctx.lineWidth = 1;
        const gridSize = 40 * dpr;
        for (let x = 0; x < w; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Update node positions
        const padding = 40 * dpr;
        for (const node of nodes) {
            node.x += node.vx * dpr;
            node.y += node.vy * dpr;
            node.pulse += node.pulseSpeed;

            // Bounce off edges
            if (node.x < padding || node.x > w - padding) node.vx *= -1;
            if (node.y < padding || node.y > h - padding) node.vy *= -1;
            node.x = Math.max(padding, Math.min(w - padding, node.x));
            node.y = Math.max(padding, Math.min(h - padding, node.y));

            // Mouse repulsion
            const dx = node.x - mouse.x * dpr;
            const dy = node.y - mouse.y * dpr;
            const dist = Math.hypot(dx, dy);
            if (dist < 120 * dpr && dist > 0) {
                const force = (120 * dpr - dist) / (120 * dpr) * 0.8;
                node.x += (dx / dist) * force * dpr;
                node.y += (dy / dist) * force * dpr;
            }
        }

        // Draw edges
        for (const edge of edges) {
            const from = nodes[edge.from];
            const to = nodes[edge.to];
            const edgeDist = Math.hypot(to.x - from.x, to.y - from.y);

            // Edge line
            const alpha = Math.max(0.05, 0.15 - edgeDist / (w * 1.5));
            ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();

            // Slight curve
            const mx = (from.x + to.x) / 2 + (from.y - to.y) * 0.1;
            const my = (from.y + to.y) / 2 + (to.x - from.x) * 0.1;
            ctx.moveTo(from.x, from.y);
            ctx.quadraticCurveTo(mx, my, to.x, to.y);
            ctx.stroke();

            // Traveling dot along edge
            edge.progress += edge.speed;
            if (edge.progress > 1) edge.progress = 0;
            const t = edge.progress;
            const px = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * mx + t * t * to.x;
            const py = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * my + t * t * to.y;

            const dotColor = from.color.replace("A", "0.7");
            ctx.fillStyle = dotColor;
            ctx.beginPath();
            ctx.arc(px, py, 2 * dpr, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw nodes
        for (const node of nodes) {
            const pulseScale = 1 + Math.sin(node.pulse) * 0.3;

            // Outer glow
            const glowColor = node.color.replace("A", String(0.15 * pulseScale));
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(node.x, node.y, (node.radius * 4 * pulseScale) * dpr, 0, Math.PI * 2);
            ctx.fill();

            // Core dot
            const coreColor = node.color.replace("A", "0.9");
            ctx.fillStyle = coreColor;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius * dpr, 0, Math.PI * 2);
            ctx.fill();

            // Label (only for larger nodes)
            if (node.radius > 4.5) {
                ctx.font = `${10 * dpr}px ui-monospace, 'Cascadia Mono', 'Courier New', monospace`;
                ctx.fillStyle = node.color.replace("A", "0.6");
                ctx.textAlign = "center";
                ctx.fillText(node.label.toUpperCase(), node.x, node.y - (node.radius + 8) * dpr);
            }
        }

        animationRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (!rect) return;
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            if (!initializedRef.current) {
                initGraph(canvas.width, canvas.height);
                initializedRef.current = true;
            }
        };

        const handleMouse = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        resize();
        window.addEventListener("resize", resize);
        canvas.addEventListener("mousemove", handleMouse);
        canvas.addEventListener("mouseleave", handleMouseLeave);

        animationRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("mousemove", handleMouse);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationRef.current);
        };
    }, [initGraph, draw]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: "auto" }}
        />
    );
}
