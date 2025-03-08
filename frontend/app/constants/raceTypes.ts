export const RACE_TYPES = [
    { key: "WALK_COURSE", label: "걷기" },
    { key: "FIVE_COURSE", label: "5K" },
    { key: "TEN_COURSE", label: "10K" },
    { key: "HALF_COURSE", label: "Half" },
    { key: "FULL_COURSE", label: "풀코스" },
    { key: "FIFTY_COURSE", label: "50K" },
    { key: "HUNDRED_COURSE", label: "100K" },
    { key: "ETC_COURSE", label: "기타" },
] as const;

export type RaceType = typeof RACE_TYPES[number]['key'];

export const getRaceTypeLabel = (type: RaceType): string => {
    const raceType = RACE_TYPES.find(t => t.key === type);
    return raceType?.label || '';
}; 