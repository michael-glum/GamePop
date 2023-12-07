import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  List,
  Link,
  InlineStack,
  TextField,
  Image,
  Select,
  Divider,
  Badge,
  Form,
  FormLayout,
  Icon,
} from "@shopify/polaris";
import { MONTHLY_COMMISSION_PLAN, authenticate } from "../shopify.server";
import { getStore } from "~/models/store.server";
import { CircleTickMajor } from "@shopify/polaris-icons";

const DISCOUNT_PERCENTAGE = 20;
const COUPON_CODES = ["SAVE10"];

export const loader = async ({ request }) => {
    const { admin, session } = await authenticate.admin(request);
    /*const { searchParams } = new URL(request.url);
    const shop = decodeURIComponent(searchParams.get('shop'));
    const id = searchParams.get('id');*/

    const store = await getStore(session.shop, session.id, null /*admin.graphql*/);
    return json({ store });
};

export const action = async ({ request }) => {
    const { billing } = await authenticate.admin(request);

    const billingCheck = await billing.require({
        plans: [MONTHLY_COMMISSION_PLAN],
        isTest: true,
        onFailure: async () => billing.request({
            plan: MONTHLY_COMMISSION_PLAN,
            returnUrl: '/app/_index'
        }),
    });

    return json({ billingCheck });
};
  
export default function BillingSetUp() {
    const nav = useNavigation();
    const submit = useSubmit();
    const loaderData = useLoaderData();
    const store = loaderData?.store;
    let hasCoupon = store.hasCoupon;

    const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

    const handleSubmitCouponCode = (value, couponCode) => {
        if (value) {
          if (!hasCoupon) {
            fetch('/applyCoupon', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ shop: store.shop, couponCode: couponCode }),
            })
              .then((response) => {
                if (response.ok) {
                  shopify.toast.show("Coupon applied successfully");
                } else {
                  shopify.toast.show("Failed to apply coupon");
                }
              })
              .catch((error) => {
                console.error('Error applying coupon:', error);
                shopify.toast.show("Failed to apply coupon");
              })
          }
        } else {
          shopify.toast.show("Invalid coupon");
        }
    }

    const subscribeToBilling = () => {
        submit({}, { replace: true, method: "POST" })
    };
  
    return (
      <Page>
        <ui-title-bar title="Pop Games">
          <button variant="primary" onClick={subscribeToBilling}>
            Confirm
          </button>
        </ui-title-bar>
        <BlockStack gap="500">
          <Text as="h1" variant="headingXl">Were you refered to PopGames?</Text>
          <Card>
            <Text as="h2" variant="headingMd">
              Enter a coupon code for a ${DISCOUNT_PERCENTAGE}% discount on your first month's commissions!
            </Text>
            <CouponCodeForm
              onSubmitCouponCode={(value, couponCode) => handleSubmitCouponCode(value, couponCode)}
              couponState={hasCoupon}
            />
          </Card>
          <Button variant="primary" tone="success" loading={isLoading} onClick={subscribeToBilling} fullWidth>
            Confirm
          </Button>
        </BlockStack>
      </Page>
    );
}

function CouponCodeForm({ onSubmitCouponCode, couponState }) {
    const [couponCode, setCouponCode] = useState('');
    const [hasCoupon, setHasCoupon] = useState(couponState);
  
    const handleSubmit = useCallback(() => {
      if (COUPON_CODES.includes(couponCode)) {
        setHasCoupon(true);
        onSubmitCouponCode(true, couponCode)
        setCouponCode('');
      } else {
        onSubmitCouponCode(false, "")
      }
    }, [couponCode, onSubmitCouponCode]);
  
    const handleCouponCodeChange = useCallback((value) => setCouponCode(value), []);
  
    return (
      <Form onSubmit={handleSubmit}>
        <FormLayout>
          {!hasCoupon && (
            <>
              <TextField
                value={couponCode}
                onChange={handleCouponCodeChange}
                label="Coupon Code"
                type="text"
                helpText={
                  <span>
                    Enter your coupon code here.
                  </span>
                }
              />
              <Button submit>Submit</Button>
            </>
          )}
          {hasCoupon && (
            <InlineStack align="center" gap="0">
              <Icon source={CircleTickMajor} tone="success" />
              <Text alignment="start">Redeemed</Text>
            </InlineStack>
          )}
        </FormLayout>
      </Form>
    )
  }