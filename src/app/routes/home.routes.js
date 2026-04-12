import { homeController } from '../controllers/home.controller.js';
import { blogController } from '../controllers/blog.controller.js';

export default async function homeRoutes(fastify) {
  fastify.get('/', homeController.index.bind(homeController));
  fastify.get('/blog', blogController.index.bind(blogController));
  fastify.get('/blog/:slug', blogController.show.bind(blogController));
}
