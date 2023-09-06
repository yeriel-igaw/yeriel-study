export type Union<T> = T[keyof T];

export const LabelPosition = {
    Top:"top",
    Bottom:"bottom"
} as const;
export type LabelPositionType = Union<typeof LabelPosition>;