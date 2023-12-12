import { defer } from "@defer/client";

const API_BASE_URL = "https://pop-games.fly.dev/";
const UPDATE_SALES_TASK = "UPDATE_SALES";

async function updateSales() {
    const requestBody = {
        token: process.env.PRIVATE_AUTH_TOKEN,
        task: UPDATE_SALES_TASK
    }
    const response = await fetch(`${API_BASE_URL}storeUpdates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
    });

    return response
}

export default defer.cron(updateSales, "57 23 * * *");