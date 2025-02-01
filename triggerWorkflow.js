import { Client } from '@upstash/workflow';
import 'dotenv/config';

const client = new Client({ token: process.env.QSTASH_TOKEN });
const endpointUrl = `${process.env.VPS_PUBLIC_IP}/api/workflow`;

const subscriptionId = "";

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
