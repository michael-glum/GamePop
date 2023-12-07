import db from "../db.server"

export const action = async ({ request }) => {
    try {
        const { shop, couponCode } = request.body;
        await db.store.updateMany({ where: { shop: shop },
            data: { 
                hasCoupon: true,
                couponCode: couponCode,
            }
        });

        return new Response('Coupon applied successfully', { status: 200 });
    } catch (error) {
        console.error('Error applying coupon:', error);
        return new Response('Failed to apply coupon', { status: 500 });
    }
};