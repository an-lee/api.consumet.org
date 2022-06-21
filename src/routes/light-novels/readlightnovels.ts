import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { LIGHT_NOVELS } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const readlightnovels = new LIGHT_NOVELS.ReadLightNovels();

  fastify.get(
    '/readlightnovels',
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.status(200).send('Welcome to Consumet Read Light Novels');
    }
  );

  fastify.get(
    '/readlightnovels/:novel',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const queries: { novel: string; page: number } = { novel: '', page: 1 };

      queries.novel = decodeURIComponent(
        (request.params as { novel: string; page: number }).novel
      );

      queries.page = (request.query as { novel: string; page: number }).page;

      const res = await readlightnovels.search(queries.novel);

      reply.status(200).send(res);
    }
  );

  fastify.get(
    '/readlightnovels/info/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = decodeURIComponent((request.params as { id: string }).id);

      try {
        const res = await readlightnovels
          .fetchLighNovelInfo(id)
          .catch((err) => reply.status(404).send(err));

        reply.status(200).send(res);
      } catch (err) {
        reply.status(500).send('Something went wrong. Please try again later.');
      }
    }
  );

  fastify.get(
    '/readlightnovels/read/:chapterId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const chapterId = (request.params as { chapterId: string }).chapterId;

      try {
        const res = await readlightnovels
          .fetchChapterContent(chapterId)
          .catch((err) => reply.status(404).send(err));

        reply.status(200).send(res);
      } catch (err) {
        reply.status(500).send('Something went wrong. Please try again later.');
      }
    }
  );
};

export default routes;