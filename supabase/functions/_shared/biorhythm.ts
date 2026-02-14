
// Biorhythm Engine - Shared Logic

export type BiorhythmState = {
    physical: number; // 0-1
    emotional: number; // 0-1
    intellectual: number; // 0-1
    labels: {
        physical: "High" | "Low" | "Critical";
        emotional: "High" | "Low" | "Critical";
        intellectual: "High" | "Low" | "Critical";
    }
};

export function calculateBiorhythm(birthDate: Date, targetDate: Date = new Date()): BiorhythmState {
    // 1. Calculate days lived
    const diffTime = targetDate.getTime() - birthDate.getTime();
    const daysLived = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 2. Calculate cycles (Sine waves)
    // Physical: 23 days, Emotional: 28 days, Intellectual: 33 days
    // Result is -1 to 1. We normalize to 0 to 1 for easier consumption.
    const physRaw = Math.sin((2 * Math.PI * daysLived) / 23);
    const emotRaw = Math.sin((2 * Math.PI * daysLived) / 28);
    const intelRaw = Math.sin((2 * Math.PI * daysLived) / 33);

    const normalize = (val: number) => (val + 1) / 2;

    const physical = normalize(physRaw);
    const emotional = normalize(emotRaw);
    const intellectual = normalize(intelRaw);

    // 3. Determine Labels
    const getLabel = (val: number) => {
        if (val > 0.8) return "High";
        if (val < 0.2) return "Low";
        // Critical days are when it crosses zero (0.5 in normalized)
        if (Math.abs(val - 0.5) < 0.1) return "Critical";
        return (val > 0.5) ? "High" : "Low";
    };

    return {
        physical,
        emotional,
        intellectual,
        labels: {
            physical: getLabel(physical),
            emotional: getLabel(emotional),
            intellectual: getLabel(intellectual)
        }
    };
}

export function generateProgressBar(value: number, length: number = 10): string {
    const filled = Math.round(value * length);
    const empty = length - filled;
    // Using simple ascii/unicode blocks. 
    // High-tech look: ▰▰▰▱▱▱
    return "▰".repeat(filled) + "▱".repeat(empty);
}
