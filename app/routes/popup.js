import { json } from "@remix-run/node";
import { unauthenticated } from "../shopify.server";

export const action = async ({ request }) => {
    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    const { email } = await request.json();
    const { admin } = await unauthenticated.admin(shop);

    let customerResponse;

    const existingCustomerResponse = await existingCustomer(email, admin)
    if (existingCustomerResponse) {
        if (existingCustomerResponse.node.emailMarketingConsent.marketingState === "NOT_SUBSCRIBED" ||
            existingCustomerResponse.node.emailMarketingConsent.marketingState === "UNSUBSCRIBED") {
            customerResponse = await updateEmailMarketingConsent(existingCustomerResponse.node.id, admin);
        }
    } else {
        customerResponse = await createCustomer(email, admin)
    }
    return json({ message: "Email: " + email + " Shop: " + shop + " Customer Response: " + JSON.stringify(customerResponse)})
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


