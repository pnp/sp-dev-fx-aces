export const formatDefaultCategoriesData = (categories: any[]) => {
    return categories.map(c => {
        let desc = c.description;
        if (desc.indexOf("risky user") > -1) desc = "✅ 0 risky user";
        if (desc.indexOf("risk detection") > -1) desc = "✅ 0 risk detection";

        return {
            id: c.id,
            name: c.name,
            description: desc
        };
    });
};

export const formatCategoriesData = (categories: any[], userCount, riskCount) => {
    return categories.map(c => {
        let desc = c.description;
        if (desc.indexOf("risky user") > -1 && userCount > 0) desc = `⚠️ ${userCount} risky user`;
        if (desc.indexOf("risk detection") > -1 && riskCount > 0) desc = `⚠️ ${riskCount} risk detection`;

    return {
        id: c.id,
        name: c.name,
        description: desc
    };
});
};