export const getImportanceColor = (level: number): string => {
    const colors: Record<number, string> = {
      1: "from-green-100 to-transparent",
      2: "from-blue-100 to-transparent",
      3: "from-yellow-100 to-transparent",
      4: "from-orange-100 to-transparent",
      5: "from-red-100 to-transparent"
    };
    return colors[level] || "from-gray-100 to-transparent";
};