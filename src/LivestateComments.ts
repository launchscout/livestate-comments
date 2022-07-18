import { html, css, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { LiveStateController } from 'phx-live-state';

type Comment = {
  author: string;
  inserted_at: Date;
  text: string;
}

export class LivestateComments extends LitElement {

  @property()
  url: string

  @state()
  comments: Array<Comment> = [];

  private controller = new LiveStateController(this, {
    channel: `comments:${window.location.href}`,
    properties: ['comments'],
    events: {
      send: ['add_comment'],
      receive: ['comment_added']
    }
  });

  @query('input[name="author"]')
  author: HTMLInputElement | undefined;

  @query('textarea[name="text"]')
  text: HTMLTextAreaElement | undefined;

  addComment(e: Event) {
    this.dispatchEvent(new CustomEvent('add_comment', {
      detail: {
        author: this.author?.value,
        text: this.text?.value,
        url: window.location.href
      }
    }));
    e.preventDefault();
  }

  constructor() {
    super();
    this.addEventListener("comment_added", (e) => {
      console.log(e);
      this.clearNewComment();
    });
  }

  clearNewComment() {
    this.author!.value = '';
    this.text!.value = '';
  }

  render() {
    return html`
      <div part="previous-comments">
        ${this.comments?.map(comment => html`
        <div part="comment">
          <span part="comment-author">${comment.author}</span> at <span part="comment-created-at">${comment.inserted_at}</span>
          <div part="comment-text">${comment.text}</div>
        </div>
        `)}
      </div>
      <div part=" new-comment">
        <form @submit=${this.addComment}>
          <div part="comment-field">
            <label>Author</label>
            <input name="author" required />
          </div>
          <div part="comment-field">
            <label>Comment</label>
            <textarea name="text" required></textarea>
          </div>
          <button>Add Comment</button>
        </form>
      </div>
    `;
  }
}
