import { logger } from '@/shared/lib/logger';
import type { ErrorLog } from './types';

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields: Array<{ name: string; value: string; inline?: boolean }>;
  timestamp: string;
  footer?: { text: string };
}

const SEVERITY_COLORS = {
  critical: 0xFF0000, // Red
  high: 0xFF6600,     // Orange
  medium: 0xFFCC00,   // Yellow
  low: 0x0099FF,      // Blue
  noise: 0x808080,    // Gray
};

const SEVERITY_EMOJIS = {
  critical: '🔥',
  high: '🚨',
  medium: '⚠️',
  low: 'ℹ️',
  noise: '🔇',
};

export async function notifyDiscord(errorLog: ErrorLog): Promise<string | null> {
  const webhookUrl = getWebhookUrl(errorLog.severity);
  
  if (!webhookUrl) {
    logger.warn({ severity: errorLog.severity }, 'No Discord webhook configured for severity');
    return null;
  }

  const embed: DiscordEmbed = {
    title: `${SEVERITY_EMOJIS[errorLog.severity]} ${errorLog.severity.toUpperCase()}: ${errorLog.error_type}`,
    description: truncate(errorLog.message, 200),
    color: SEVERITY_COLORS[errorLog.severity],
    fields: [
      { name: 'Source', value: errorLog.source, inline: true },
      { name: 'Environment', value: errorLog.environment || 'unknown', inline: true },
      { name: 'Occurrences', value: errorLog.occurrence_count.toString(), inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: `Error ID: ${errorLog.id}` },
  };

  if (errorLog.url) {
    embed.fields.push({ name: 'URL', value: truncate(errorLog.url, 100), inline: false });
  }

  if (errorLog.method) {
    embed.fields.push({ name: 'Method', value: errorLog.method, inline: true });
  }

  if (errorLog.jira_issue_key) {
    const jiraUrl = `https://${process.env.JIRA_HOST}/browse/${errorLog.jira_issue_key}`;
    embed.fields.push({
      name: 'Jira Ticket',
      value: `[${errorLog.jira_issue_key}](${jiraUrl})`,
      inline: false,
    });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Error Monitor',
        avatar_url: 'https://cdn-icons-png.flaticon.com/512/4201/4201973.png',
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      logger.error({ status: response.status }, 'Failed to send Discord notification');
      return null;
    }

    // Discord doesn't return message ID in webhook response, but we can extract from headers
    const messageId = response.headers.get('x-message-id');
    logger.info({ errorId: errorLog.id, messageId }, 'Sent Discord notification');
    
    return messageId;
  } catch (error) {
    logger.error({ error }, 'Error sending Discord notification');
    return null;
  }
}

function getWebhookUrl(severity: string): string | undefined {
  switch (severity) {
    case 'critical':
      return process.env.DISCORD_WEBHOOK_CRITICAL;
    case 'high':
      return process.env.DISCORD_WEBHOOK_HIGH;
    case 'medium':
      return process.env.DISCORD_WEBHOOK_MEDIUM;
    default:
      return undefined;
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
