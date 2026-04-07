// src/templates/admin/pages/subscribers/new.js
// New Subscriber Page - Form to add a subscriber

import { mainLayout } from '../../layouts/main.js';

/**
 * New Subscriber Page Template
 * @param {Object} params - Template parameters
 * @param {Object} params.user - Current user
 * @param {string} params.error - Optional error message
 */
export function newSubscriberPage({ user, error }) {
  const content = `
    <div class="subscribers">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header__left">
            <h1 class="page-header__title">Add Subscriber</h1>
            <p class="page-header__subtitle">Add a new subscriber to your newsletter</p>
          </div>
        </div>

        ${error ? `<div class="alert alert--error mb-[1.6rem]">${error}</div>` : ''}

        <!-- Form -->
        <div class="max-w-lg">
          <form
            action="/admin/subscribers"
            method="POST"
            class="space-y-6"
          >
            <input type="hidden" name="_csrf" value="${user?.csrfToken || ''}" />

            <div class="form__group">
              <label class="label" for="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                class="input"
                placeholder="John Doe"
              />
            </div>

            <div class="form__group">
              <label class="label" for="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                class="input"
                placeholder="john@example.com"
                required
              />
            </div>

            <div class="form__group">
              <label class="label" for="status">Status</label>
              <select
                id="status"
                name="status"
                class="hidden"
                data-hs-select='{
                  "placeholder": "Select status...",
                  "toggleClasses": "form__select-toggle",
                  "dropdownClasses": "form__select-dropdown",
                  "optionClasses": "form__select-option"
                }'
              >
                <option value="ACTIVE" selected>Active</option>
                <option value="PENDING">Pending</option>
                <option value="UNSUBSCRIBED">Unsubscribed</option>
                <option value="BOUNCED">Bounced</option>
              </select>
            </div>

            <div class="flex items-center gap-4 pt-4">
              <button type="submit" class="btn btn--primary">
                Add Subscriber
              </button>
              <a href="/admin/subscribers" class="btn btn--outline">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  return mainLayout({
    title: 'Add Subscriber',
    description: 'Add a new subscriber to your newsletter',
    content,
    user,
    activeRoute: '/admin/subscribers',
    breadcrumbs: [
      { label: 'Dashboard', url: '/admin' },
      { label: 'Subscribers', url: '/admin/subscribers' },
      { label: 'Add Subscriber', url: '/admin/subscribers/new' }
    ]
  });
}
