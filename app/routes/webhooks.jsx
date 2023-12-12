import { authenticate } from "../shopify.server";
import db from "../db.server";
import { processBulkOrdersWebhook } from "./processBulkOrders";

export const action = async ({ request }) => {
  const clonedRequest = await request.clone();
  const { topic, session, admin, payload } = await authenticate.webhook(request);
  const { shop } = session;

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }

      break;
    case "BULK_OPERATIONS_FINISH":
      if (topic && shop && session) {
        await processBulkOrdersWebhook(topic, shop, session, clonedRequest);
      }

      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
