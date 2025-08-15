import { Client as WorkflowCLient } from "@upstash/workflow";

import {QSTASH_URL, QSTASH_TOKEN} from "./env.js";

export const workflowClient = new WorkflowCLient( {
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN,
})