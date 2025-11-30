import { NextRequest, NextResponse } from 'next/server';
import { captureError } from '@/lib/error-monitoring';

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>;

/**
 * Wrapper to add error monitoring to API route handlers
 * 
 * Usage:
 * export const GET = withErrorMonitoring(async (req) => {
 *   // your route logic
 * });
 */
export function withErrorMonitoring(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context?: any) => {
    const startTime = Date.now();
    
    try {
      const response = await handler(req, context);
      
      // Log errors based on status code
      // Capture 5xx (server errors) and 4xx (client errors, excluding 404)
      if (response.status >= 400 && response.status !== 404) {
        const duration = Date.now() - startTime;
        const responseBody = await response.clone().text();
        
        await captureError(new Error(`API route returned ${response.status} status`), {
          source: 'api',
          url: req.url,
          method: req.method,
          userAgent: req.headers.get('user-agent') || undefined,
          ipAddress: req.headers.get('x-forwarded-for') || undefined,
          statusCode: response.status,
          metadata: {
            duration,
            responseBody: responseBody.substring(0, 500), // Limit size
          },
        });
      }
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Capture the error
      await captureError(error as Error, {
        source: 'api',
        url: req.url,
        method: req.method,
        userAgent: req.headers.get('user-agent') || undefined,
        ipAddress: req.headers.get('x-forwarded-for') || undefined,
        statusCode: 500,
        metadata: {
          duration,
        },
      });

      // Re-throw to let Next.js handle it
      throw error;
    }
  };
}
