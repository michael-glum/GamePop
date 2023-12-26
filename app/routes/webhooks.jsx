import { authenticate } from "../shopify.server";
import db from "../db.server";
import { processBulkOrdersWebhook } from "./processBulkOrders";

export const action = async ({ request }) => {
  const clonedRequest = await request.clone();
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.delete({ where: { id: session.id } });
      }
      if (shop) {
        await db.store.update({ where: { shop: shop }, data: { isInstalled: false } })
      }
      throw new Response("Session deleted", { status: 200 });

    case "BULK_OPERATIONS_FINISH":
      if (topic && shop && session) {
        await processBulkOrdersWebhook(topic, shop, session, clonedRequest);
      }
      throw new Response("Bulk orders webhook reached", { status: 200 });

    case "CUSTOMERS_DATA_REQUEST":
      try {
        const email = payload?.customer?.email
        let message = "Data not found";
        let storedData = null;
        if (email != null) {
          storedData = await db.user.findUnique({ where: { email: email }, select: { email: true }})
          if (storedData != null) {
            message = "Customer data found"
          }
        }
        throw new Response(message, { data: storedData, status: 200 });
      } catch (error) {
        throw new Response("Data not found", { status: 200 })
      }

    case "CUSTOMERS_REDACT":
      try {
        const email = payload?.customer?.email
        let message = "Data not found";
        let deletedCustomer = null;
        if (email != null) {
          deletedCustomer = await db.user.delete({ where: { email: email }})
          if (deletedCustomer != null) {
            message = "Customer data redacted"
          }
        }
        throw new Response(message, { status: 200 });
      } catch (error) {
        throw new Response("Data not found", { status: 200 })
      }

    case "SHOP_REDACT":
      try {
        if (shop) {
          await db.partnership.delete({ where: { shop } });
        }
        throw new Response("Store data erased", { status: 200 });
      } catch (error) {
        throw new Response("Store data not found", { status: 200 });
      }

    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
