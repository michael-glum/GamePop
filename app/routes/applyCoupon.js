import db from "../db.server"

export const action = async ({ request }) => {
    try {
        const { shop, couponCode } = await request.json();
        const endDate = getDateTimeXDaysFromNow(30);
        await db.store.update({ where: { shop: shop },
            data: { 
                hasCoupon: true,
                couponCode: couponCode,
                couponEndDate: endDate,
            }
        });

        return new Response('Coupon applied successfully', { status: 200 });
    } catch (error) {
        console.error('Error applying coupon:', error);
        return new Response('Failed to apply coupon', { status: 500 });
    }
};

export function getDateTimeXDaysFromNow(x) {
    let currentDate = new Date();
    let futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + x);
    return futureDate;
}