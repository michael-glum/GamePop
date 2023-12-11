import { authenticate, unauthenticated } from "../shopify.server";
import { json } from "@remix-run/node"
import { Readable } from 'stream'
import { createInterface } from 'readline'
import { createAppUsageRecord } from "../utils/subscriptionUtil.server";
import db from '../db.server'

export async function processBulkOrdersWebhook ({ topic, shop, session, clonedRequest }) {
    const { admin } = await unauthenticated.admin(shop)

    /*console.log("Webhook from shop: " + shop)
    console.log("Topic: " + topic)
    console.log("Session: " + JSON.stringify(session))*/

    const { admin_graphql_api_id, status, error_code } = await clonedRequest.json();

    /*console.log("Bulk Operation Status: " + status)
    console.log("Bulk Operation Error Code: " + error_code)
    console.log("Bulk Operation Admin GraphQL API Id: " + admin_graphql_api_id)*/

    const store = await db.store.findFirst({ where: { shop: shop },
        select: {
            lowDiscountId: true,
            totalSales: true,
            currSales: true,
            lastUpdated: true,
            hasCoupon: true,
        }
    });

    if (!store) {
        console.log("Partnership not found for shop: " + shop);
        return json({ message: 'Store not found' }, { status: 200 });
    }

    if (store.lowDiscountId == null) {
        console.log('Store table not properly initialized for shop: ' + shop);
        return json({ message: 'Store table not initialized' }, { status: 200 });
    }

    const response = await admin.graphql(
        `#graphql
            query getBulkOperationUrl($id: ID!) {
                node(id: $id) {
                    ... on BulkOperation {
                        url
                        partialDataUrl
                    }
                }
            }`,
        {
            variables: {
                id: admin_graphql_api_id
            }
        }
    );

    const { data } = await response.json();
    const dataUrl = data.node.url;
    const partialDataUrl = data.node.partialDataUrl;

    const url = (status == "completed") ? dataUrl : partialDataUrl;
    const jsonDataArray = await downloadJsonData(url);
    if (jsonDataArray != null) {
        let newSales = 0.0;
        for (let i = 0; i < jsonDataArray.length; i++) {
            const responseJson = jsonDataArray[i];
            for (const code of responseJson.discountCodes) {
                if (code.startsWith("POPGAMES")) {
                    newSales = newSales + parseFloat(responseJson.netPaymentSet.shopMoney.amount);
                    break;
                }
            }
        }
        store.totalSales = store.totalSales + newSales;
        store.currSales = store.currSales + newSales;
        try {
            const today = await getCurrentDate();
            if (store.lastUpdated === today) {
                return json({ success: true }, {status: 200 });
            }
            store.lastUpdated = today;
            const couponActive = false;
            const usageRecordId = await createAppUsageRecord(store.billingId, newSales, couponActive, admin.graphql);
            console.log("usageRecordId: " + usageRecordId);
            const updateResponses = await db.store.updateMany({ where: { shop: shop}, data: { ...store }});
            if (updateResponses.count === 0) {
                console.error("Error: Couldn't update store in db for shop: " + shop);
                return json({ success: true }, { status: 200 });
            }
        } catch (error) {
            console.error("Error updating store for shop: " + shop);
            return json({ success: true }, { status: 200 });
        }
    }
    return json({ success: true }, { status: 200 });
}

async function downloadJsonData(url) {
    const response = await fetch(url);
    if (response.status === 200) {
        const reader = response.body?.getReader();
        const stream = new Readable({
            read() {},
        });

        reader?.read().then(function processResult(result) {
            if (result.done) {
                stream.push(null);
                return;
            }

            const chunk = result.value;

            stream.push(chunk);

            return reader.read().then(processResult);
        });

        const rl = createInterface({
            input: stream,
            crlfDelay: Infinity,
        });

        const jsonDataArray = [];

        for await (const line of rl) {
            try {
                const jsonData = JSON.parse(line);
                jsonDataArray.push(jsonData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }

        return jsonDataArray;
    } else {
        console.log('Failed to fetch data. Response: ' + response.status)
        return null
    }
}

async function getCurrentDate() {
    const t = new Date();
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return `${year}-${month}-${date}`;
}