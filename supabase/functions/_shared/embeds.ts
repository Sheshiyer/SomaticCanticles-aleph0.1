
// Discord Embed Utilities - TechFrame Design

export const COLORS = {
    CYAN: 0x00FFFF,
    GOLD: 0xFFD700,
    RED: 0xFF5555,
    DARK: 0x0A0A0A,
    TEAL: 0x14B8A6
};

// Standard Footer
const FOOTER = {
    text: "Somatic Oracle /// Anamnesis Engine v1.0",
    icon_url: "https://pub-81d3f278cc944c68bfd60927e1f48644.r2.dev/oracle-avatar-sm.png" // Placeholder
};

export interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

export interface Embed {
    title?: string;
    description?: string;
    url?: string;
    color?: number;
    fields?: EmbedField[];
    image?: { url: string };
    thumbnail?: { url: string };
    footer?: { text: string; icon_url?: string };
    timestamp?: string;
}

export function createTechFrameEmbed(
    title: string,
    description: string,
    variant: "default" | "alert" | "success" = "default"
): Embed {
    let color = COLORS.CYAN;
    if (variant === "alert") color = COLORS.RED;
    if (variant === "success") color = COLORS.TEAL;

    return {
        title: `// ${title}`,
        description: description,
        color: color,
        footer: FOOTER,
        timestamp: new Date().toISOString()
    };
}
