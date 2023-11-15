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
  const useWordGame = data.get('useWordGame');
  const useBirdGame = data.get('useBirdGame');

  const store = await db.store.findFirst({ where: { shop: shop }});

  if (store == null) {
    return null;
  }

  let success = true;
  let message = "Updated successfully";

  if (useWordGame != null) {
    store.useWordGame = (useWordGame === 'true');
    console.log("Word Game: " + store.useWordGame);
  }

  if (useBirdGame != null) {
    store.useBirdGame = (useBirdGame === 'true');
    console.log("Bird Game: " + store.useBirdGame);
  }

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
  const useWordGame = store.useWordGame;
  const useBirdGame = store.useBirdGame;

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

  const [wordGameActiveState, setWordGameActiveState] = useState(useWordGame);
  const [birdGameActiveState, setBirdGameActiveState] = useState(useBirdGame);

  const handleGameUpdate = (game, value) => {
    switch (game) {
      case 'Word Game':
        setWordGameActiveState(value === 'active');
        break;
      case 'Bird Game':
        setBirdGameActiveState(value === 'active');
        break;
      default:
        break;
    }
  }

  const updatePopUp = () => {
    submit({
      lowPctOff: parseFloat(lowPercentage) / 100,
      midPctOff: parseFloat(midPercentage) / 100,
      highPctOff: parseFloat(highPercentage) / 100,
      lowProb: parseFloat(lowProbability) / 100,
      midProb: parseFloat(midProbability) / 100,
      highProb: parseFloat(highProbability) / 100,
      useWordGame: wordGameActiveState,
      useBirdGame: birdGameActiveState,
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
          <Layout.Section variant="oneThird">
            <Card>
              <GameSection
                game="Word Game"
                source="https://i.imgur.com/i7SL76B.png"
                width="275"
                height="315"
                gap="100"
                useGame={useWordGame}
                onGameUpdate={(value) => handleGameUpdate('Word Game', value)}
              />
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <Card>
              <GameSection
                game="Bird Game"
                source="https://i.imgur.com/piyUAQ4.png?2"
                width="275"
                height="315"
                gap="100"
                useGame={useBirdGame}
                onGameUpdate={(value) => handleGameUpdate('Bird Game', value)}
              />
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
          <Layout.Section variant="fullWidth">
            <SaveDiscountsButton isLoading={isLoading} updatePopUp={updatePopUp}/>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingXl" as="h4" fontWeight="semibold" alignment="center">
                  Total Sales (All Time)
                </Text>
                <Text variant="headingLg" as="h5" fontWeight="regular" alignment="center">
                  $0
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneHalf">
            <Card>
              <BlockStack gap="200">
                <Text variant="headingXl" as="h4" fontWeight="semibold" alignment="center">
                  Commissions (Period)
                </Text>
                <Text variant="headingLg" as="h5" fontWeight="regular" alignment="center">
                  $0
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="fullWidth">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <InlineStack align="space-between">
                    <Text as="h2" variant="headingMd">
                      Your support team at Adelfi
                    </Text>
                  </InlineStack>
                  <BlockStack gap="200">
                    <Divider />
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Katie
                      </Text>
                      <Badge>
                        Marketing and Partnerships
                      </Badge>
                      <Link url="mailto:kellsworth@adelfi.shop" target="_blank">
                        kellsworth@adelfi.shop
                      </Link>
                    </InlineStack>
                    <Divider />
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Michael
                      </Text>
                      <Badge>
                        Technical Support
                      </Badge>
                      <Link url="mailto:mglum@adelfi.shop" target="_blank">
                        mglum@adelfi.shop
                      </Link>
                    </InlineStack>
                    <Divider />
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Info
                      </Text>
                      <Badge>
                        General Info
                      </Badge>
                      <Link url="mailto:info@adelfi.shop" target="_blank">
                        info@adelfi.shop
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

const GameSection = ({ game, source, width, height, gap, useGame, onGameUpdate }) => {
  const [selected, setSelected] = useState(useGame ? 'active' : 'inactive');

  const handleSelectChange = useCallback(
    (value) => {
      setSelected(value);
      onGameUpdate(value);
    },
    [onGameUpdate],
  );

  const options = [
    {label: 'Active', value: 'active'},
    {label: 'Inactive', value: 'inactive'},
  ];

  return (
    <BlockStack gap={gap}>
      <Text as="h2" variant="headingLg" alignment="center">
        {game}
      </Text>
      <Image
        source = {source}
        alt = "Word Game Image"
        width = {width}
        height = {height}
      />
      <Select
        options={options}
        onChange={handleSelectChange}
        value={selected}
      />
    </BlockStack>
  )
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
              {(tier == "Mid") ? "Medium" : tier} Discount
            </Text>
            <Text variant="heading3xl" as="h2" fontWeight="semibold" alignment="center">
              {pctValue}% Off
            </Text>
            <Text variant="headingLg" as="h5" fontWeight="regular" alignment="center">
              {probValue}% Chance
            </Text>
            <TextField
              label="Percent off"
              type="number"
              value={pctValue}
              onChange={handlePctChange}
              autoComplete="off"
            />
            <TextField
              label="Chance of occuring"
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
