import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function eventsRoute(app: FastifyInstance) {
  // GET /events - List events with status, next occurrence, quick actions and notification badge
  app.get('/events', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as {
      page?: string;
      pageSize?: string;
      q?: string;
      status?: string;
      tag?: string;
    };

    const page = parseInt(query.page || '1', 10);
    const pageSize = parseInt(query.pageSize || '25', 10);
    const searchQuery = query.q;
    const status = query.status;

    const result = await app.services.event.findWithFilters(
      page,
      pageSize,
      searchQuery,
      status
    );

    return {
      data: result.data,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        totalPages: Math.ceil(result.total / result.pageSize),
        totalItems: result.total,
      },
    };
  });

  // GET /events/:eventId - Get event detail
  app.get('/events/:eventId', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { eventId: string };
    const event = await app.services.event.get(params.eventId);
    return event;
  });

  // PUT /events/:eventId - Update an event
  app.put('/events/:eventId', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { eventId: string };
    const body = request.body as any;

    const updated = await app.services.event.update(params.eventId, body);
    return updated;
  });

  // DELETE /events/:eventId - Archive or delete an event
  app.delete('/events/:eventId', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { eventId: string };
    const query = request.query as { permanent?: string };

    if (query.permanent === 'true') {
      await app.services.event.remove(params.eventId);
    } else {
      await app.services.event.archive(params.eventId);
    }

    reply.code(204);
    return;
  });

  // POST /events/:eventId/duplicate - Duplicate an event
  app.post('/events/:eventId/duplicate', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { eventId: string };
    const body = request.body as { name?: string; tags?: string[] };

    let duplicated = await app.services.event.duplicate(params.eventId);

    // Apply any overrides from request body
    if (body?.name || body?.tags) {
      duplicated = await app.services.event.update(duplicated.id, body);
    }

    reply.code(201);
    return duplicated;
  });

  // POST /events/:eventId/cancel - Cancel an event occurrence or the whole event
  app.post('/events/:eventId/cancel', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { eventId: string };
    const body = request.body as { occurrence?: string; reason?: string };

    // For now, just archive the entire event
    // In the future, this could handle specific occurrence cancellations
    const cancelled = await app.services.event.archive(params.eventId);

    // Create notification about cancellation
    if (body?.reason) {
      await app.services.notification.createEventNotification(
        params.eventId,
        'Event Cancelled',
        `Event was cancelled. Reason: ${body.reason}`,
        'warning'
      );
    }

    return cancelled;
  });

  // POST /events/:eventId/quick-actions - Perform a quick action on an event
  app.post('/events/:eventId/quick-actions', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = request.params as { eventId: string };
    const body = request.body as {
      action: 'edit' | 'view' | 'duplicate' | 'cancel';
      payload?: any;
    };

    switch (body.action) {
      case 'view':
        return app.services.event.get(params.eventId);

      case 'edit':
        if (body.payload) {
          return app.services.event.update(params.eventId, body.payload);
        }
        return app.services.event.get(params.eventId);

      case 'duplicate':
        return app.services.event.duplicate(params.eventId);

      case 'cancel':
        return app.services.event.archive(params.eventId);

      default:
        throw new Error(`Invalid action: ${body.action}`);
    }
  });
}
