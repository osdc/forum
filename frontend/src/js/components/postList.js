// Import CSS
import stylesString from '../../css/components/postlist.css?inline';

// Parse into a constructable stylesheet
const postListStyles = new CSSStyleSheet();
postListStyles.replaceSync(stylesString);

const MOCK_POSTS = [
    {
        id: '1',
        title: 'Setting up Arch Linux',
        tags: ['linux', 'open-source'],
        author: 'Oingo Boingo',
        avatar: 'https://randomuser1.you',
        replies: 14,
        date: '15-08-2023',
    },
    {
        id: '2',
        title: 'My First Post',
        tags: ['general'],
        author: 'Boing Boing',
        avatar: 'https://randomuser2.you',
        replies: 5,
        date: '16-08-2023',
    },
    {
        id: '3',
        title: 'Understanding JavaScript Closures',
        tags: ['web-dev'],
        author: 'Judo Karate',
        avatar: 'https://randomuser3.you',
        replies: 6,
        date: '16-08-2023',
    },
    {
        id: '4',
        title: 'Fine-tuning Llama 3 locally for terminal command generation',
        tags: ['ai-ml', 'open-source'],
        author: 'Om Nom',
        avatar: 'https://boingboing.net',
        replies: 42,
        date: '03-08-2022',
    },
];

class PostList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [postListStyles];
        this.posts = MOCK_POSTS;
    }

    connectedCallback(){
        this.render();
    }

    filterByTag(selectedTag){
        if (selectedTag || selectedTag == '') {
            this.posts = MOCK_POSTS;
        } else {
            this.posts = MOCK_POSTS.filter(post => post.tags.includes(selectedTag));
        }
        this.render();
    }

    render() {
    this.shadowRoot.innerHTML = `
      <div class="table-header">
        <span>Title</span>
        <span>Author</span>
        <span>Replies</span>
        <span>Date</span>
      </div>

      <div class="posts-container">
        ${
          this.posts.length > 0
            ? this.posts
                .map(
                  post => `
              <div class="post-item" data-id="${post.id}">
                <!-- Subtle indigo gradient background overlay -->
                <div class="card-overlay"></div>

                <!-- Content layer above overlay -->
                <div class="post-content">
                  <div class="title-section">
                    <h3 class="post-title">${post.title}</h3>
                    <div class="tags-container">
                      ${post.tags.map(tag => `<span class="tag-chip">${tag}</span>`).join('')}
                    </div>
                  </div>

                  <div class="author-info">
                    <img class="avatar" alt="${post.author}" />
                    <span>${post.author}</span>
                  </div>

                  <span class="stat">${post.replies}</span>
                  <span class="stat">${post.date}</span>
                </div>
              </div>
            `
                )
                .join('')
            : '<div class="no-posts">No posts found for this tag.</div>'
        }
      </div>
    `;
    }
}

customElements.define('post-list', PostList);
