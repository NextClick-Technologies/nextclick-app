import { logger } from "@/shared/lib/logs/logger";
import type { ErrorLog } from "./types";

interface JiraIssue {
  fields: {
    project: { key: string };
    summary: string;
    description: {
      type: string;
      version: number;
      content: any[];
    };
    issuetype: { name: string };
    priority: { name: string };
    labels: string[];
  };
}

const SEVERITY_TO_PRIORITY = {
  critical: "Highest",
  high: "High",
  medium: "Medium",
  low: "Low",
  noise: "Lowest",
};

export async function createJiraIssue(errorLog: ErrorLog): Promise<string> {
  if (
    !process.env.JIRA_HOST ||
    !process.env.JIRA_EMAIL ||
    !process.env.JIRA_API_TOKEN
  ) {
    logger.warn("Jira credentials not configured, skipping ticket creation");
    return "";
  }

  // Validate JIRA_HOST format
  const jiraHost = process.env.JIRA_HOST.replace(/^https?:\/\//, "").replace(
    /\/$/,
    ""
  );

  if (!jiraHost.includes(".atlassian.net")) {
    logger.error(
      {
        jiraHost: process.env.JIRA_HOST,
        correctedHost: jiraHost,
      },
      "Invalid JIRA_HOST format. Should be: your-domain.atlassian.net (without https://)"
    );
    return "";
  }

  const auth = Buffer.from(
    `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
  ).toString("base64");

  logger.info(
    {
      jiraHost,
      email: process.env.JIRA_EMAIL?.substring(0, 3) + "***",
      projectKey: process.env.JIRA_PROJECT_KEY,
    },
    "Creating Jira issue"
  );

  // Jira uses Atlassian Document Format (ADF) for rich text
  const description = {
    type: "doc",
    version: 1,
    content: [
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Error Details" }],
      },
      {
        type: "bulletList",
        content: [
          createListItem(`Type: ${errorLog.error_type}`),
          createListItem(`Severity: ${errorLog.severity}`),
          createListItem(`Source: ${errorLog.source}`),
          createListItem(`First Seen: ${errorLog.first_seen}`),
          createListItem(`Occurrences: ${errorLog.occurrence_count}`),
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Message" }],
      },
      {
        type: "codeBlock",
        attrs: { language: "text" },
        content: [{ type: "text", text: errorLog.message }],
      },
    ],
  };

  if (errorLog.stack_trace) {
    description.content.push(
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "Stack Trace" }],
      },
      {
        type: "codeBlock",
        attrs: { language: "text" },
        content: [{ type: "text", text: truncate(errorLog.stack_trace, 5000) }],
      }
    );
  }

  description.content.push(
    {
      type: "heading",
      attrs: { level: 3 },
      content: [{ type: "text", text: "Context" }],
    },
    {
      type: "bulletList",
      content: [
        createListItem(`URL: ${errorLog.url || "N/A"}`),
        createListItem(`Method: ${errorLog.method || "N/A"}`),
        createListItem(`User Agent: ${errorLog.user_agent || "N/A"}`),
        createListItem(`Supabase Log ID: ${errorLog.id}`),
      ],
    }
  );

  const issue: JiraIssue = {
    fields: {
      project: { key: process.env.JIRA_PROJECT_KEY! },
      summary: `[${errorLog.severity}] ${errorLog.error_type}: ${truncate(
        errorLog.message,
        80
      )}`,
      description,
      issuetype: { name: "Bug" },
      priority: {
        name: SEVERITY_TO_PRIORITY[errorLog.severity],
      },
      labels: [
        "automated",
        `severity-${errorLog.severity}`,
        `source-${errorLog.source}`,
        errorLog.environment || "unknown",
      ],
    },
  };

  try {
    const response = await fetch(`https://${jiraHost}/rest/api/3/issue`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          jiraHost: process.env.JIRA_HOST,
        },
        "Failed to create Jira issue"
      );

      throw new Error(`Jira API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    logger.info(
      { issueKey: data.key, errorId: errorLog.id },
      "Created Jira issue"
    );

    return data.key; // e.g., "EM-123"
  } catch (error) {
    // Log full error details
    if (error instanceof Error) {
      logger.error(
        {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        "Error creating Jira issue"
      );
    } else {
      logger.error({ error: String(error) }, "Error creating Jira issue");
    }
    return "";
  }
}

function createListItem(text: string) {
  return {
    type: "listItem",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}
