import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint to forward Vercel deployment events to Discord
 * 
 * Configure in Vercel Dashboard:
 * Settings → Webhooks → Add Webhook
 * URL: https://your-app.vercel.app/api/webhooks/vercel-deploy
 * Events: deployment.created, deployment.succeeded, deployment.failed, deployment.canceled
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    const { deployment, project } = payload;
    const status = deployment.state; // 'READY', 'ERROR', 'QUEUED', 'BUILDING', 'CANCELED'
    
    // Map deployment states to Discord colors and emojis
    const colors: Record<string, number> = {
      READY: 0x00FF00,      // Green
      ERROR: 0xFF0000,      // Red
      BUILDING: 0xFFCC00,   // Yellow
      QUEUED: 0x808080,     // Gray
      CANCELED: 0xFF6600,   // Orange
    };
    
    const emojis: Record<string, string> = {
      READY: '✅',
      ERROR: '❌',
      BUILDING: '🔨',
      QUEUED: '⏳',
      CANCELED: '🚫',
    };
    
    // Build Discord embed
    const embed = {
      title: `${emojis[status] || '📦'} Deployment ${status}`,
      description: `Project: **${project.name}**`,
      color: colors[status] || 0x0099FF,
      fields: [
        {
          name: 'Status',
          value: status,
          inline: true,
        },
        {
          name: 'Environment',
          value: deployment.target || 'production',
          inline: true,
        },
        {
          name: 'URL',
          value: deployment.url ? `https://${deployment.url}` : 'N/A',
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: `Deployment ID: ${deployment.id}`,
      },
    };
    
    if (deployment.creator) {
      embed.fields.push({
        name: 'Deployed by',
        value: deployment.creator.username || deployment.creator.email,
        inline: true,
      });
    }
    
    // Send to Discord
    const discordWebhook = process.env.DISCORD_WEBHOOK_DEPLOY;
    
    if (!discordWebhook) {
      console.error('DISCORD_WEBHOOK_DEPLOY not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }
    
    const response = await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Vercel Deployments',
        avatar_url: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
        embeds: [embed],
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send Discord notification:', errorText);
      return NextResponse.json({ error: 'Discord notification failed' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing Vercel webhook:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
