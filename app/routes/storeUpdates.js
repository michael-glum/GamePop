import { json } from "@remix-run/node";
import db from "../db.server";
import { unauthenticated } from "../shopify.server";

const PRIVATE_AUTH_TOKEN = process.env.PRIVATE_AUTH_TOKEN;
const ORDER_GRACE_PERIOD = 1;
const UPDATE_SALES_TASK = "UPDATE_SALES"

export const action = async ({ request }) => {
    if (request.method === "POST") {
        const { token, task } = await request.json();
        if (token === PRIVATE_AUTH_TOKEN) {
            const stores = await db.store.findMany();
            if (!stores) {
                return json({ message: 'Stores not found' }, { status: 404 });
            }

            const updateResponses = []
            const today = await getDateXDaysAgo(0);

            updateResponses.push(stores.forEach(async function(store) {
                if (store.lastUpdated != today) {
                    const { admin } = await unauthenticted.admin(store.shop);
                    if (store.lowDiscountId && store.midDiscountId && store.highDiscountId) {
                        if (task === UPDATE_SALES_TASK) {
                            const bulkOpResponse = await queryOrdersBulkOperation(admin);
                            // console.log("Bulk Operation Response Status: " + JSON.stringify(bulkOpResponse));
                        }
                    }
                }
            }));
            return json({updateResponses: updateResponses});
        } else {
            return json({ error: "Invalid token" }, { status: 401 });
        }
    }
    return json({ message: "API endpoint reached" });
};

async function queryOrdersBulkOperation(admin) {
    const queryDate = await getDateXDaysAgo(ORDER_GRACE_PERIOD);
    const query = `
    {
      orders(query: "created_at:${queryDate} AND discount_code:POPGAMES*") {
        edges {
          node {
            discountCodes
            netPaymentSet {
              shopMoney {
                amount
              }
            }
          }
        }
      }
    }
    `
    const response = await admin.graphql(
      `#graphql
        mutation queryOrders($query: String!) {
          bulkOperationRunQuery(
            query: $query
          ) {
            bulkOperation {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }`,
      {
        variables: {
          query: query,
        }
      }
    ); 
    const responseJson = await response.json()
    return responseJson
}

async function getDateXDaysAgo(x) {
    var t = new Date();
    t.setDate(t.getDate() - x)
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    console.log("Date " + x + " days ago: " + `${year}-${month}-${date}`)
    return `${year}-${month}-${date}`;
  }