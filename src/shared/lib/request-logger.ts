import { logger } from './logger';
import { NextRequest, NextResponse } from 'next/server';

interface RequestLogContext {
  method: string;
  url: string;
  ip?: string;
  userAgent?: string;
  requestId?: string;
  userId?: string;
  status?: number;
  duration?: number;
  error?: Error;
}

export const logRequest = (req: NextRequest, context: Partial<RequestLogContext>) => {
  const {
    method,
    url,
    ip,
    userAgent,
    requestId,
    userId,
    status,
    duration,
    error,
  } = context;

  const logData = {
    http_verb: method || req.method,
    path: url || req.url,
    source_ip: ip || req.headers.get('x-forwarded-for') || 'unknown',
    user_agent: userAgent || req.headers.get('user-agent'),
    request_id: requestId,
    user_id: userId,
    response_status: status,
    request_duration_ms: duration,
    error_message: error?.message,
    error_stack: error?.stack,
  };

  if (error || (status && status >= 500)) {
    logger.error(logData, 'Request failed');
  } else if (status && status >= 400) {
    logger.warn(logData, 'Request completed with client error');
  } else {
    logger.info(logData, 'Request completed successfully');
  }
};
