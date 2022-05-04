describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const firstUser = {
      name: 'Mark Smith',
      username: 'mark',
      password: 'pass123',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', firstUser);

    const secondUser = {
      name: 'John Parks',
      username: 'john',
      password: 'pass123',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', secondUser);

    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('mark');
      cy.get('#password').type('pass123');
      cy.get('#login-button').click();

      cy.get('.notification').should('contain', 'Logged in!');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mark');
      cy.get('#password').type('wrong123');
      cy.get('#login-button').click();

      cy.get('.notification')
        .should('contain', 'Wrong credentials')
        .should('have.css', 'background-color', 'rgb(255, 0, 0)');
      cy.get('html').should('not.contain', 'logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'mark', password: 'pass123' });
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();

      cy.get('input[name="Title"]').type('Callback hell');
      cy.get('input[name="Author"]').type('John Smith');
      cy.get('input[name="Url"]').type('http://blogs.com/callback-hell');
      cy.get('#create-blog-button').click();

      cy.contains('added!');
      cy.contains('Callback hell - John Smith');
    });

    it('User can like a blog', function () {
      cy.createBlog({
        author: 'Robert Jasper',
        title: 'Promise chaining',
        url: 'http://blogs.com/promise-chanining',
      });

      cy.contains('Promise chaining');
      cy.contains('view').click();
      cy.contains('likes 0');
      cy.contains('like').click();
      cy.contains('likes 1');
    });

    it('User can delete their blog', function () {
      cy.createBlog({
        author: 'Robert Jasper',
        title: 'Promise chaining',
        url: 'http://blogs.com/promise-chanining',
      });

      cy.contains('Promise chaining');
      cy.contains('view').click();
      cy.contains('delete').click();
      cy.get('html').should('not.contain', 'Promise chaining');
    });

    it('User cannot delete blog posted by another', function () {
      cy.createBlog({
        author: 'Robert Jasper',
        title: 'Promise chaining',
        url: 'http://blogs.com/promise-chanining',
      });

      cy.login({
        username: 'john',
        password: 'pass123',
      });

      cy.contains('Promise chaining');
      cy.contains('view').click();
      cy.get('html').should('not.contain', 'delete');
    });

    it('Blogs are ordered by number of likes', function () {
      cy.createBlog({
        author: 'Robert Jasper',
        title: 'Promise chaining',
        url: 'http://blogs.com/promise-chanining',
        likes: 4,
      });

      cy.createBlog({
        author: 'John Howard',
        title: 'Async await',
        url: 'http://blogs.com/async-await',
        likes: 1,
      });

      cy.createBlog({
        author: 'Kim Lovelace',
        title: 'The event loop',
        url: 'http://blogs.com/event-loop',
        likes: 3,
      });

      cy.createBlog({
        author: 'Natalie Lockley',
        title: 'JS frameworks',
        url: 'http://blogs.com/js-frameworks',
        likes: 2,
      });

      cy.contains('The event loop').contains('view').click();
      cy.contains('The event loop').contains('like').click().click();
      cy.wait(2000);

      cy.get('.blog:first').contains('The event loop');
      cy.get('.blog ~ .blog').contains('Promise chaining');
      cy.get('.blog ~ .blog ~ .blog').contains('JS frameworks');
      cy.get('.blog:last').contains('Async await');
    });
  });
});
