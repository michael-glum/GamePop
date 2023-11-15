import { json } from "@remix-run/node";
import { unauthenticated } from "../shopify.server";
import db from "../db.server.js"

export const action = async ({ request }) => {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    const { email, getDiscountOptions, getGameOptions } = await request.json();
    const { admin } = await unauthenticated.admin(shop);

    if (email) {
        let customerResponse;
        let validEmailGiven = false;

        const existingCustomerResponse = await existingCustomer(email, admin)
        if (existingCustomerResponse) {
            if (existingCustomerResponse.node.emailMarketingConsent.marketingState === "NOT_SUBSCRIBED" ||
                existingCustomerResponse.node.emailMarketingConsent.marketingState === "UNSUBSCRIBED") {
                customerResponse = await updateEmailMarketingConsent(existingCustomerResponse.node.id, admin);
                validEmailGiven = true;
            }
        } else {
            customerResponse = await createCustomer(email, admin)
            validEmailGiven = true;
        }
        return json({ 
            email: email, 
            customerResponse: JSON.stringify(customerResponse),
            validEmailGiven: validEmailGiven
        })
    } else if (getDiscountOptions) {
        const discountOptions = await db.store.findFirst({ where: { shop: shop },
            select: {
                lowPctOff: true,
                midPctOff: true,
                highPctOff: true,
                lowProb: true,
                midProb: true,
                highProb: true,
            }
        })

        return json({
            discountOptions: discountOptions
        })
    } else if (getGameOptions) {
        const gameOptions = await db.store.findFirst({ where: { shop: shop },
            select: {
                useWordGame: true,
                useBirdGame: true,
            }
        })

        return json({
            gameOptions: gameOptions
        })
    }
}

async function existingCustomer(email, admin) {
    const response = await admin.graphql(
        `#graphql
            query queryCustomers($query: String!) {
                customers(first: 10, query: $query) {
                    edges {
                        node {
                            id
                            emailMarketingConsent {
                                ... on CustomerEmailMarketingConsentState {
                                    marketingState
                                }
                            }
                        }
                    }
                }
            }`,
        {
            variables: {
                "query": "email:" + email
            }
        }
    )
    const { data } = await response.json();
    const customerArray = data.customers.edges;
    return customerArray[0];
}

async function updateEmailMarketingConsent(existingCustomerId, admin) {
    const response = await admin.graphql(
        `#graphql
            mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
                customerEmailMarketingConsentUpdate(input: $input) {
                    customer {
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
                "input": {
                    "customerId": existingCustomerId,
                    "emailMarketingConsent": {
                        "marketingState": "SUBSCRIBED",
                        "marketingOptInLevel": "SINGLE_OPT_IN"
                    }
                }
            }
        }
    )
    const responseJson = await response.json();
    return responseJson;
}

async function createCustomer(email, admin) {
    const response = await admin.graphql(
        `#graphql
            mutation customerCreate($input: CustomerInput!) {
                customerCreate(input: $input) {
                    customer {
                        email
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }`,
        {
            variables: {
                "input": {
                    "email": email,
                    "emailMarketingConsent": {
                        "marketingState": "SUBSCRIBED",
                        "marketingOptInLevel": "SINGLE_OPT_IN"
                    }
                }
            }
        }
    )
    const responseJson = await response.json();
    return responseJson;
}


