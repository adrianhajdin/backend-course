// triggerWorkflow.js

import { Client } from '@upstash/workflow';
import 'dotenv/config';

const client = new Client({ token: process.env.QSTASH_TOKEN });
console.log("VPS_PUBLIC_IP", process.env.VPS_PUBLIC_IP);
console.log("QSTASH_TOKEN", process.env.QSTASH_TOKEN);
const endpointUrl = `${process.env.VPS_PUBLIC_IP}/api/workflow`;
const subscriptionId = "679de1166eaa8bc2b407b592";
const notBefore = new Date(Date.now() + 60000).toISOString();

async function triggerWorkflow() {
  try {
    const response = await client.trigger({
      url: endpointUrl,
      body: { subscriptionId },
      notBefore,
    });
    console.log("Workflow triggered successfully:", response);
  } catch (error) {
    console.error("Error triggering workflow:", error);
  }
}

triggerWorkflow();
