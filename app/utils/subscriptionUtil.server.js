import { COMMISSION, COUPON_PCT } from "../shopify.server";

export async function getSubscriptionLineItemId(subscriptionId, graphql) {
    const response = await graphql(
        `#graphql
            query getSubscriptionLineItemId($id: ID!) {
                node(id: $id) {
                    ... on AppSubscription {
                        lineItems {
                            id
                        }
                    }
                }
            }`,
        {
            variables: {
                id: subscriptionId,
            }
        }
    );

    const { data } = await response.json();
    const billingId = data.node.lineItems[0].id;
    return billingId;
}

export async function createAppUsageRecord(billingId, price, couponActive, graphql) {
    const commissionModifiedPrice = price * (COMMISSION / 100);
    const finalModifiedPrice = (couponActive) ? commissionModifiedPrice * (COUPON_PCT / 100) : commissionModifiedPrice; 
    let description = `${COMMISSION}% commission charged on orders made using a PopGames discount code`;
    if (couponActive) {
        description += `. ${COUPON_PCT}% discount applied`;
    }

    const response = await graphql(
        `#graphql
            mutation appUsageRecordCreate($description: String!, $price: MoneyInput!, $subscriptionLineItemId: ID!) {
                appUsageRecordCreate(description: $description, price: $price, subscriptionLineItemId: $subscriptionLineItemId) {
                    userErrors {
                        field
                        message
                    }
                    appUsageRecord {
                        id
                    }
                }
            }`,
        {
            variables: {
                "subscriptionLineItemId": billingId,
                "price": {
                    "amount": finalModifiedPrice,
                    "currencyCode": "USD"
                },
                "description": description,
            }
        }
    );

    const { data } = await response.json();
    return data.appUsageRecordCreate?.appUsageRecord?.id;
}