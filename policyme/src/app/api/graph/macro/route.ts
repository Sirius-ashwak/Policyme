import { NextResponse } from "next/server";

type GraphNode = {
    id: string;
    group: string;
    label: string;
    val: number;
};

type GraphLink = {
    source: string;
    target: string;
    type: string;
};

type GraphData = {
    nodes: GraphNode[];
    links: GraphLink[];
    source: "backend" | "demo";
};

function getGraphRagUrl(): string {
    const rawBase = process.env.GRAPHRAG_API_URL || "http://localhost:8000";
    return rawBase.replace(/\/$/, "");
}

function generateMockGraphData(): GraphData {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const groups = ["HR", "IT", "Finance", "Legal", "Operations", "Security"];

    groups.forEach((group) => {
        nodes.push({ id: `HUB_${group}`, group, label: `${group} Core Policy`, val: 12 });
    });

    for (let index = 0; index < 220; index += 1) {
        const group = groups[index % groups.length];
        const id = `Node_${index}`;

        nodes.push({
            id,
            group,
            label: `Clause §${index}`,
            val: 1 + (index % 3),
        });
        links.push({ source: id, target: `HUB_${group}`, type: "belongs_to" });

        if (index > 0 && index % 11 === 0) {
            links.push({
                source: id,
                target: `Node_${Math.max(0, index - 7)}`,
                type: "cites",
            });
        }
    }

    return { nodes, links, source: "demo" };
}

export async function GET() {
    try {
        const response = await fetch(`${getGraphRagUrl()}/graphrag/macro_graph`, {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Graph backend returned ${response.status}.`);
        }

        const data = (await response.json()) as Partial<GraphData>;

        if (!Array.isArray(data.nodes) || !Array.isArray(data.links)) {
            throw new Error("Invalid graph payload.");
        }

        return NextResponse.json(
            {
                nodes: data.nodes,
                links: data.links,
                source: "backend",
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unable to load macro graph.";
        console.error("API /graph/macro route error:", message);
        return NextResponse.json(generateMockGraphData(), { status: 200 });
    }
}
