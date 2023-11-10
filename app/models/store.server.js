import db from "../db.server"
import { createDiscount, supplementCodes } from "~/utils/discountUtil.server";

export async function getStore(shop, id, graphql) {
    const store = await db.store.findFirst({ where: { shop: shop }});

    if (!store) {
        await prisma.store.create({
            data: {
                id: id,
                shop: shop,
            }
        })
    } else {
        store.isInstalled = true;
    }
    return supplementDiscounts(store, graphql);
}

async function supplementDiscounts(store, graphql) {
    for (let i = 0; i < 3; i++) {
        if (i === 0) {
            store.lowDiscountId = supplementDiscount(store.lowDiscountId, store.lowPctOff, graphql, 1);
        } else if (i === 1) {
            store.midDiscountId = supplementDiscount(store.midDiscountId, store.midPctOff, graphql, 2);
        } else {
            store.highDiscountId = supplementDiscount(store.highDiscountId, store.highPctOff, graphql, 3);
        }
    }

    return store;
}

async function supplementDiscount(discountId, pctOff, graphql, codesNum) {
    if (discountId === null) {
        return await createDiscount(pctOff, graphql, codesNum);
    } else {
        await supplementCodes(discountId, graphql, codesNum);
        return discountId;
    }
}