import { html, css, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import LiveState, { connectElement } from 'phx-live-state';

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

  liveState: LiveState;

  dateTimeFormatter = new Intl.DateTimeFormat('default');

  connectedCallback() {
    super.connectedCallback();
    console.log(`connecting to ${this.url}`);
    this.liveState = new LiveState(this.url, `comments:${window.location.href}`);
    connectElement(this.liveState, this, {
      properties: ['comments'],
      events: {
        send: ['add_comment'],
        receive: ['comment_added']
      }
    });
  }
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

  formatDateTime(dateTime) {
    const createdAt = new Date()
    createdAt.setTime(Date.parse(dateTime))
    return this.dateTimeFormatter.format(createdAt);
  }

  render() {
    return html`
      <div part="previous-comments">
        ${this.comments?.map(comment => html`
        <div part="comment">
          <div part="comment-text">${comment.text}</div>
          <div part="byline">
            <span part="comment-author">${comment.author}</span> on <span
              part="comment-created-at">${this.formatDateTime(comment.inserted_at)}</span>
          </div>
        </div>
        `)}
      </div>
      <div part="new-comment">
        <form @submit=${this.addComment} part="form">
          <div part="comment-field">
            <label part="label">Author</label>
            <input part="author-input" name="author" required />
          </div>
          <div part="comment-field">
            <label part="label">Comment</label>
            <textarea part="comment-input" name="text" required></textarea>
          </div>
          <button part="add-comment-button">Add Comment</button>
        </form>
      </div>
    `;
  }
}
