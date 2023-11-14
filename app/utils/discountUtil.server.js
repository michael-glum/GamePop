const CODE_PREFIX = "POPGAMES-";
const CODES_LOW = ["STYLE", "SPARK", "VOGUE", "SMART", "BRISK", "TREND", "QUICK", "CRISP", "PEACH", "SNACK"];
const CODES_MID = ["ROYAL", "STARS", "BLUSH", "GLEAM", "BLISS", "HAPPY", "FLASH", "FRESH", "FLUFF", "GLINT"];
const CODES_HIGH = ["LUCKY", "PIQUE", "FANCY", "SWEET", "SWANK", "GLOWS", "BLING", "SAVOR", "SLICK", "SUNNY"];
const CODES_DIC = {
    1: CODES_LOW,
    2: CODES_MID,
    3: CODES_HIGH
};

export async function createDiscount(pctOff, graphql, codesNum) {
    const response = await graphql(
        `#graphql
            mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
                discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
                    codeDiscountNode {
                        id
                    }
                    userErrors {
                        field
                        code
                        message
                    }
                }
            }`,
        {
            variables: {
                "basicCodeDiscount": {
                    "title": Math.floor(pctOff * 100) + "% Off With PopGames!",
                    "code": CODE_PREFIX + CODES_DIC[codesNum][0],
                    "startsAt": (new Date()).toISOString(),
                    "endsAt": null,
                    "customerSelection": {
                        "all": true
                    },
                    "customerGets": {
                        "value": {
                            "percentage": pctOff
                        },
                        "items": {
                            "all": true
                        }
                    },
                    "appliesOncePerCustomer": true,
                    "usageLimit": null,
                    "combinesWith": {
                        "shippingDiscounts": true
                    }
                }
            }
        }
    );

    const { data } = await response.json();
    console.log("Result: " + JSON.stringify(data));
    try {
        const discountId = data.discountCodeBasicCreate.codeDiscountNode.id;
        await discountCodesBulkCreate(discountId, graphql, codesNum);
        return discountId;
    } catch (e) {
        console.error({ message: JSON.stringify(data) });
    }
}

export async function discountStillExists(discountId, graphql) {
    const response = await graphql(
        `#graphql
            query discountStillExists($id: ID!) {
                codeDiscountNode(id: $id) {
                    id
                }
            }`,
        {
            variables: {
                id: discountId,
            }
        }
    );

    const { data: { codeDiscountNode } } = await response.json();
    if (codeDiscountNode == null) {
        return false;
    }
    return true;
}

export async function updateDiscountPercentage(discountId, pctOff, graphql) {
    const response = await graphql(
        `#graphql
            mutation discountCodeBasicUpdate($basicCodeDiscount: DiscountCodeBasicInput!, $id: ID!) {
                discountCodeBasicUpdate(basicCodeDiscount: $basicCodeDiscount, id: $id) {
                    codeDiscountNode {
                        id
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }`,
        {
            variables: {
                "id": discountId,
                "basicCodeDiscount": {
                    "title": Math.floor(pctOff * 100) + "% Off With PopGames!",
                    "customerGets": {
                        "value": {
                            "percentage": pctOff,
                        }
                    }
                }
            }
        }
    );

    const { data } = await response.json();
    if (data.discountCodeBasicUpdate?.codeDiscountNode?.id === null) {
        return false;
    }
    return true;
}

async function discountCodesBulkCreate(discountId, graphql, codesNum) {
    const codes = [];
    const wordList = CODES_DIC[codesNum];
    console.log("Word list: " + toString(wordList));
    for (let i = 1; i < wordList.length; i++) {
        codes.push({ code: CODE_PREFIX + wordList[i] });
    }

    const response = await graphql(
        `#graphql
            mutation discountRedeemCodeBulkAdd($codes: [DiscountRedeemCodeInput!]!, $discountId: ID!) {
                discountRedeemCodeBulkAdd(codes: $codes, discountId: $discountId) {
                    bulkCreation {
                        id
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }`,
        {
            variables: {
                "discountId": discountId,
                "codes": codes
            }
        }
    );
    const responseJson = await response.json();
    console.log("Bulk response: " + JSON.stringify(responseJson));
    return responseJson;
}