function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderComments(comments = []) {
  if (!comments.length) {
    return `<p class="blog-post-comments__empty">No comments yet. Be the first to respond.</p>`;
  }

  const renderNode = (comment) => {
    const replies = comment.replies?.length
      ? `<div class="blog-post-comments__replies">${comment.replies.map(renderNode).join('')}</div>`
      : '';

    return `
      <article class="blog-comment">
        <p class="blog-comment__meta">${escapeHtml(comment.authorName || 'Anonymous')} · ${escapeHtml(formatDate(comment.createdAt))}</p>
        <p class="blog-comment__content">${escapeHtml(comment.content || '')}</p>
        ${replies}
      </article>
    `;
  };

  return comments.map(renderNode).join('');
}

export function appBlogPostPage({ post, comments = [] }) {
  const author = `${post?.user?.first_name || ''} ${post?.user?.last_name || ''}`.trim() || 'Admin';
  const category = post?.category?.name || 'General';
  const image = post?.image || '/public/uploads/images/featured-posts.jpg';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(post.title)} - Blog</title>
    <link rel="icon" type="image/svg+xml" href="/dist/favicon.svg" />
    <link rel="stylesheet" href="/dist/css/app.css" />
  </head>
  <body class="app-shell blog-home">
    <header class="blog-header">
      <div class="blog-header__inner">
        <a class="blog-header__brand" href="/">BlogCMS</a>
        <nav class="blog-header__nav">
          <a class="blog-header__link" href="/blog">Blog</a>
        </nav>
      </div>
    </header>

    <main class="blog-main">
      <article class="blog-post-detail">
        <img class="blog-post-detail__image" src="${escapeHtml(image)}" alt="${escapeHtml(post.title)}" />
        <p class="blog-post-detail__meta">${escapeHtml(formatDate(post.created_at))} · ${escapeHtml(category)} · ${escapeHtml(author)}</p>
        <h1 class="blog-post-detail__title">${escapeHtml(post.title)}</h1>
        <div class="blog-post-detail__content">${post.post || ''}</div>

        <section class="blog-post-comments">
          <h2 class="blog-post-comments__title">Comments</h2>
          <div class="blog-post-comments__list">
            ${renderComments(comments)}
          </div>
        </section>
      </article>

      <aside class="blog-sidebar">
        <div class="blog-widget">
          <h3 class="blog-widget__title">About this post</h3>
          <p class="blog-widget__text">Published in ${escapeHtml(category)} with ${comments.length} comment${comments.length === 1 ? '' : 's'}.</p>
        </div>
        <div class="blog-widget">
          <h3 class="blog-widget__title">Back to Blog</h3>
          <p class="blog-widget__text"><a class="blog-post-card__readmore" href="/blog">View all posts</a></p>
        </div>
      </aside>
    </main>
  </body>
</html>`;
}
