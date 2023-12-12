import db from "../db.server"
import { createDiscount, discountStillExists } from "~/utils/discountUtil.server";

export async function getStore(shop, id, graphql) {
    let store = await db.store.findUnique({ where: { shop: shop }});

    if (!store) {
        await db.store.create({
            data: {
                id: id,
                shop: shop,
            }
        })
        store = await db.store.findUnique({ where: { shop: shop }})
    } else {
        store.isInstalled = true;
    }

    if (graphql != null) {
        const updatedStore = await supplementDiscounts(store, graphql);
        await db.store.update({ where: { shop: shop }, data: { ...updatedStore }});
        return updatedStore;
    } else {
        return store;
    }
}

async function supplementDiscounts(store, graphql) {
    store.lowDiscountId = await supplementDiscount(store.lowDiscountId, store.lowPctOff, graphql, 1);
    store.midDiscountId = await supplementDiscount(store.midDiscountId, store.midPctOff, graphql, 2);
    store.highDiscountId = await supplementDiscount(store.highDiscountId, store.highPctOff, graphql, 3);
    return store;
}

async function supplementDiscount(discountId, pctOff, graphql, codesNum) {
    if (discountId === null) {
        return await createDiscount(pctOff, graphql, codesNum);
    } else {
        if (await discountStillExists(discountId, graphql)) {
            return discountId;
        }
        return await createDiscount(pctOff, graphql, codesNum);
    }
}