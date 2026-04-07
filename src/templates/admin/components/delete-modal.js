/**
 * Reusable Delete Modal Component
 * Handles delete confirmation modals with consistent styling and behavior
 */

export class DeleteModal {
  constructor(config) {
    this.config = {
      id: 'deleteModal',
      entityName: config.entityName,
      entityLabel: config.entityLabel || 'name',
      deleteUrlPath: config.deleteUrlPath,
      targetSelector: config.targetSelector || '.table',
      swapMode: config.swapMode || 'innerHTML',
      title: config.title || 'Are you sure?',
      message: config.message || null,
      buttonText: config.buttonText || 'Delete',
      csrfToken: config.csrfToken || '',
      
      // Conditional message config for Categories/Tags
      hasConditionalMessage: config.hasConditionalMessage || false,
      conditionalConfig: config.conditionalConfig || null
    };
  }

  render() {
    return `
      ${this.template()}
      ${this.script()}
    `;
  }

  template() {
    const { entityName, title, csrfToken } = this.config;
    
    // Conditional message HTML for Categories/Tags
    let messageHtml = '';
    if (this.config.hasConditionalMessage && this.config.conditionalConfig) {
      const { messageWithItems, messageWithoutItems } = this.config.conditionalConfig;
      messageHtml = `
        <div id="conditionalMessages">
          <p class="modal__description" id="deleteWithItems" style="display: none;">
            ${messageWithItems.replace('{count}', '<span id="deleteItemCount"></span>')}
          </p>
          <p class="modal__description" id="deleteNoItems" style="display: none;">
            ${messageWithoutItems}
          </p>
        </div>
      `;
    } else {
      messageHtml = `<p class="modal__description">${this.getMessage()}</p>`;
    }

    return `
      <div id="${this.config.id}" class="hs-overlay hidden" role="dialog" tabindex="-1" style="display: none;">
        <div class="fixed inset-0 bg-black/50 transition-opacity opacity-0" id="modalBackdrop"></div>
        <div class="fixed inset-0 z-50 flex min-h-full items-center justify-center p-4">
          <div class="modal__content modal__content--confirm">
            <div class="modal__header">
              <div class="modal__icon modal__icon--danger">
                <i data-lucide="alert-triangle" class="size-6"></i>
              </div>
              <h3 class="modal__title">${title}</h3>
              ${messageHtml}
            </div>

            <form 
              id="delete${entityName}Form"
              hx-delete=""
              hx-target="body"
              hx-swap="none"
              hx-on::after-request="closeDeleteModal()"
              class="modal__actions"
            >
              <input type="hidden" name="_csrf" value="${csrfToken}" />
              <button type="submit" class="btn btn--danger btn--full">
                ${this.config.buttonText}
              </button>
              <button type="button" class="btn btn--outline btn--full" onclick="closeDeleteModal()">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  script() {
    const { entityName, entityLabel, hasConditionalMessage, conditionalConfig } = this.config;
    
    let conditionalLogic = '';
    if (hasConditionalMessage && conditionalConfig) {
      conditionalLogic = `
        const itemCount = button.getAttribute('${conditionalConfig.countAttribute}');
        const hasItems = parseInt(itemCount) > 0;
        
        // Update both conditional messages with the entity name
        const withItemsMsg = document.getElementById('deleteWithItems');
        const noItemsMsg = document.getElementById('deleteNoItems');
        
        withItemsMsg.innerHTML = withItemsMsg.innerHTML.replace(/\\{name\\}/g, entityDisplayName);
        noItemsMsg.innerHTML = noItemsMsg.innerHTML.replace(/\\{name\\}/g, entityDisplayName);
        
        withItemsMsg.style.display = hasItems ? 'block' : 'none';
        noItemsMsg.style.display = hasItems ? 'none' : 'block';
        if (hasItems) {
          document.getElementById('deleteItemCount').textContent = itemCount;
        }
      `;
    }

    return `
      <script>
        function openDeleteModal(button) {
          const entityId = button.getAttribute('data-${entityName.toLowerCase()}-id');
          const entityDisplayName = button.getAttribute('data-${entityName.toLowerCase()}-${entityLabel}');
          
          const modal = document.getElementById('deleteModal');
          const form = document.getElementById('delete${entityName}Form');
          
          // Update form action
          form.setAttribute('hx-delete', '${this.config.deleteUrlPath}/' + entityId);
          if (typeof htmx !== 'undefined') {
            htmx.process(form);
          }
          
          // Update name display
          const nameElement = document.getElementById('deleteEntityName');
          if (nameElement) nameElement.textContent = entityDisplayName;
          
          ${conditionalLogic}
          
          // Show modal with animation
          modal.style.display = 'block';
          modal.classList.remove('hidden');
          
          setTimeout(() => {
            document.getElementById('modalBackdrop').classList.remove('opacity-0');
            modal.querySelector('.modal__content').classList.add('hs-overlay-open:scale-100');
          }, 10);
        }
        
        function closeDeleteModal() {
          const modal = document.getElementById('deleteModal');
          
          document.getElementById('modalBackdrop').classList.add('opacity-0');
          modal.querySelector('.modal__content').classList.remove('hs-overlay-open:scale-100');
          
          setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.display = 'none';
          }, 200);
        }
        
        // Close on backdrop click
        document.addEventListener('click', function(e) {
          if (e.target.id === 'modalBackdrop') {
            closeDeleteModal();
          }
        });
        
        // Close on escape key
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            closeDeleteModal();
          }
        });
        
        // Handle subscriber deleted event - remove row from table
        document.body.addEventListener('subscriberDeleted', function(evt) {
          if (evt.detail && evt.detail.id) {
            const row = document.getElementById('subscriber-' + evt.detail.id);
            if (row) {
              row.remove();
            }
          }
        });
      </script>
    `;
  }

  getMessage() {
    if (this.config.message) return this.config.message;
    return `This action cannot be undone. The <span id="deleteEntityName"></span> ${this.config.entityName.toLowerCase()} will be permanently deleted.`;
  }
}
