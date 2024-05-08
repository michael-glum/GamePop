import { useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  TextField,
  Form,
  FormLayout,
  Icon,
} from "@shopify/polaris";
import { MONTHLY_COMMISSION_PLAN, authenticate } from "../shopify.server";
import { getStore } from "~/models/store.server";
import { CircleTickMajor } from "@shopify/polaris-icons";

const DISCOUNT_PERCENTAGE = 20;
const COUPON_CODES = [
  "SAVE20"
];
//const COMMISSION = 5;

export const loader = async ({ request }) => {
    const { session } = await authenticate.admin(request);

    const store = await getStore(session.shop, session.id, null);

    return json({ store });
};

export const action = async ({ request }) => {
    const { billing, session } = await authenticate.admin(request);
    const { shop } = session;

    const isDevelopmentStore = (shop === 'quickstart-9f306b3f.myshopify.com');

    const billingCheck = await billing.require({
        plans: [MONTHLY_COMMISSION_PLAN],
        isTest: isDevelopmentStore,
        onFailure: async () => billing.request({
            plan: MONTHLY_COMMISSION_PLAN,
            isTest: isDevelopmentStore,
            returnUrl: "https://admin.shopify.com/apps/game-pop",
        }),
    });

    return json({ billingCheck })
};
  
export default function BillingSetUp() {
    const nav = useNavigation();
    const submit = useSubmit();
    const loaderData = useLoaderData();
    const store = loaderData?.store;
    const shop = store.shop;
    const [hasCoupon, setHasCoupon] = useState(COUPON_CODES.includes(store.couponCode));

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
              body: JSON.stringify({ shop, couponCode }),
            })
              .then((response) => {
                if (response.ok) {
                  shopify.toast.show("Coupon applied successfully");
                  setHasCoupon(true);
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
    }
  
    return (
      <Page>
        <ui-title-bar title="PopGames">
          <button variant="primary" onClick={subscribeToBilling}>
            Next
          </button>
        </ui-title-bar>
        <BlockStack gap="500">
          <Text as="h1" variant="headingLg">Commission Only Pricing - Details</Text>
          <Text as="h2" variant="bodyLg">5% commission will be charged on the first $1000 in total sales made using PopGames codes, not to exceed $49 in any 30-day billing period. No hidden or additional fees. Entry of billing information is required on the next page, but you will not be billed except for commissionable sales.</Text>
          <Card>
            <BlockStack gap="500">
              <Text as="h2" variant="headingMd">
                Enter a coupon code for a {DISCOUNT_PERCENTAGE}% discount on your first month's commissions! (Hint: SAVE20)
              </Text>
              {!hasCoupon ? (
                <CouponCodeForm
                  onSubmitCouponCode={(value, couponCode) => handleSubmitCouponCode(value, couponCode)}
                />
              ) : (
                <Icon source={CircleTickMajor} tone="success" />
              )}
            </BlockStack>
          </Card>
          <Button variant="primary" tone="success" loading={isLoading} onClick={subscribeToBilling} fullWidth>
            Next
          </Button>
        </BlockStack>
      </Page>
    );
}

function CouponCodeForm({ onSubmitCouponCode }) {
    const [couponCode, setCouponCode] = useState('');
  
    const handleSubmit = useCallback(() => {
      if (COUPON_CODES.includes(couponCode)) {
        onSubmitCouponCode(true, couponCode)
        setCouponCode("");
      } else {
        onSubmitCouponCode(false, "")
      }
    }, [couponCode, onSubmitCouponCode]);
  
    const handleCouponCodeChange = useCallback((value) => setCouponCode(value), []);
  
    return (
      <Form onSubmit={handleSubmit}>
        <BlockStack gap="200">
          <FormLayout>
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
          </FormLayout>
        </BlockStack>
      </Form>
    )
  }

  /*async function createUsageBasedAppSubscription(graphql) {
    console.log("Existing");
    const response = await graphql(
      `#graphql
        mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) {
          appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
              lineItems {
                id
              }
            }
          }
        }`,
      {
        variables: {
          "name": "Monthly Commission Plan",
          "returnUrl": "https://pop-games.fly.dev/",
          "test": false,
          "lineItems": [
            {
              "plan": {
                "appUsagePricingDetails": {
                  "terms": `${COMMISSION}% commission charged on orders made using a PopGames discount code`,
                  "cappedAmount": {
                    "amount": 10000,
                    "currencyCode": "USD",
                  }
                }
              }
            }
          ],
        }
      }
    )

    const { data } = await response.json();
    console.log("Data: " + JSON.stringify(data));
    const confirmationUrl = data.appSubscriptionCreate.confirmationUrl;
    console.log("confirmationUrl: " + confirmationUrl);
    const subscriptionId = data.appSubscriptionCreate.appSubscription.lineItems[0].id;
    console.log("subscriptionId: " + subscriptionId);
    return json({ billingId: subscriptionId, confirmationUrl: confirmationUrl });
  }*/
