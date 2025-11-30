import { NextRequest, NextResponse } from "next/server";
import { withErrorMonitoring } from "@/lib/error-monitoring/api-wrapper";

/**
 * Test endpoint for error monitoring system
 * Use this to verify error capture, Discord notifications, and Jira ticketing
 */
export const GET = withErrorMonitoring(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const errorType = searchParams.get('type');

  switch (errorType) {
    case 'critical':
      // Simulate database connection error
      throw new Error('ECONNREFUSED: Database connection failed');

    case 'high':
      // Simulate 500 error
      return NextResponse.json(
        { error: 'Internal server error occurred' },
        { status: 500 }
      );

    case 'medium':
      // Simulate 400 error
      return NextResponse.json(
        { error: 'Bad request' },
        { status: 400 }
      );

    case 'client':
      // Return HTML page with intentional client error
      return new NextResponse(
        `<!DOCTYPE html>
<html>
  <head><title>Client Error Test</title></head>
  <body>
    <h1>Client Error Test</h1>
    <button onclick="throwError()">Throw Error</button>
    <button onclick="throwRejection()">Throw Promise Rejection</button>
    <script>
      function throwError() {
        throw new Error('Test client-side error');
      }
      function throwRejection() {
        Promise.reject(new Error('Test promise rejection'));
      }
    </script>
  </body>
</html>`,
        {
          headers: { 'Content-Type': 'text/html' },
        }
      );

    default:
      return NextResponse.json({
        message: 'Error Monitoring Test Endpoint',
        usage: {
          critical: '/api/test-errors?type=critical',
          high: '/api/test-errors?type=high',
          medium: '/api/test-errors?type=medium',
          client: '/api/test-errors?type=client',
        },
        status: {
          errorMonitoring: process.env.ENABLE_ERROR_MONITORING === 'true',
          discord: {
            critical: !!process.env.DISCORD_WEBHOOK_CRITICAL,
            high: !!process.env.DISCORD_WEBHOOK_HIGH,
            medium: !!process.env.DISCORD_WEBHOOK_MEDIUM,
          },
          jira: {
            configured: !!(process.env.JIRA_HOST && process.env.JIRA_API_TOKEN),
          },
        },
      });
  }
});
