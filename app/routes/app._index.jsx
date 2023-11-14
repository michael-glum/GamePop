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
  Box,
  List,
  Link,
  InlineStack,
  TextField,
  Toast,
  Frame,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { getStore } from "~/models/store.server";
import { updateDiscountPercentage } from "~/utils/discountUtil.server";
import db from "../db.server"

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const store = await getStore(session.shop, session.id, admin.graphql);
  return json({ store });
};

export const action = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  const { shop } = session;
  const body = await request.text();
  const data = new URLSearchParams(body);
  const lowPctOff = parseFloat(data.get('lowPctOff'));
  const midPctOff = parseFloat(data.get('midPctOff'));
  const highPctOff = parseFloat(data.get('highPctOff'));
  const lowProb = parseFloat(data.get('lowProb'));
  const midProb = parseFloat(data.get('midProb'));
  const highProb = parseFloat(data.get('highProb'));

  const store = await db.store.findFirst({ where: { shop: shop }});

  if (store == null) {
    return null;
  }

  let success = true;
  let message = "Updated successfully";

  if (lowProb + midProb + highProb == 1) {
    if (store.lowProb != lowProb) {
      store.lowProb = lowProb;
    }
    if (store.midProb != midProb) {
      store.midProb = midProb;
    }
    if (store.highProb != highProb) {
      store.highProb = highProb;
    }
  } else {
    success = false;
    message = "Probabilities must add up to 100";
  }

  if (lowPctOff < midPctOff && midPctOff < highPctOff) {
    if (success != false) {
      if (store.lowPctOff != lowPctOff) {
        success = await updateDiscountPercentage(store.lowDiscountId, lowPctOff, admin.graphql);
        store.lowPctOff = lowPctOff;
      }
    
      if (store.midPctOff != midPctOff) {
        success = await updateDiscountPercentage(store.midDiscountId, midPctOff, admin.graphql) && success;
        store.midPctOff = midPctOff;
      }
    
      if (store.highPctOff != highPctOff) {
        success = await updateDiscountPercentage(store.highDiscountId, highPctOff, admin.graphql) && success;
        store.highPctOff = highPctOff;
      }
  
      if (success == false) {
        message = "Update failed";
      } else {
        await db.store.updateMany({ where: { shop: shop }, data: { ...store }});
      }
    }
  } else {
    success = false;
    message = "Higher tier discounts must provide a larger percentage off than the tiers below them"
  }

  return json({
    success,
    message
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const loaderData = useLoaderData();
  const store = loaderData?.store;
  const lowPctOff = store.lowPctOff;
  const midPctOff = store.midPctOff;
  const highPctOff = store.highPctOff;
  const lowProb = store.lowProb;
  const midProb = store.midProb;
  const highProb = store.highProb;

  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";

  const message = actionData?.message;

  useEffect(() => {
    if (message) {
      shopify.toast.show(message);
    }
  }, [message]);

  const [lowPercentage, setLowPercentage] = useState('' + Math.floor(lowPctOff * 100));
  const [midPercentage, setMidPercentage] = useState('' + Math.floor(midPctOff * 100));
  const [highPercentage, setHighPercentage] = useState('' + Math.floor(highPctOff * 100));

  const handlePctUpdate = (tier, value) => {
    switch (tier) {
      case 'Low':
        setLowPercentage(value);
        break;
      case 'Mid':
        setMidPercentage(value);
        break;
      case 'High':
        setHighPercentage(value);
        break;
      default:
        break;
    }
  };

  const [lowProbability, setLowProbability] = useState('' + Math.floor(lowProb * 100));
  const [midProbability, setMidProbability] = useState('' + Math.floor(midProb * 100));
  const [highProbability, setHighProbability] = useState('' + Math.floor(highProb * 100));

  const handleProbUpdate = (tier, value) => {
    switch (tier) {
      case 'Low':
        setLowProbability(value);
        break;
      case 'Mid':
        setMidProbability(value);
        break;
      case 'High':
        setHighProbability(value);
        break;
      default:
        break;
    }
  };

  const updatePopUp = () => {
    submit({
      lowPctOff: parseFloat(lowPercentage) / 100,
      midPctOff: parseFloat(midPercentage) / 100,
      highPctOff: parseFloat(highPercentage) / 100,
      lowProb: parseFloat(lowProbability) / 100,
      midProb: parseFloat(midProbability) / 100,
      highProb: parseFloat(highProbability) / 100,
    }, { replace: true, method: "POST" });
  };

  return (
    <Page>
      <ui-title-bar title="Pop Games">
        <button variant="primary" onClick={updatePopUp}>
          Save
        </button>
      </ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Congrats on creating a new Shopify app 🎉
                  </Text>
                  <Text variant="bodyMd" as="p">
                    This embedded app template uses{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      target="_blank"
                      removeUnderline
                    >
                      App Bridge
                    </Link>{" "}
                    interface examples like an{" "}
                    <Link url="/app/additional" removeUnderline>
                      additional page in the app nav
                    </Link>
                    , as well as an{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql"
                      target="_blank"
                      removeUnderline
                    >
                      Admin GraphQL
                    </Link>{" "}
                    mutation demo, to provide a starting point for app
                    development.
                  </Text>
                </BlockStack>
                <BlockStack gap="200">
                  <Text as="h3" variant="headingMd">
                    Get started with products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output for
                    that product. Learn more about the{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
                      target="_blank"
                      removeUnderline
                    >
                      productCreate
                    </Link>{" "}
                    mutation in our API references.
                  </Text>
                </BlockStack>
                <InlineStack gap="300">
                  <Button loading={isLoading} onClick={updatePopUp}>
                    Update Pop Up
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
              <BlockStack gap="500">
                <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      App template specs
                    </Text>
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Framework
                        </Text>
                        <Link
                          url="https://remix.run"
                          target="_blank"
                          removeUnderline
                        >
                          Remix
                        </Link>
                      </InlineStack>
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Database
                        </Text>
                        <Link
                          url="https://www.prisma.io/"
                          target="_blank"
                          removeUnderline
                        >
                          Prisma
                        </Link>
                      </InlineStack>
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Interface
                        </Text>
                        <span>
                          <Link
                            url="https://polaris.shopify.com"
                            target="_blank"
                            removeUnderline
                          >
                            Polaris
                          </Link>
                          {", "}
                          <Link
                            url="https://shopify.dev/docs/apps/tools/app-bridge"
                            target="_blank"
                            removeUnderline
                          >
                            App Bridge
                          </Link>
                        </span>
                      </InlineStack>
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          API
                        </Text>
                        <Link
                          url="https://shopify.dev/docs/api/admin-graphql"
                          target="_blank"
                          removeUnderline
                        >
                          GraphQL API
                        </Link>
                      </InlineStack>
                    </BlockStack>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="200">
                    <Text as="h2" variant="headingMd">
                      Next steps
                    </Text>
                    <List>
                      <List.Item>
                        Build an{" "}
                        <Link
                          url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                          target="_blank"
                          removeUnderline
                        >
                          {" "}
                          example app
                        </Link>{" "}
                        to get started
                      </List.Item>
                      <List.Item>
                        Explore Shopify’s API with{" "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                          target="_blank"
                          removeUnderline
                        >
                          GraphiQL
                        </Link>
                      </List.Item>
                    </List>
                  </BlockStack>
                </Card>
              </BlockStack>
          </Layout.Section>
          <DiscountSection
            tier="Low"
            percentage={lowPctOff}
            probability={lowProb}
            onPctUpdate={(percentage) => handlePctUpdate('Low', percentage)}
            onProbUpdate={(probability) => handleProbUpdate('Low', probability)}
          />
          <DiscountSection
            tier="Mid"
            percentage={midPctOff}
            probability={midProb}
            onPctUpdate={(percentage) => handlePctUpdate('Mid', percentage)}
            onProbUpdate={(probability) => handleProbUpdate('Mid', probability)}
          />
          <DiscountSection
            tier="High"
            percentage={highPctOff}
            probability={highProb}
            onPctUpdate={(percentage) => handlePctUpdate('High', percentage)}
            onProbUpdate={(probability) => handleProbUpdate('High', probability)}
          />
          <Layout.Section>
            <SaveDiscountsButton isLoading={isLoading} updatePopUp={updatePopUp}/>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

const PercentageField = ({ percentage, onUpdate }) => {
  const [value, setValue] = useState('' + Math.floor(percentage * 100));

  const handleChange = useCallback(
    (newValue) => { 
      setValue(newValue);
      onUpdate(newValue);
    },
    [onUpdate],
  );

  return (
    <>
      <Text variant="heading3xl" as="h2" fontWeight="medium" alignment="center">
        {value}% Off
      </Text>
      <TextField
        label="Percentage"
        type="number"
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />
    </>
  );
}

const ProbabilityField = ({ probability, onUpdate }) => {
  const [value, setValue] = useState('' + Math.floor(probability * 100));

  const handleChange = useCallback(
    (newValue) => { 
      setValue(newValue);
      onUpdate(newValue);
    },
    [onUpdate],
  );

  return (
    <>
      <Text variant="heading2x1" as="h4" fontWeight="medium" alignment="center">
        {value}% likelihood
      </Text>
      <TextField
        label="Probability"
        type="number"
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />
    </>
  );
}

const DiscountSection = ({ tier, percentage, probability, onPctUpdate, onProbUpdate }) => {
  const [pctValue, setPctValue] = useState('' + Math.floor(percentage * 100));
  const [probValue, setProbValue] = useState('' + Math.floor(probability * 100));

  const handlePctChange = useCallback(
    (newPctValue) => { 
      setPctValue(newPctValue);
      onPctUpdate(newPctValue);
    },
    [onPctUpdate],
  );

  const handleProbChange = useCallback(
    (newProbValue) => { 
      setProbValue(newProbValue);
      onProbUpdate(newProbValue);
    },
    [onProbUpdate],
  );

  return (
    <Layout.Section variant="oneThird">
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              {tier} Discount
            </Text>
            <Text variant="heading3xl" as="h2" fontWeight="semibold" alignment="center">
              {pctValue}% Off
            </Text>
            <Text variant="headingLg" as="h5" fontWeight="regular" alignment="center">
              {probValue}% Chance
            </Text>
            <TextField
              label="Percentage off"
              type="number"
              value={pctValue}
              onChange={handlePctChange}
              autoComplete="off"
            />
            <TextField
              label="Probability of occurring"
              type="number"
              value={probValue}
              onChange={handleProbChange}
              autoComplete="off"
            />
          </BlockStack>
        </Card>
      </BlockStack>
    </Layout.Section>
  )
}

function SaveDiscountsButton({ isLoading, updatePopUp }) {
  return <Button variant="primary" tone="success" loading={isLoading} onClick={updatePopUp} fullWidth>Save</Button>;
}
